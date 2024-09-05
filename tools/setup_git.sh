#!/bin/bash

# Display help information
show_help() {
    echo "Usage: $0 [-a | -c | -p | -h]"
    echo
    echo "Options:"
    echo "  -a    Add all changes to the staging area"
    echo "  -c    Commit changes with a message"
    echo "  -p    Pull changes from the remote repository before pushing"
    echo "  -h    Show this help message"
    echo 'Add, Commit, and Push Changes: ./setup_git.sh -a -c "Your commit message"'
}

# Add all changes to the staging area
add_changes() {
    echo "Adding all changes to the staging area..."
    git add .
    echo "Changes have been added."
}

# Commit changes with a message
commit_changes() {
    if [ -z "$1" ]; then
        echo "Error: Commit message is required."
        show_help
        exit 1
    fi
    echo "Committing changes with message: '$1'"
    git commit -m "$1"
    echo "Changes have been committed."
}

# Pull changes from the remote repository
pull_changes() {
    echo "Pulling changes from the remote repository..."
    git fetch origin
    git pull origin main --rebase
    echo "Repository has been updated."
}

# Push changes to the remote repository
push_changes() {
    echo "Pushing changes to the remote repository..."
    git push origin main
    echo "Changes have been pushed."
}

# Parse command line arguments
while getopts ":ac:ph" opt; do
    case ${opt} in
        a )
            add_changes
            ;;
        c )
            commit_changes "$OPTARG"
            ;;
        p )
            pull_changes
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

# If -p is specified, pull changes before pushing
if [ "$OPTIND" -eq 5 ] && [ "$1" == "-p" ]; then
    pull_changes
fi

# Commit and push if -a and -c are used together
if [ "$OPTIND" -eq 6 ] && [ "$1" == "-a" ] && [ "$2" == "-c" ]; then
    add_changes
    commit_changes "$3"
    push_changes
fi
