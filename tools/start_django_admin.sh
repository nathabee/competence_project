#!/bin/bash

# Function to display help
show_help() {
    echo "Usage: $0 [option]"
    echo
    echo "Options:"
    echo "  -h, --help       Show this help message and exit."
    echo "  -a, --admin      Start the Django admin console."
    echo
}

# Function to start the Django admin console
start_django_admin() {
    echo "Activating the virtual environment..."
    source venv/bin/activate

    echo "Starting Django admin console..."
    python manage.py shell

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
    -a|--admin)
        start_django_admin
        ;;
    *)
        echo "Invalid option: $1"
        show_help
        exit 1
        ;;
esac
