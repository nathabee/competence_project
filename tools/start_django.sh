#!/bin/bash

# Function to display help
show_help() {
    echo "Usage: $0 [option]"
    echo
    echo "Options:"
    echo "  -h, --help       Show this help message and exit."
    echo "  -s, --start      Start the Django development server."
    echo
}

# Function to start the Django development server
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
    -s|--start)
        start_django_server
        ;;
    *)
        echo "Invalid option: $1"
        show_help
        exit 1
        ;;
esac
