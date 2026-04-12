#!/usr/bin/env bash

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
DEFAULT_PROJECT_PATH="$(cd "${SCRIPT_DIR}/.." && pwd)"

ACTION=""
CI_MODE=false
ASSUME_YES=false

PROJECT_PATH="${DEFAULT_PROJECT_PATH}"   # repo root
BACKEND_PATH=""
PROJECT_OWNER="$(stat -c '%U' "${DEFAULT_PROJECT_PATH}" 2>/dev/null || whoami)"
PROJECT_GROUP="www-data"
VENV_PATH=""

SAV_PATH=""
MEDIA_TARGET="/var/www/competence_project/media"
STATIC_TARGET="/var/www/competence_project/staticfiles"

DO_SECURE_MYSQL=false
DO_CREATE_DB=false
DO_PREPARE_SHARED_PATHS=false
DO_INSTALL_JENKINS=false
DO_WRITE_JENKINS_OVERRIDE=false
DO_ENABLE_JENKINS=false
DO_GRANT_JENKINS_ACCESS=false
DO_WRITE_JENKINS_MYCNF=false
DO_WRITE_JENKINS_SUDOERS=false
DO_RESET_DB=false

DB_NAME=""
DB_USER=""
DB_PASS=""
DB_HOST="localhost"

JENKINS_PORT="8081"
NODE_BIN=""
JENKINS_MYCNF_PATH="/var/lib/jenkins/.my.cnf"
JENKINS_SUDOERS_PATH="/etc/sudoers.d/jenkins-competence"

show_help() {
    cat <<EOF
Usage: $0 [action] [flags]

Actions:
  -h, --help                     Show this help message and exit.
  -i, --install                  Install base environment packages/components, then run selected flags.
  -a, --apply                    Apply only the selected flags. Do not run base package installation.
  -t, --test                     Test whether required components are installed.

General flags:
      --ci                       Run in non-interactive mode.
  -y, --yes                      Auto-approve prompts in interactive mode.
      --project-path PATH        Project root path. Default: ${DEFAULT_PROJECT_PATH}
      --project-owner USER       Owner user for project/shared paths. Default: detected project owner
      --project-group GROUP      Group for project/shared paths. Default: www-data
      --venv-path PATH           Virtual environment path. Default: <project-path>/venv
      --sav-path PATH            Backup/save path. Default: /home/<project-owner>/sav
      --media-target PATH        Media target directory. Default: /var/www/competence_project/media
      --static-target PATH       Staticfiles target directory. Default: /var/www/competence_project/staticfiles
      --project-path             repo root
      --backend-path             backend root
      --venv-path                default <backend-path>/venv

Database flags:
      --secure-mysql             Run mysql_secure_installation (interactive only)
      --create-db                Create or update the MySQL database and user
      --reset-db                 Drop and recreate the MySQL database, then recreate/update the user grants
      --db-name NAME             MySQL database name
      --db-user USER             MySQL username
      --db-pass PASS             MySQL password
      --db-host HOST             MySQL host for Jenkins client config. Default: localhost

Shared path flags:
      --prepare-shared-paths     Create/update sav, media, staticfiles targets and project symlinks

Jenkins flags:
      --install-jenkins          Install Jenkins package and prerequisites
      --write-jenkins-override   Write /etc/systemd/system/jenkins.service.d/override.conf
      --enable-jenkins           Run systemctl daemon-reload and enable --now jenkins
      --grant-jenkins-access     Grant Jenkins access to project/shared paths
      --write-jenkins-mycnf      Write /var/lib/jenkins/.my.cnf using DB flags
      --write-jenkins-sudoers    Write sudoers file for Jenkins service control and git access
      --jenkins-port PORT        Jenkins port. Default: 8081
      --node-bin PATH            Node bin directory exposed to Jenkins service.
                                 Default: /home/<project-owner>/.nvm/versions/node/v20.20.2/bin

Examples:
  Manual full install:
    $0 --install

  CI install for base environment + DB:
    $0 --install --ci --create-db --db-name competencedb --db-user competence_user --db-pass 'secret'

  CI apply shared paths only:
    $0 --apply --ci --prepare-shared-paths

  CI install and configure Jenkins:
    $0 --install --ci --install-jenkins --write-jenkins-override --grant-jenkins-access --write-jenkins-sudoers

  CI write Jenkins DB client config only:
    $0 --apply --ci --write-jenkins-mycnf --db-name competencedb --db-user competence_user --db-pass 'secret'

Notes:
  - Jenkins package installation requires a machine where systemd is available at runtime.
  - In CI mode, required values must be provided as flags.
  - Existing non-symlink media/staticfiles paths in the project tree are not silently moved in CI mode.
EOF
}

die() {
    echo "ERROR: $*" >&2
    exit 1
}

info() {
    echo "$*"
}

prompt_yes_no() {
    local prompt="$1"
    local default="${2:-n}"
    local choice=""

    if [[ "${ASSUME_YES}" == "true" ]]; then
        return 0
    fi

    while true; do
        if [[ "${default}" == "y" ]]; then
            read -r -p "${prompt} (Y/n): " choice
            choice="${choice:-Y}"
        else
            read -r -p "${prompt} (y/N): " choice
            choice="${choice:-N}"
        fi

        case "${choice}" in
            y|Y) return 0 ;;
            n|N) return 1 ;;
            *) echo "Invalid choice. Please enter y or n." ;;
        esac
    done
}

has_selected_operations() {
    [[ "${DO_SECURE_MYSQL}" == "true" ]] \
        || [[ "${DO_CREATE_DB}" == "true" ]] \
        || [[ "${DO_RESET_DB}" == "true" ]] \
        || [[ "${DO_PREPARE_SHARED_PATHS}" == "true" ]] \
        || [[ "${DO_INSTALL_JENKINS}" == "true" ]] \
        || [[ "${DO_WRITE_JENKINS_OVERRIDE}" == "true" ]] \
        || [[ "${DO_ENABLE_JENKINS}" == "true" ]] \
        || [[ "${DO_GRANT_JENKINS_ACCESS}" == "true" ]] \
        || [[ "${DO_WRITE_JENKINS_MYCNF}" == "true" ]] \
        || [[ "${DO_WRITE_JENKINS_SUDOERS}" == "true" ]]
}

is_installed() {
    dpkg -s "$1" >/dev/null 2>&1
}

install_package() {
    local package_name="$1"
    local label="${2:-$1}"

    if is_installed "${package_name}"; then
        info "${label}: already installed."
        return 0
    fi

    if [[ "${CI_MODE}" == "true" ]] || prompt_yes_no "Do you want to install ${label}?" "y"; then
        info "Installing ${label}..."
        sudo apt install -y "${package_name}"
    else
        info "Skipping ${label}."
    fi
}

sql_escape_string() {
    printf "%s" "$1" | sed "s/'/''/g"
}

validate_db_identifier() {
    local value="$1"
    local label="$2"

    if [[ ! "${value}" =~ ^[A-Za-z0-9_]+$ ]]; then
        die "${label} '${value}' is invalid. Use only letters, numbers, and underscores."
    fi
}

ensure_defaults() {
    [[ -e "${PROJECT_PATH}" ]] || die "Project path does not exist: ${PROJECT_PATH}"

    PROJECT_PATH="$(readlink -f "${PROJECT_PATH}")"
    [[ -d "${PROJECT_PATH}" ]] || die "Project path is not a directory: ${PROJECT_PATH}"

    if [[ -z "${BACKEND_PATH}" ]]; then
        BACKEND_PATH="${PROJECT_PATH}/backend"
    fi

    [[ -d "${BACKEND_PATH}" ]] || die "Backend path is not a directory: ${BACKEND_PATH}"

    if [[ -z "${VENV_PATH}" ]]; then
        VENV_PATH="${BACKEND_PATH}/venv"
    fi

    if [[ -z "${SAV_PATH}" ]]; then
        SAV_PATH="/home/${PROJECT_OWNER}/sav"
    fi

    if [[ -z "${NODE_BIN}" ]]; then
        NODE_BIN="/home/${PROJECT_OWNER}/.nvm/versions/node/v20.20.2/bin"
    fi
}

require_systemd_runtime() {
    command -v systemctl >/dev/null 2>&1 || die "systemctl binary not found. Jenkins .deb service installation requires systemd tooling."
    [[ -d /run/systemd/system ]] || die "systemd runtime is not active on this machine (/run/systemd/system missing). Do not use the Jenkins .deb service install here."
}

ensure_venv_and_django() {
    ensure_defaults
    cd "${PROJECT_PATH}"

    if [[ ! -d "${VENV_PATH}" ]]; then
        info "Creating virtual environment at ${VENV_PATH}..."
        python3 -m venv "${VENV_PATH}"
    else
        info "Virtual environment already exists at ${VENV_PATH}."
    fi

    # shellcheck disable=SC1090
    source "${VENV_PATH}/bin/activate"

    info "Upgrading pip in the virtual environment..."
    python -m pip install --upgrade pip

    if python -c "import django" >/dev/null 2>&1; then
        info "Django is already installed in the virtual environment."
    else
        info "Installing Django in the virtual environment..."
        python -m pip install django
    fi

    deactivate
}

run_mysql_secure_installation() {
    if [[ "${CI_MODE}" == "true" ]]; then
        die "--secure-mysql cannot be used with --ci because mysql_secure_installation is interactive."
    fi

    info "Running mysql_secure_installation..."
    sudo mysql_secure_installation
}

collect_db_values_if_needed() {
    if [[ "${CI_MODE}" == "true" ]]; then
        [[ -n "${DB_NAME}" ]] || die "--db-name is required in --ci mode when DB setup is requested."
        [[ -n "${DB_USER}" ]] || die "--db-user is required in --ci mode when DB setup is requested."
        [[ -n "${DB_PASS}" ]] || die "--db-pass is required in --ci mode when DB setup is requested."
        return 0
    fi

    if [[ -z "${DB_NAME}" ]]; then
        read -r -p "Enter the name for your MySQL database: " DB_NAME
    fi
    if [[ -z "${DB_USER}" ]]; then
        read -r -p "Enter the name for your MySQL user: " DB_USER
    fi
    if [[ -z "${DB_PASS}" ]]; then
        read -r -s -p "Enter the password for your MySQL user: " DB_PASS
        echo
    fi
}

create_or_update_mysql_database_and_user() {
    collect_db_values_if_needed

    validate_db_identifier "${DB_NAME}" "Database name"
    validate_db_identifier "${DB_USER}" "Database user"

    local escaped_pass
    local test_db_name
    escaped_pass="$(sql_escape_string "${DB_PASS}")"
    test_db_name="test_${DB_NAME}"

    info "Creating/updating MySQL database '${DB_NAME}' and user '${DB_USER}'..."

    sudo mysql <<SQL
CREATE DATABASE IF NOT EXISTS \`${DB_NAME}\`
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

CREATE USER IF NOT EXISTS '${DB_USER}'@'localhost' IDENTIFIED BY '${escaped_pass}';
ALTER USER '${DB_USER}'@'localhost' IDENTIFIED BY '${escaped_pass}';

GRANT ALL PRIVILEGES ON \`${DB_NAME}\`.* TO '${DB_USER}'@'localhost';
GRANT ALL PRIVILEGES ON \`${test_db_name}\`.* TO '${DB_USER}'@'localhost';
FLUSH PRIVILEGES;
SQL

    info "MySQL setup complete with database '${DB_NAME}', test database '${test_db_name}', and user '${DB_USER}'."
}

reset_mysql_database_and_user() {
    collect_db_values_if_needed

    validate_db_identifier "${DB_NAME}" "Database name"
    validate_db_identifier "${DB_USER}" "Database user"

    local escaped_pass
    local test_db_name
    escaped_pass="$(sql_escape_string "${DB_PASS}")"
    test_db_name="test_${DB_NAME}"

    info "Dropping and recreating MySQL database '${DB_NAME}' and refreshing user '${DB_USER}'..."

    sudo mysql <<SQL
DROP DATABASE IF EXISTS \`${DB_NAME}\`;
DROP DATABASE IF EXISTS \`${test_db_name}\`;

CREATE DATABASE \`${DB_NAME}\`
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

CREATE USER IF NOT EXISTS '${DB_USER}'@'localhost' IDENTIFIED BY '${escaped_pass}';
ALTER USER '${DB_USER}'@'localhost' IDENTIFIED BY '${escaped_pass}';

GRANT ALL PRIVILEGES ON \`${DB_NAME}\`.* TO '${DB_USER}'@'localhost';
GRANT ALL PRIVILEGES ON \`${test_db_name}\`.* TO '${DB_USER}'@'localhost';
FLUSH PRIVILEGES;
SQL

    info "MySQL reset complete with database '${DB_NAME}', grant for test database '${test_db_name}', and user '${DB_USER}'."
}

backup_existing_path_interactive() {
    local path="$1"
    local backup_path="${path}.bak"

    if [[ "${CI_MODE}" == "true" ]]; then
        die "Path exists and is not a symlink: ${path}"
    fi

    if prompt_yes_no "Path ${path} exists and is not a symlink. Move it to ${backup_path}?" "n"; then
        mv "${path}" "${backup_path}"
        info "Moved ${path} to ${backup_path}"
    else
        die "Refusing to replace existing non-symlink path: ${path}"
    fi
}

ensure_symlink() {
    local link_path="$1"
    local target_path="$2"

    if [[ -L "${link_path}" ]]; then
        ln -sfn "${target_path}" "${link_path}"
        return 0
    fi

    if [[ -e "${link_path}" ]]; then
        backup_existing_path_interactive "${link_path}"
    fi

    ln -s "${target_path}" "${link_path}"
}

prepare_shared_paths() {
    ensure_defaults

    local web_root
    web_root="$(dirname "${MEDIA_TARGET}")"

    sudo mkdir -p "${SAV_PATH}"
    sudo mkdir -p "${MEDIA_TARGET}/origin/competence/header_icons"
    sudo mkdir -p "${MEDIA_TARGET}/origin/competence/png"
    sudo mkdir -p "${MEDIA_TARGET}/competence/header_icons"
    sudo mkdir -p "${MEDIA_TARGET}/competence/png"
    sudo mkdir -p "${STATIC_TARGET}"

    sudo chown -R "${PROJECT_OWNER}:${PROJECT_GROUP}" "${SAV_PATH}" "${web_root}"
    sudo find "${SAV_PATH}" "${web_root}" -type d -exec chmod 2775 {} \;

    cd "${PROJECT_PATH}"
    ensure_symlink "${BACKEND_PATH}/media" "${MEDIA_TARGET}"
    ensure_symlink "${BACKEND_PATH}/staticfiles" "${STATIC_TARGET}"

    info "Shared paths prepared."
    ls -ld "${BACKEND_PATH}/media" "${MEDIA_TARGET}" "${BACKEND_PATH}/staticfiles" "${STATIC_TARGET}" "${SAV_PATH}"
}

install_jenkins() {
    ensure_defaults
    require_systemd_runtime

    install_package "fontconfig" "fontconfig"
    install_package "openjdk-21-jre" "OpenJDK 21 JRE"
    install_package "wget" "wget"
    install_package "ca-certificates" "CA certificates"

    sudo install -d -m 0755 /etc/apt/keyrings

    if [[ ! -f /etc/apt/keyrings/jenkins-keyring.asc ]]; then
        info "Installing Jenkins repository key..."
        sudo wget -q -O /etc/apt/keyrings/jenkins-keyring.asc \
          https://pkg.jenkins.io/debian-stable/jenkins.io-2026.key
    fi

    info "Installing Jenkins APT source..."
    echo "deb [signed-by=/etc/apt/keyrings/jenkins-keyring.asc] https://pkg.jenkins.io/debian-stable binary/" \
      | sudo tee /etc/apt/sources.list.d/jenkins.list >/dev/null

    sudo apt update
    sudo apt install -y jenkins

    info "Jenkins package installed."
}

write_jenkins_override() {
    require_systemd_runtime

    sudo mkdir -p /etc/systemd/system/jenkins.service.d
    sudo tee /etc/systemd/system/jenkins.service.d/override.conf >/dev/null <<EOF
[Service]
Environment="JENKINS_PORT=${JENKINS_PORT}"
Environment="PATH=${NODE_BIN}:/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin"
EOF

    info "Wrote /etc/systemd/system/jenkins.service.d/override.conf"
}

enable_jenkins() {
    require_systemd_runtime
    sudo systemctl daemon-reload
    sudo systemctl enable --now jenkins
    sudo systemctl status jenkins --no-pager || true
}

grant_jenkins_access() {
    ensure_defaults

    install_package "acl" "ACL support"

    local project_home
    local web_root
    project_home="$(dirname "${PROJECT_PATH}")"
    web_root="$(dirname "${MEDIA_TARGET}")"

    sudo mkdir -p "${SAV_PATH}"
    sudo chown "${PROJECT_OWNER}:${PROJECT_GROUP}" "${SAV_PATH}"
    sudo chmod 2775 "${SAV_PATH}"

    if id jenkins >/dev/null 2>&1; then
        sudo usermod -aG "${PROJECT_GROUP}" jenkins || true
    else
        die "User 'jenkins' does not exist yet. Install Jenkins first."
    fi

    sudo chgrp -R "${PROJECT_GROUP}" "${PROJECT_PATH}" "${SAV_PATH}" "${web_root}"
    sudo chmod -R g+rwX "${PROJECT_PATH}" "${SAV_PATH}" "${web_root}"
    sudo find "${PROJECT_PATH}" "${SAV_PATH}" "${web_root}" -type d -exec chmod g+s {} \;

    sudo setfacl -m u:jenkins:rx "${project_home}"
    sudo setfacl -m u:jenkins:rwx "${SAV_PATH}"
    sudo setfacl -R -m u:jenkins:rwx "${PROJECT_PATH}"
    sudo setfacl -R -m u:jenkins:rwx "${web_root}"

    info "Granted Jenkins access to project/shared paths."
}

write_jenkins_mycnf() {
    collect_db_values_if_needed

    if ! id jenkins >/dev/null 2>&1; then
        die "User 'jenkins' does not exist yet. Install Jenkins first."
    fi

    sudo tee "${JENKINS_MYCNF_PATH}" >/dev/null <<EOF
[client]
user=${DB_USER}
password=${DB_PASS}
host=${DB_HOST}
EOF

    sudo chown jenkins:jenkins "${JENKINS_MYCNF_PATH}"
    sudo chmod 600 "${JENKINS_MYCNF_PATH}"

    info "Wrote ${JENKINS_MYCNF_PATH}"
}

write_jenkins_sudoers() {
    ensure_defaults

    sudo tee "${JENKINS_SUDOERS_PATH}" >/dev/null <<EOF
jenkins ALL=NOPASSWD: /usr/bin/systemctl daemon-reload, /usr/bin/systemctl start gunicorn, /usr/bin/systemctl stop gunicorn, /usr/bin/systemctl start npm-app, /usr/bin/systemctl stop npm-app
jenkins ALL=(root) NOPASSWD: /usr/bin/mysql, /usr/bin/mysqldump
jenkins ALL=(${PROJECT_OWNER}) NOPASSWD: /usr/bin/git
EOF

    sudo chmod 440 "${JENKINS_SUDOERS_PATH}"
    sudo visudo -cf "${JENKINS_SUDOERS_PATH}"

    info "Wrote ${JENKINS_SUDOERS_PATH}"
}

test_installations() {
    ensure_defaults

    info "Testing environment components..."

    echo -n "Apache Web Server: "
    if is_installed "apache2"; then echo "Installed"; else echo "Not Installed"; fi

    echo -n "Python3: "
    if is_installed "python3"; then echo "Installed"; else echo "Not Installed"; fi

    echo -n "pip3: "
    if is_installed "python3-pip"; then echo "Installed"; else echo "Not Installed"; fi

    echo -n "Python Virtual Environment support (venv): "
    if is_installed "python3-venv"; then echo "Installed"; else echo "Not Installed"; fi

    echo -n "MySQL Server: "
    if is_installed "mysql-server"; then echo "Installed"; else echo "Not Installed"; fi

    echo -n "Build Essentials: "
    if is_installed "build-essential"; then echo "Installed"; else echo "Not Installed"; fi

    echo -n "pkg-config: "
    if is_installed "pkg-config"; then echo "Installed"; else echo "Not Installed"; fi

    echo -n "Python3 Development Headers: "
    if is_installed "python3-dev"; then echo "Installed"; else echo "Not Installed"; fi

    echo -n "MySQL Client Development Libraries: "
    if is_installed "default-libmysqlclient-dev"; then echo "Installed"; else echo "Not Installed"; fi

    echo -n "systemctl binary: "
    if command -v systemctl >/dev/null 2>&1; then echo "Present"; else echo "Missing"; fi

    echo -n "systemd runtime (/run/systemd/system): "
    if [[ -d /run/systemd/system ]]; then echo "Present"; else echo "Missing"; fi

    echo -n "Jenkins package: "
    if is_installed "jenkins"; then echo "Installed"; else echo "Not Installed"; fi

    echo -n "Project virtual environment (${VENV_PATH}): "
    if [[ -d "${VENV_PATH}" ]]; then echo "Present"; else echo "Missing"; fi

    if [[ -d "${VENV_PATH}" ]]; then
        # shellcheck disable=SC1090
        source "${VENV_PATH}/bin/activate"
        echo -n "Django in virtual environment: "
        if python -c "import django" >/dev/null 2>&1; then echo "Installed"; else echo "Not Installed"; fi
        deactivate
    fi
}

install_components() {
    ensure_defaults

    info "Updating package list..."
    sudo apt update

    install_package "apache2" "Apache Web Server"
    install_package "python3" "Python3"
    install_package "python3-pip" "pip3"
    install_package "python3-venv" "Python Virtual Environment support (venv)"
    install_package "build-essential" "Build Essentials"
    install_package "pkg-config" "pkg-config"
    install_package "python3-dev" "Python3 Development Headers"
    install_package "default-libmysqlclient-dev" "MySQL Client Development Libraries"
    install_package "mysql-server" "MySQL Server"

    if [[ "${CI_MODE}" == "true" ]] || prompt_yes_no "Do you want to create the Python virtual environment and install Django?" "y"; then
        ensure_venv_and_django
    fi

 

    if [[ "${DO_SECURE_MYSQL}" == "true" ]]; then
        run_mysql_secure_installation
    elif [[ "${CI_MODE}" == "false" ]] && prompt_yes_no "Do you want to run mysql_secure_installation?" "n"; then
        run_mysql_secure_installation
    fi

    if [[ "${DO_RESET_DB}" == "true" ]]; then
        reset_mysql_database_and_user
    elif [[ "${DO_CREATE_DB}" == "true" ]]; then
        create_or_update_mysql_database_and_user
    elif [[ "${CI_MODE}" == "false" ]] && prompt_yes_no "Do you want to create or update a MySQL database and user?" "n"; then
        create_or_update_mysql_database_and_user
    fi

 

    if [[ "${DO_PREPARE_SHARED_PATHS}" == "true" ]]; then
        prepare_shared_paths
    elif [[ "${CI_MODE}" == "false" ]] && prompt_yes_no "Do you want to prepare sav/media/staticfiles paths and symlinks?" "n"; then
        prepare_shared_paths
    fi


    if [[ "${DO_INSTALL_JENKINS}" == "true" ]]; then
        install_jenkins
    elif [[ "${CI_MODE}" == "false" ]] && prompt_yes_no "Do you want to install Jenkins?" "n"; then
        install_jenkins
    fi

    if [[ "${DO_WRITE_JENKINS_OVERRIDE}" == "true" ]]; then
        write_jenkins_override
    elif [[ "${CI_MODE}" == "false" ]] && prompt_yes_no "Do you want to write the Jenkins systemd override?" "n"; then
        write_jenkins_override
    fi

    if [[ "${DO_GRANT_JENKINS_ACCESS}" == "true" ]]; then
        grant_jenkins_access
    elif [[ "${CI_MODE}" == "false" ]] && prompt_yes_no "Do you want to grant Jenkins access to project/shared paths?" "n"; then
        grant_jenkins_access
    fi

    if [[ "${DO_WRITE_JENKINS_MYCNF}" == "true" ]]; then
        write_jenkins_mycnf
    elif [[ "${CI_MODE}" == "false" ]] && prompt_yes_no "Do you want to write the Jenkins MySQL client file?" "n"; then
        write_jenkins_mycnf
    fi

    if [[ "${DO_WRITE_JENKINS_SUDOERS}" == "true" ]]; then
        write_jenkins_sudoers
    elif [[ "${CI_MODE}" == "false" ]] && prompt_yes_no "Do you want to write the Jenkins sudoers file?" "n"; then
        write_jenkins_sudoers
    fi

    if [[ "${DO_ENABLE_JENKINS}" == "true" ]]; then
        enable_jenkins
    elif [[ "${CI_MODE}" == "false" ]] && prompt_yes_no "Do you want to daemon-reload and enable/start Jenkins now?" "n"; then
        enable_jenkins
    fi

    info "Environment setup complete."
}

apply_selected_components() {
    ensure_defaults

    has_selected_operations || die "No operation flag provided for --apply."

    if [[ "${DO_SECURE_MYSQL}" == "true" ]]; then
        run_mysql_secure_installation
    fi

    if [[ "${DO_RESET_DB}" == "true" ]]; then
        reset_mysql_database_and_user
    elif [[ "${DO_CREATE_DB}" == "true" ]]; then
        create_or_update_mysql_database_and_user
    fi

 

    if [[ "${DO_PREPARE_SHARED_PATHS}" == "true" ]]; then
        prepare_shared_paths
    fi

    if [[ "${DO_INSTALL_JENKINS}" == "true" ]]; then
        install_jenkins
    fi

    if [[ "${DO_WRITE_JENKINS_OVERRIDE}" == "true" ]]; then
        write_jenkins_override
    fi

    if [[ "${DO_GRANT_JENKINS_ACCESS}" == "true" ]]; then
        grant_jenkins_access
    fi

    if [[ "${DO_WRITE_JENKINS_MYCNF}" == "true" ]]; then
        write_jenkins_mycnf
    fi

    if [[ "${DO_WRITE_JENKINS_SUDOERS}" == "true" ]]; then
        write_jenkins_sudoers
    fi

    if [[ "${DO_ENABLE_JENKINS}" == "true" ]]; then
        enable_jenkins
    fi

    info "Selected environment operations applied."
}

parse_args() {
    while [[ $# -gt 0 ]]; do
        case "$1" in
            -h|--help)
                show_help
                exit 0
                ;;
            -i|--install)
                ACTION="install"
                shift
                ;;
            -a|--apply)
                ACTION="apply"
                shift
                ;;
            -t|--test)
                ACTION="test"
                shift
                ;;
            --ci)
                CI_MODE=true
                ASSUME_YES=true
                shift
                ;;
            -y|--yes)
                ASSUME_YES=true
                shift
                ;;
            --project-path)
                [[ $# -ge 2 ]] || die "--project-path requires a value."
                PROJECT_PATH="$2"
                shift 2
                ;;
            --project-owner)
                [[ $# -ge 2 ]] || die "--project-owner requires a value."
                PROJECT_OWNER="$2"
                shift 2
                ;;
            --project-group)
                [[ $# -ge 2 ]] || die "--project-group requires a value."
                PROJECT_GROUP="$2"
                shift 2
                ;;
            --venv-path)
                [[ $# -ge 2 ]] || die "--venv-path requires a value."
                VENV_PATH="$2"
                shift 2
                ;;
            --sav-path)
                [[ $# -ge 2 ]] || die "--sav-path requires a value."
                SAV_PATH="$2"
                shift 2
                ;;
            --media-target)
                [[ $# -ge 2 ]] || die "--media-target requires a value."
                MEDIA_TARGET="$2"
                shift 2
                ;;
            --static-target)
                [[ $# -ge 2 ]] || die "--static-target requires a value."
                STATIC_TARGET="$2"
                shift 2
                ;;
            --secure-mysql)
                DO_SECURE_MYSQL=true
                shift
                ;;
            --create-db)
                DO_CREATE_DB=true
                shift
                ;;
            --reset-db)
                DO_RESET_DB=true
                shift
                ;;
            --db-name)
                [[ $# -ge 2 ]] || die "--db-name requires a value."
                DB_NAME="$2"
                DO_CREATE_DB=true
                shift 2
                ;;
            --db-user)
                [[ $# -ge 2 ]] || die "--db-user requires a value."
                DB_USER="$2"
                DO_CREATE_DB=true
                shift 2
                ;;
            --db-pass)
                [[ $# -ge 2 ]] || die "--db-pass requires a value."
                DB_PASS="$2"
                DO_CREATE_DB=true
                shift 2
                ;;
            --db-host)
                [[ $# -ge 2 ]] || die "--db-host requires a value."
                DB_HOST="$2"
                shift 2
                ;;
            --prepare-shared-paths)
                DO_PREPARE_SHARED_PATHS=true
                shift
                ;;
            --install-jenkins)
                DO_INSTALL_JENKINS=true
                shift
                ;;
            --write-jenkins-override)
                DO_WRITE_JENKINS_OVERRIDE=true
                shift
                ;;
            --enable-jenkins)
                DO_ENABLE_JENKINS=true
                shift
                ;;
            --grant-jenkins-access)
                DO_GRANT_JENKINS_ACCESS=true
                shift
                ;;
            --write-jenkins-mycnf)
                DO_WRITE_JENKINS_MYCNF=true
                shift
                ;;
            --write-jenkins-sudoers)
                DO_WRITE_JENKINS_SUDOERS=true
                shift
                ;;
            --jenkins-port)
                [[ $# -ge 2 ]] || die "--jenkins-port requires a value."
                JENKINS_PORT="$2"
                shift 2
                ;;
            --node-bin)
                [[ $# -ge 2 ]] || die "--node-bin requires a value."
                NODE_BIN="$2"
                shift 2
                ;;
            --backend-path)
                [[ $# -ge 2 ]] || die "--backend-path requires a value."
                BACKEND_PATH="$2"
                shift 2
                ;;
            *)
                die "Invalid option: $1"
                ;;
        esac
    done

    [[ -n "${ACTION}" ]] || die "No action provided. Use --install, --apply, or --test."
    ensure_defaults
}

main() {
    parse_args "$@"

    case "${ACTION}" in
        install)
            install_components
            ;;
        apply)
            apply_selected_components
            ;;
        test)
            test_installations
            ;;
        *)
            die "Unsupported action: ${ACTION}"
            ;;
    esac
}

main "$@"