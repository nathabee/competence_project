# Django Competence Project

![Work In Progress](https://img.shields.io/badge/status-work%20in%20progress-yellow)

## Overview

This project is a Django-based system designed to manage and evaluate student competencies through various assessments. It stores student data, tracks evaluation results, and analyzes progress over time. It integrates with a REST API, enabling access by an Android application.

## ⚠️ Work In Progress

**This project is actively under development and is not yet stable.**

Current development state includes:

- **Features**: Not all features are implemented yet.
- **Stability**: Some functionalities are incomplete or may contain bugs.
- **Documentation**: Documentation is ongoing and may be limited in scope.

## Project Demo

A demo version is available on [**GitHub Pages**](https://nathabee.github.io/competence_project/).  
<a href="https://nathabee.github.io/competence_project/" target="_blank"><img src="https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png" width="20" height="20" /></a>

This demo showcases the frontend, compiled as static files and deployed to GitHub Pages, using mock data and simulated API calls:

- **Data**: Demo data is static and may appear incoherent, as it's not connected to a real database.
- **Backend**: All API requests are mocked—no Django backend, MySQL database, or JWT authentication is used. Axios and other services are simulated.

> **Note**: This demo is for frontend display purposes only, with no real database interactions.

## Project Structure

- `competence_project/`: Django backend for competence evaluation.
- `competence/`: Django app containing models, views, serializers, and migrations.
- `competence_app/`: Frontend built with Next.js and React.
- `db_scripts/`: SQL scripts for initializing and seeding the database.
- `static/`: Static files (CSS, JavaScript, images).
- `tools/`: Utility scripts for managing the project.
- `Jenkinsfile`: CI/CD script for automated deployment.

## Branches

- `main`: Contains all project files (backend and frontend).
- `github-pages`: Contains the frontend export for GitHub Pages.

To test locally:
```bash
cd competence-app
npm run demo-test
 
```
To test locally:
```bash
to deploy on github :
npm run demo-deploy

```


## 🛠️ Current Status
 
- Initial setup and database model completed.
- Django API and frontend setup.
- Automated testing with Jest.
- CI/CD pipeline implemented.
- Demo project available on GitHub Pages.

## 📈 Future Plans

- Complete API development for mobile integration.
- Quality and performance checks.
- More extensive API testing and documentation.

## 🚀 Getting Started

To set up and run this project, follow these instructions:

### 0. Project Initialization
Clone the repository and set up the server:

The project is initialized from GitHub. You can simply clone this repository.


# Clone directly
```bash 
git clone https://github.com/nathabee/competence_project.git
```

```bash 
cd competence_project 
ln -s tools/*.sh .
```


### 1. Server and Database Setup


```bash 
# to install
./setup_environment.sh -i
```
This installs the web server, Python, pip, MySQL server, and necessary dependencies. It also sets up a virtual environment and database:


Create the database with the correct parameters
- The database will be set up with:
  - **Database Name**: `competencedb`
  - **User**: `competence_user`

 

modify the  .env file which is installed in the same repository as manage.py
```bash
cd competence_project
nano .env
``` 


```bash
DJANGO_SECRET_KEY="your_secret_key"
DJANGO_SERVER_IP="server_ip"
DEBUG=False
DBNAME="competencedb"
DBUSER="competence_user"
DBPASSWORD="password"
DBHOST="localhost"
DBPORT="3306"
ALLOWED_HOSTS="0.0.0.0,localhost"
PROF_ID_DEFAULT="default_user"
```

### 3. Django Setup , migration and initialisation

Set up your Python virtual environment and install the necessary dependencies:

```bash
cd competence_project
# start the file from tools/setup_django.sh it start the server in port 8080
./setup_django.sh -s

after cloning the git (say no to new project and new app):
Start a new Django project (y/n): n
Create a new Django app (y/n): n
Run Django migrations (y/n): y

```


Run the database scripts  directory to initialize the required tables:
 
```bash
cd competence_project
./setup_django_migration.sh
./setup_django_loaddata.sh
```

### 4. Run the Backend Server

Start the Django development server on a custom port (python manage.py runserver 0.0.0.0:8080) after activation the local pip env :

```bash
cd competence_project
python manage.py runserver localhost:8080 --insecure
``` 
Your server should now be running and accessible via the specified IP and port.

```bash
http://your_server:8080/api
``` 

on production we can configure unicorn and start django this way after 
```bash
sudo systemctl start gunicorn  
``` 



### 5. Run the Frontend Server API Setup
Install frontend dependencies and build the app:

#### Test environment
in local test server create a competence-app/.env.local file with the values:
```bash
NEXT_PUBLIC_ENV=developement
NEXT_PUBLIC_API_URL=http://localhost:8080/api
NEXT_PUBLIC_BASE_PATH=/evaluation
NEXT_PUBLIC_ADMIN_URL=http://localhost:8080/admin/
NEXT_PUBLIC_MEDIA_URL=http://localhost:8080/media 

``` 

to build and run the competence-app

```bash
cd competence-app
npm install
npm run local-build
npm run local-start

``` 

#### Production environement
modifiy the competence-app/.env.production file with your server values


to build and run the competence-app

```bash
cd competence-app
npm install
npm run build
# npm run start
sudo systemctl start npm-app
```   
 


## 🛠️ Jenkins Pipeline Stages

The Jenkins pipeline consists of the following stages, each serving a specific purpose in the deployment process:

### 1. Backup
This stage creates backups of the project directory and the MySQL database.
- **Actions**:
  - Copies the project directory to a backup location.
  - Creates a MySQL dump of the `competencedb` database for safekeeping.

### 2. Checkout Stage
This stage retrieves the latest code from the specified Git repository.
- **Actions**:
  - Checks out the `main` branch of the repository.
  - Wipes the workspace to ensure a clean environment for the new code.

### 3. Stop Services
Before updating the application, it’s essential to stop any running services.
- **Actions**:
  - Stops the Gunicorn service.
  - Stops the npm application.

### 4. Install Dependencies
This stage installs necessary Python and Node.js dependencies.
- **Actions**:
  - Activates the Python virtual environment and installs Python packages from `requirements.txt`.
  - Navigates to the frontend application directory and installs npm packages.

### 5. Database Migrations
To ensure the database schema is up-to-date, migrations are executed.
- **Actions**:
  - Activates the Python virtual environment.
  - Runs `makemigrations` and `migrate` commands to apply database migrations.

### 6. Build Frontend
This stage builds the frontend application for production.
- **Actions**:
  - Navigates to the frontend directory and runs the build command using npm.

### 7. Collect Static Files and Update Permissions
Static files are gathered and permissions are set for the web server.
- **Actions**:
  - Runs Django's `collectstatic` command to gather static files.
  - Copies collected static files to the designated static files directory and updates permissions for proper access.

### 8. Start Services
After the update, services are started again to serve the application.
- **Actions**:
  - Starts the Gunicorn service.
  - Starts the npm application.

### 9. Run Tests
Automated tests are executed to verify the integrity of the application.
- **Actions**:
  - Runs integration tests for the Django application.
  - Executes frontend tests using npm.

### 10. Health Check
This final stage verifies that the application is running correctly after deployment.
- **Actions**:
  - Authenticates using credentials to obtain an access token.
  - Checks API endpoints and application availability via HTTP requests.

## Post-Deployment Actions
- **Success**: If all stages complete successfully, a success message is displayed.
- **Failure**: If any stage fails, an error message is displayed.




## 📢 Contributing

Feel free to contribute by submitting issues or pull requests. Your feedback is appreciated!

## 📧 Contact

For any inquiries, please contact [nathabee123@gmail.com](mailto:nathabee123@gmail.com).

---

**Thank you for your support and patience!**

## License

MIT License

Copyright (c) 2024 Natha Bee

 