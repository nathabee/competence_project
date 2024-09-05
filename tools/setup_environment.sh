#!/bin/bash

# Function to display help
show_help() {
    echo "Usage: $0 [option]"
    echo
    echo "Options:"
    echo "  -h, --help       Show this help message and exit."
    echo "  -i, --install    Test and install the necessary components."
    echo "  -t, --test       Test if the necessary components are installed."
    echo
}

# Function to prompt user for installation
prompt_install() {
    read -p "Do you want to install $1? (y/n): " choice
    case "$choice" in
        y|Y ) return 0;;  # 0 for true in bash
        n|N ) return 1;;  # 1 for false in bash
        * ) echo "Invalid choice, please enter y or n."; prompt_install "$1";;
    esac
}

# Function to check if a package is installed
is_installed() {
    dpkg -l | grep -q "$1"
}

# Function to install a package if not installed
install_package() {
    if is_installed "$1"; then
        echo "$1 is already installed."
    else
        if prompt_install "$1"; then
            echo "Installing $1..."
            sudo apt install "$1" -y
        fi
    fi
}

# Function to test installations without installing
test_installations() {
    echo "Testing if the necessary components are installed..."
    
    echo -n "Apache Web Server: "
    if is_installed "apache2"; then
        echo "Installed"
    else
        echo "Not Installed"
    fi

    echo -n "Python3: "
    if is_installed "python3"; then
        echo "Installed"
    else
        echo "Not Installed"
    fi

    echo -n "pip3: "
    if is_installed "python3-pip"; then
        echo "Installed"
    else
        echo "Not Installed"
    fi

    echo -n "Python Virtual Environment support (venv): "
    if is_installed "python3-venv"; then
        echo "Installed"
    else
        echo "Not Installed"
    fi

    echo -n "MySQL Server: "
    if is_installed "mysql-server"; then
        echo "Installed"
    else
        echo "Not Installed"
    fi

    echo -n "Build Essentials: "
    if is_installed "build-essential"; then
        echo "Installed"
    else
        echo "Not Installed"
    fi

    echo -n "pkg-config: "
    if is_installed "pkg-config"; then
        echo "Installed"
    else
        echo "Not Installed"
    fi

    echo -n "Python3 Development Headers: "
    if is_installed "python3-dev"; then
        echo "Installed"
    else
        echo "Not Installed"
    fi

    echo -n "MySQL Client Development Libraries: "
    if is_installed "default-libmysqlclient-dev"; then
        echo "Installed"
    else
        echo "Not Installed"
    fi
}

# Function to install the necessary components
install_components() {
    echo "Updating package list..."
    sudo apt update
    
    # 1. Install Web Server (Apache)
    install_package "apache2"

    # 2. Install Python and pip
    install_package "python3"
    install_package "python3-pip"

    # 3. Set up Python Virtual Environment
    install_package "python3-venv"

    # 4. Install build tools and libraries for mysqlclient
    install_package "build-essential"
    install_package "pkg-config"
    install_package "python3-dev"
    install_package "default-libmysqlclient-dev"

    # 5. Create a virtual environment and install Django
    if prompt_install "Django in a Python Virtual Environment"; then
        if ! [ -d "venv" ]; then
            python3 -m venv venv
            echo "Created virtual environment 'venv'."
        else
            echo "Virtual environment 'venv' already exists."
        fi

        echo "Activating virtual environment..."
        source venv/bin/activate
        pip install --upgrade pip  # Always good to ensure pip is up-to-date
        if pip show django &> /dev/null; then
            echo "Django is already installed in the virtual environment."
        else
            echo "Installing Django..."
            pip install django
        fi
        deactivate
    fi

    # 6. Install MySQL Server
    install_package "mysql-server"

    # 7. Secure MySQL installation and create a new user and database
    if prompt_install "secure MySQL and create a new database and user"; then
        echo "Securing MySQL..."
        sudo mysql_secure_installation

        read -p "Enter the name for your new MySQL database: " db_name
        read -p "Enter the name for your new MySQL user: " db_user
        read -s -p "Enter the password for your new MySQL user: " db_pass
        echo

        sudo mysql -e "CREATE DATABASE ${db_name};"
        sudo mysql -e "CREATE USER '${db_user}'@'localhost' IDENTIFIED BY '${db_pass}';"
        sudo mysql -e "GRANT ALL PRIVILEGES ON ${db_name}.* TO '${db_user}'@'localhost';"
        sudo mysql -e "FLUSH PRIVILEGES;"

        echo "MySQL setup complete with database '${db_name}' and user '${db_user}'."
    fi

    echo "Environment setup complete. Review the above messages for any errors."
}

# Main script logic
if [[ "$#" -eq 0 ]]; then
    show_help
    exit 1
fi

case "$1" in
    -h|--help)
        show_help
        ;;
    -i|--install)
        install_components
        ;;
    -t|--test)
        test_installations
        ;;
    *)
        echo "Invalid option: $1"
        show_help
        exit 1
        ;;
esac
