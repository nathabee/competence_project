#!/bin/bash

# Function to display help
show_help() {
    echo "Usage: $0 [option]"
    echo
    echo "Options:"
    echo "  -h, --help       Show this help message and exit."
    echo "  -i, --install    Install Git, configure Git, and clone the repository."
}

# Function to install Git and configure it
install_and_configure_git() {
    echo "Updating package list..."
    sudo apt-get update

    echo "Installing Git..."
    sudo apt-get install -y git

    # Prompt for Git configuration
    read -p "Enter your Git user name: " git_user_name
    read -p "Enter your Git email address: " git_email_address

    echo "Configuring Git..."
    git config --global user.name "$git_user_name"
    git config --global user.email "$git_email_address"

    echo "Git installation and configuration complete."
}

# Function to clone the GitHub repository
clone_repository() {
    local repo_url="https://github.com/nathabee/django-asteroid.git"
    local project_dir="django-asteroid"

    echo "Cloning repository from $repo_url..."

    # Clone the repository into the project directory
    git clone "$repo_url" "$project_dir"

    echo "Repository cloned into $project_dir."
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
        install_and_configure_git
        clone_repository
        ;;
    *)
        echo "Invalid option: $1"
        show_help
        exit 1
        ;;
esac
