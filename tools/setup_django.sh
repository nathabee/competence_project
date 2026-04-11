#!/usr/bin/env bash

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
DEFAULT_PROJECT_PATH="$(cd "${SCRIPT_DIR}/.." && pwd)"

ACTION=""
CI_MODE=false
ASSUME_YES=false

PROJECT_PATH="${DEFAULT_PROJECT_PATH}"
VENV_PATH=""
PROJECT_NAME="competence_project"
APP_NAME="competence"
FIXTURE_PATH="competence/fixtures/initial_data.json"

DO_INSTALL_REQUIREMENTS=false
DO_START_PROJECT=false
DO_CREATE_APP=false
DO_MAKEMIGRATIONS=false
DO_MIGRATE=false
DO_LOAD_FIXTURE=false
DO_COPY_DATA_INIT=false
DO_POPULATE_DATA_INIT=false
DO_CREATE_GROUPS=false
DO_POPULATE_TEACHER=false
DO_POPULATE_TRANSLATION=false
DO_RESET_PASSWORDS=false
DO_COLLECTSTATIC=false
DO_CREATE_SUPERUSER=false
DO_RUNSERVER=false

show_help() {
    cat <<EOF
Usage: $0 [option] [flags]

Options:
  -h, --help                   Show this help message and exit.
  -s, --setup                  Interactive/manual setup mode.
  -t, --test                   Test whether the Django-side prerequisites are installed.

Flags:
      --ci                     Run in non-interactive mode.
  -y, --yes                    Auto-approve prompts in interactive mode.

      --project-path PATH      Project root path. Default: ${DEFAULT_PROJECT_PATH}
      --venv-path PATH         Virtual environment path. Default: <project-path>/venv
      --project-name NAME      Django project name. Default: competence_project
      --app-name NAME          Django app name. Default: competence
      --fixture-path PATH      Fixture file path relative to project root.
                               Default: competence/fixtures/initial_data.json

      --install-requirements   Install pip requirements from requirements.txt
      --start-project          Run django-admin startproject
      --create-app             Run python manage.py startapp
      --makemigrations         Run python manage.py makemigrations
      --migrate                Run python manage.py migrate
      --load-fixture           Run python manage.py loaddata <fixture-path>
      --copy-data-init         Run python manage.py copy_data_init
      --populate-data-init     Run python manage.py populate_data_init
      --create-groups          Run python manage.py create_groups_and_permissions
      --populate-teacher       Run python manage.py populate_teacher
      --populate-translation   Run python manage.py populate_translation
      --reset-passwords        Call tools/reset-django-pwd.sh
      --collectstatic          Run python manage.py collectstatic --noinput
      --create-superuser       Run python manage.py createsuperuser (interactive only)
      --runserver              Run python manage.py runserver 0.0.0.0:8080 (interactive only)

Examples:
  Interactive setup:
    $0 --setup

  CI migrate only:
    $0 --setup --ci --install-requirements --migrate

  CI reset/init path after DB reset:
    $0 --setup --ci --install-requirements --migrate --copy-data-init --populate-data-init --create-groups --populate-teacher --populate-translation --collectstatic

Notes:
  - This script is the single entry point for Django-side setup tasks.
  - In CI mode, no prompts are shown.
  - --create-superuser and --runserver are refused in --ci mode.
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

is_installed() {
    dpkg -s "$1" >/dev/null 2>&1
}

ensure_paths() {
    [[ -d "${PROJECT_PATH}" ]] || die "Project path does not exist: ${PROJECT_PATH}"

    if [[ -z "${VENV_PATH}" ]]; then
        VENV_PATH="${PROJECT_PATH}/venv"
    fi

    [[ -d "${VENV_PATH}" ]] || die "Virtual environment not found: ${VENV_PATH}"
    [[ -f "${VENV_PATH}/bin/activate" ]] || die "Virtual environment activation script not found: ${VENV_PATH}/bin/activate"
}

activate_venv() {
    # shellcheck disable=SC1090
    source "${VENV_PATH}/bin/activate"
}

test_installations() {
    ensure_paths

    info "Testing Django-side prerequisites..."

    echo -n "Python3: "
    if is_installed "python3"; then echo "Installed"; else echo "Not Installed"; fi

    echo -n "pip3: "
    if is_installed "python3-pip"; then echo "Installed"; else echo "Not Installed"; fi

    echo -n "Python Virtual Environment support (venv): "
    if is_installed "python3-venv"; then echo "Installed"; else echo "Not Installed"; fi

    echo -n "MySQL Server: "
    if is_installed "mysql-server"; then echo "Installed"; else echo "Not Installed"; fi

    echo -n "Virtual environment (${VENV_PATH}): "
    if [[ -d "${VENV_PATH}" ]]; then echo "Present"; else echo "Missing"; fi

    activate_venv

    echo -n "mysqlclient in virtual environment: "
    if python -m pip show mysqlclient >/dev/null 2>&1; then echo "Installed"; else echo "Not Installed"; fi

    echo -n "Django in virtual environment: "
    if python -c "import django" >/dev/null 2>&1; then echo "Installed"; else echo "Not Installed"; fi

    deactivate
}

install_requirements() {
    ensure_paths
    cd "${PROJECT_PATH}"

    info "Installing packages from requirements.txt..."
    activate_venv
    python -m pip install -r "${PROJECT_PATH}/requirements.txt"
    deactivate
}

start_django_project() {
    ensure_paths
    cd "${PROJECT_PATH}"

    activate_venv
    info "Starting Django project '${PROJECT_NAME}'..."
    django-admin startproject "${PROJECT_NAME}" .
    deactivate
}

create_django_app() {
    ensure_paths
    cd "${PROJECT_PATH}"

    activate_venv
    info "Creating Django app '${APP_NAME}'..."
    python manage.py startapp "${APP_NAME}"
    deactivate
}

run_makemigrations() {
    ensure_paths
    cd "${PROJECT_PATH}"

    activate_venv
    info "Running Django makemigrations..."
    python manage.py makemigrations
    deactivate
}

run_migrate() {
    ensure_paths
    cd "${PROJECT_PATH}"

    activate_venv
    info "Running Django migrate..."
    python manage.py migrate
    deactivate
}

run_loaddata() {
    ensure_paths
    cd "${PROJECT_PATH}"

    [[ -f "${PROJECT_PATH}/${FIXTURE_PATH}" ]] || die "Fixture file not found: ${PROJECT_PATH}/${FIXTURE_PATH}"

    activate_venv
    info "Loading fixture '${FIXTURE_PATH}'..."
    python manage.py loaddata "${FIXTURE_PATH}"
    deactivate
}

run_copy_data_init() {
    ensure_paths
    cd "${PROJECT_PATH}"

    activate_venv
    info "Running copy_data_init..."
    python manage.py copy_data_init
    deactivate
}

run_populate_data_init() {
    ensure_paths
    cd "${PROJECT_PATH}"

    activate_venv
    info "Running populate_data_init..."
    python manage.py populate_data_init
    deactivate
}

run_create_groups() {
    ensure_paths
    cd "${PROJECT_PATH}"

    activate_venv
    info "Running create_groups_and_permissions..."
    python manage.py create_groups_and_permissions
    deactivate
}

run_populate_teacher() {
    ensure_paths
    cd "${PROJECT_PATH}"

    activate_venv
    info "Running populate_teacher..."
    python manage.py populate_teacher
    deactivate
}

run_populate_translation() {
    ensure_paths
    cd "${PROJECT_PATH}"

    activate_venv
    info "Running populate_translation..."
    python manage.py populate_translation
    deactivate
}

run_reset_passwords() {
    ensure_paths
    cd "${PROJECT_PATH}"

    [[ -x "${PROJECT_PATH}/tools/reset-django-pwd.sh" ]] || die "Script not executable or missing: ${PROJECT_PATH}/tools/reset-django-pwd.sh"

    info "Running reset-django-pwd.sh..."
    "${PROJECT_PATH}/tools/reset-django-pwd.sh"
}

run_collectstatic() {
    ensure_paths
    cd "${PROJECT_PATH}"

    activate_venv
    info "Running collectstatic..."
    python manage.py collectstatic --noinput
    deactivate
}

create_django_superuser() {
    if [[ "${CI_MODE}" == "true" ]]; then
        die "--create-superuser cannot be used in --ci mode because it is interactive."
    fi

    ensure_paths
    cd "${PROJECT_PATH}"

    activate_venv
    info "Creating Django superuser..."
    python manage.py createsuperuser
    deactivate
}

start_django_server() {
    if [[ "${CI_MODE}" == "true" ]]; then
        die "--runserver cannot be used in --ci mode."
    fi

    ensure_paths
    cd "${PROJECT_PATH}"

    activate_venv
    info "Starting Django development server on 0.0.0.0:8080..."
    python manage.py runserver 0.0.0.0:8080
    deactivate
}

run_selected_tasks() {
    if [[ "${DO_INSTALL_REQUIREMENTS}" == "true" ]]; then install_requirements; fi
    if [[ "${DO_START_PROJECT}" == "true" ]]; then start_django_project; fi
    if [[ "${DO_CREATE_APP}" == "true" ]]; then create_django_app; fi
    if [[ "${DO_MAKEMIGRATIONS}" == "true" ]]; then run_makemigrations; fi
    if [[ "${DO_MIGRATE}" == "true" ]]; then run_migrate; fi
    if [[ "${DO_LOAD_FIXTURE}" == "true" ]]; then run_loaddata; fi
    if [[ "${DO_COPY_DATA_INIT}" == "true" ]]; then run_copy_data_init; fi
    if [[ "${DO_POPULATE_DATA_INIT}" == "true" ]]; then run_populate_data_init; fi
    if [[ "${DO_CREATE_GROUPS}" == "true" ]]; then run_create_groups; fi
    if [[ "${DO_POPULATE_TEACHER}" == "true" ]]; then run_populate_teacher; fi
    if [[ "${DO_POPULATE_TRANSLATION}" == "true" ]]; then run_populate_translation; fi
    if [[ "${DO_RESET_PASSWORDS}" == "true" ]]; then run_reset_passwords; fi
    if [[ "${DO_COLLECTSTATIC}" == "true" ]]; then run_collectstatic; fi
    if [[ "${DO_CREATE_SUPERUSER}" == "true" ]]; then create_django_superuser; fi
    if [[ "${DO_RUNSERVER}" == "true" ]]; then start_django_server; fi
}

interactive_setup() {
    ensure_paths

    if prompt_yes_no "Install pip requirements" "y"; then
        DO_INSTALL_REQUIREMENTS=true
    fi
    if prompt_yes_no "Start a new Django project" "n"; then
        DO_START_PROJECT=true
    fi
    if prompt_yes_no "Create a new Django app" "n"; then
        DO_CREATE_APP=true
    fi
    if prompt_yes_no "Run Django makemigrations" "n"; then
        DO_MAKEMIGRATIONS=true
    fi
    if prompt_yes_no "Run Django migrations" "y"; then
        DO_MIGRATE=true
    fi
    if prompt_yes_no "Load fixture data" "n"; then
        DO_LOAD_FIXTURE=true
    fi
    if prompt_yes_no "Run copy_data_init" "n"; then
        DO_COPY_DATA_INIT=true
    fi
    if prompt_yes_no "Run populate_data_init" "n"; then
        DO_POPULATE_DATA_INIT=true
    fi
    if prompt_yes_no "Create groups and permissions" "n"; then
        DO_CREATE_GROUPS=true
    fi
    if prompt_yes_no "Populate teacher data" "n"; then
        DO_POPULATE_TEACHER=true
    fi
    if prompt_yes_no "Populate translation data" "n"; then
        DO_POPULATE_TRANSLATION=true
    fi
    if prompt_yes_no "Reset default Django user passwords" "n"; then
        DO_RESET_PASSWORDS=true
    fi
    if prompt_yes_no "Run collectstatic" "n"; then
        DO_COLLECTSTATIC=true
    fi
    if prompt_yes_no "Create a Django superuser" "n"; then
        DO_CREATE_SUPERUSER=true
    fi
    if prompt_yes_no "Start Django development server" "n"; then
        DO_RUNSERVER=true
    fi

    run_selected_tasks
}

parse_args() {
    while [[ $# -gt 0 ]]; do
        case "$1" in
            -h|--help)
                show_help
                exit 0
                ;;
            -s|--setup)
                ACTION="setup"
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
            --venv-path)
                [[ $# -ge 2 ]] || die "--venv-path requires a value."
                VENV_PATH="$2"
                shift 2
                ;;
            --project-name)
                [[ $# -ge 2 ]] || die "--project-name requires a value."
                PROJECT_NAME="$2"
                shift 2
                ;;
            --app-name)
                [[ $# -ge 2 ]] || die "--app-name requires a value."
                APP_NAME="$2"
                shift 2
                ;;
            --fixture-path)
                [[ $# -ge 2 ]] || die "--fixture-path requires a value."
                FIXTURE_PATH="$2"
                shift 2
                ;;
            --install-requirements)
                DO_INSTALL_REQUIREMENTS=true
                shift
                ;;
            --start-project)
                DO_START_PROJECT=true
                shift
                ;;
            --create-app)
                DO_CREATE_APP=true
                shift
                ;;
            --makemigrations)
                DO_MAKEMIGRATIONS=true
                shift
                ;;
            --migrate)
                DO_MIGRATE=true
                shift
                ;;
            --load-fixture)
                DO_LOAD_FIXTURE=true
                shift
                ;;
            --copy-data-init)
                DO_COPY_DATA_INIT=true
                shift
                ;;
            --populate-data-init)
                DO_POPULATE_DATA_INIT=true
                shift
                ;;
            --create-groups)
                DO_CREATE_GROUPS=true
                shift
                ;;
            --populate-teacher)
                DO_POPULATE_TEACHER=true
                shift
                ;;
            --populate-translation)
                DO_POPULATE_TRANSLATION=true
                shift
                ;;
            --reset-passwords)
                DO_RESET_PASSWORDS=true
                shift
                ;;
            --collectstatic)
                DO_COLLECTSTATIC=true
                shift
                ;;
            --create-superuser)
                DO_CREATE_SUPERUSER=true
                shift
                ;;
            --runserver)
                DO_RUNSERVER=true
                shift
                ;;
            *)
                die "Invalid option: $1"
                ;;
        esac
    done

    [[ -n "${ACTION}" ]] || die "No action provided. Use --setup or --test."

    ensure_paths
}

main() {
    parse_args "$@"

    case "${ACTION}" in
        setup)
            if [[ "${CI_MODE}" == "true" ]]; then
                run_selected_tasks
            else
                if [[ "${DO_INSTALL_REQUIREMENTS}" == "true" || \
                      "${DO_START_PROJECT}" == "true" || \
                      "${DO_CREATE_APP}" == "true" || \
                      "${DO_MAKEMIGRATIONS}" == "true" || \
                      "${DO_MIGRATE}" == "true" || \
                      "${DO_LOAD_FIXTURE}" == "true" || \
                      "${DO_COPY_DATA_INIT}" == "true" || \
                      "${DO_POPULATE_DATA_INIT}" == "true" || \
                      "${DO_CREATE_GROUPS}" == "true" || \
                      "${DO_POPULATE_TEACHER}" == "true" || \
                      "${DO_POPULATE_TRANSLATION}" == "true" || \
                      "${DO_RESET_PASSWORDS}" == "true" || \
                      "${DO_COLLECTSTATIC}" == "true" || \
                      "${DO_CREATE_SUPERUSER}" == "true" || \
                      "${DO_RUNSERVER}" == "true" ]]; then
                    run_selected_tasks
                else
                    interactive_setup
                fi
            fi
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