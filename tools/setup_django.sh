#!/bin/bash 

# Function to check if a command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Check for necessary system packages
echo "Checking for necessary system packages..."

if ! command_exists pkg-config || ! dpkg -l | grep -q libmysqlclient-dev; then
    echo "Required system packages are missing. Installing them now..."
    sudo apt update
    sudo apt install -y build-essential pkg-config python3-dev default-libmysqlclient-dev
else
    echo "All necessary system packages are already installed."
fi
 



# Function to display help
show_help() {
    echo "Usage: $0 [option]"
    echo
    echo "Options:"
    echo "  -h, --help       Show this help message and exit."
    echo "  -s, --setup      Set up the Django project and application."
    echo "  -t, --test       Test if the necessary components are installed."
    echo
}

# Function to prompt user for continuation
prompt_continue() {
    read -p "$1 (y/n): " choice
    case "$choice" in
        y|Y ) return 0;;
        n|N ) return 1;;
        * ) echo "Invalid choice, please enter y or n."; prompt_continue "$1";;
    esac
}

# Function to check if a package is installed
is_installed() {
    dpkg -l | grep -q "$1"
}

# Function to test if necessary components are installed
test_installations() {
    echo "Testing if the necessary components are installed..."

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

    echo -n "MySQL Client Library (mysqlclient): "
    source venv/bin/activate
    if pip show mysqlclient &> /dev/null; then
        echo "Installed"
    else
        echo "Not Installed"
    fi
    deactivate
}

# Function to install Django and MySQL client
install_requirements() {
    echo "Activating the virtual environment..."
    source venv/bin/activate
     
    echo "Installing packages from requirements.txt..."
    pip install -r ./requirements.txt

    deactivate
}

# Function to start a new Django project
start_django_project() {
    echo "Activating the virtual environment..."
    source venv/bin/activate

    read -p "Enter your Django project name (default: competence_project): " project_name
    project_name=${project_name:-competence_project}

    echo "Starting Django project '$project_name'..."
    django-admin startproject "$project_name" .

    deactivate
}

# Function to create a new Django app
create_django_app() {
    echo "Activating the virtual environment..."
    source venv/bin/activate

    read -p "Enter your Django app name (default: competence): " app_name
    app_name=${app_name:-competence}

    echo "Creating Django app '$app_name'..."
    python manage.py startapp "$app_name"

    deactivate
}
 


# Function to run Django migrations
run_django_migrations() {
    echo "Activating the virtual environment..."
    source venv/bin/activate

    echo "Running Django migrations..."
    python manage.py makemigrations
    python manage.py migrate

    deactivate
}

# Function to create a Django superuser
create_django_superuser() {
    echo "Activating the virtual environment..."
    source venv/bin/activate

    echo "Creating Django superuser..."
    python manage.py createsuperuser

    deactivate
}

# Function to start Django development server
start_django_server() {
    echo "Activating the virtual environment..."
    source venv/bin/activate

    echo "Starting Django development server on 0.0.0.0:8080..."
    python manage.py runserver 0.0.0.0:8080

    deactivate
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
    -s|--setup)
        if prompt_continue "Install pip requirements"; then
            install_requirements
        fi
        if prompt_continue "Start a new Django project"; then
            start_django_project
        fi
        if prompt_continue "Create a new Django app"; then
            create_django_app
        fi
        if prompt_continue "Run Django migrations"; then
            run_django_migrations
        fi
        if prompt_continue "Create a Django superuser"; then
            create_django_superuser
        fi
        if prompt_continue "Start Django development server"; then
            start_django_server
        fi
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
