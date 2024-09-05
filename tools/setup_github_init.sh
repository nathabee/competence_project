#!/bin/bash

# Display help information
show_help() {
    echo "Usage: $0 [-i | -t | -h]"
    echo
    echo "Options:"
    echo "  -i    Initialize Git repository and push to remote"
    echo "  -t    Test if the Git remote exists"
    echo "  -h    Show this help message"
}

# Test if Git remote exists
test_git_remote() {
    echo "Testing if the Git remote exists..."
    if git ls-remote https://github.com/nathabee/django-asteroid.git &> /dev/null; then
        echo "Git remote exists. URL: https://github.com/nathabee/django-asteroid.git"
    else
        echo "Git remote does not exist. Please check the URL or create the remote repository."
        exit 1
    fi
}

# Initialize Git repository and push to remote
initialize_git() {
    echo "Initializing Git repository and pushing to remote..."

    if [ -d ".git" ]; then
        echo "Git repository already initialized."
    else
        git init
        git remote add origin https://github.com/nathabee/django-asteroid.git
    fi

    echo "Remote configuration:"
    git remote -v

    echo "Adding files to staging area..."
    git add .

    echo "Committing changes..."
    git commit -m "Initial commit with Django project setup"

    echo "Fetching latest changes from the remote repository..."
    git fetch origin

    echo "Merging remote changes into local branch..."
    git pull origin main --rebase

    echo "Pushing to GitHub..."
    git push -u origin main
}

# Parse command line arguments
while getopts ":iht" opt; do
    case ${opt} in
        i )
            initialize_git
            ;;
        t )
            test_git_remote
            ;;
        h )
            show_help
            ;;
        \? )
            echo "Invalid option: -$OPTARG" 1>&2
            show_help
            exit 1
            ;;
        : )
            echo "Invalid option: -$OPTARG requires an argument" 1>&2
            show_help
            exit 1
            ;;
    esac
done

# If no options were provided, show help
if [ $OPTIND -eq 1 ]; then
    show_help
fi
