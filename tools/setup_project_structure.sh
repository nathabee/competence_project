#!/bin/bash

# Define the base directory for your Django project
BASE_DIR="django_asteroid_project"

# Create base directory
mkdir -p $BASE_DIR

# Navigate to the base directory
cd $BASE_DIR

echo "Creating project structure in $(pwd)..."

# Create Django project and app directories (these will be created by Django, so just placeholders here)
mkdir -p competence_project/competence/migrations

# Create directories for database scripts
mkdir -p db_scripts

# Create directories for frontend, static, and templates files
mkdir -p frontend/public
mkdir -p frontend/src
mkdir -p static/css
mkdir -p static/js
mkdir -p static/images
mkdir -p templates

# Create empty placeholder files where needed
touch db_scripts/create_database.sql
touch db_scripts/seed_data.sql
touch frontend/public/index.html
touch frontend/src/App.js
touch frontend/src/index.js
touch static/css/style.css
touch static/js/main.js 
touch templates/index.html
touch templates/overview.html
touch templates/overview_tech.html

# Create .gitignore file with common Python and Django patterns
cat <<EOL > .gitignore
# Python cache and bytecode files
__pycache__/
*.py[cod]

# Virtual environment
venv/
ENV/

# Django specific files
*.log
*.pot
*.pyc
*.pyo
*.pyd
*.db
*.sqlite3
staticfiles/

# Frontend specific
node_modules/
dist/
build/

# IDE specific files
.vscode/
.idea/

# System files
.DS_Store
Thumbs.db
EOL

# Create requirements.txt as a placeholder
touch requirements.txt

# Create README.md with a basic template
cat <<EOL > README.md
# My Django competence Project

## Overview

This project is a web-based competence where players control a rocket to dodge asteroids and compete for high scores on a leaderboard. It integrates multiple technologies including Python, Django, JavaScript, a web server, and a database.

## Project Structure

- \`competence_project/\`: Django project directory.
- \`competence/\`: Django app directory containing models, views, and migrations.
- \`db_scripts/\`: SQL scripts for setting up and seeding the database.
- \`frontend/\`: Placeholder for frontend code if using a separate framework (e.g., React).
- \`static/\`: Static files (CSS, JavaScript, images) used in templates.
- \`templates/\`: HTML templates used by Django views.

## Getting Started

1. Set up your Python virtual environment and install dependencies from \`requirements.txt\`.
2. Run the database scripts in \`db_scripts/\` to initialize the database.
3. Start the Django development server using \`python manage.py runserver\`.

## Dependencies

List your dependencies here or refer to the \`requirements.txt\` file.

## License

Add your project license here.
EOL

echo "Project structure created successfully."

