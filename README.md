Here’s an updated `README.md` file adapted for your **"competence"** project:

---

# Django Competence Project

![Work In Progress](https://img.shields.io/badge/status-work%20in%20progress-yellow)

## Overview

This project is designed to manage and evaluate students' skills using various competency tests. It stores student information, their evaluation results, and provides a way to analyze their progress across different evaluation stages. The project uses Django as a backend framework, integrated with a REST API for external access by an Android application.

## ⚠️ Work In Progress

**This project is currently under development and is not yet stable.**

We are actively working on adding features and improvements. Be aware that the current state includes:

- **Features**: Not all features are implemented yet.
- **Stability**: Some functionalities might be incomplete or contain bugs.
- **Documentation**: The documentation is in progress and may not cover every aspect yet.

## Project Structure

- `competence_project/`: Django project directory for competence evaluation.
- `competence/`: Django app directory containing models, views, serializers, and migrations related to competence evaluation.
- `db_scripts/`: SQL scripts for setting up and seeding the database.
- `static/`: Static files (CSS, JavaScript, images) used in templates.
- `templates/`: HTML templates used by Django views (if any).
- `tools/`: Utility scripts for managing the project.

## 🛠️ Current Status

- Initial project setup complete.
- Competence models implemented (students, evaluation stages, results).
- API development in progress.
- Ongoing testing and integration with Android app.

## 📈 Future Plans

- Complete API development for mobile integration.
- Extensive testing of API endpoints.
- Add frontend or reporting tools (if required).
- Improved documentation and user guides.

## 🚀 Getting Started

To set up and run this project, follow these instructions:

### 0. Project Initialization get the code from git
To get the code and set up the server, follow these steps:

The project is initialized from GitHub. You can simply clone this repository. Or you can use this script from tools/setup_project_server.sh to initialise git on a min server and clone.


init git on a min server and clone : 
```bash 
./setup_project_server.sh -i
```

just clone : 
```bash 
./setup_project_server.sh -c
```

just clone : 
```bash 
cd competence_project 
ln -s tools/*.sh .
```


### 1. Server and Database Setup

if you have an empty mint server, you may want install with tools/setup_environment.sh. this script is doing (if andwer yes for installation): 

    # 1. Install Web Server (Apache)  
    # 2. Install Python and pip  
    # 3. Set up Python Virtual Environment 
    # 4. Install build tools and libraries for mysqlclient
    # 5. Create a virtual environment and install Django
        pip install --upgrade pip  # Always good to ensure pip is up-to-date
    # 6. Install MySQL Server
    # 7. Secure MySQL installation and create a new user and database

Create the database with the correct parameters
- The database will be set up with:
  - **Database Name**: `competencedb`
  - **User**: `competence_user`


```bash 
# to test
./setup_environment.sh -t
# to install
./setup_environment.sh -i
```


###   3 . environment file

modify the  .venv file which is installed in the same repository as manage.py
```bash
cd competence_project
nano .env
``` 


```bash
DJANGO_SECRET_KEY="your_production_secret_key"
DJANGO_SERVER_IP="your_production_server_ip"
DEBUG=False
DBNAME="your_production_dbname"
DBUSER="your_production_dbuser"
DBPASSWORD="your_production_dbpassword"
DBHOST="your_production_dbhost"
DBPORT="your_production_dbport"
ALLOWED_HOSTS=0.0.0.0,xxx.xxx.xxx.xxx,my_domain
PROF_ID_DEFAULT="default_user"
```

### 4. Django Setup

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


### 5. Database migration and initialisation

Run the database scripts  directory to initialize the required tables:
 
```bash
cd competence_project
./setup_django_migration.sh
./setup_django_loaddata.sh
```

### 6. Run the Server

Start the Django development server on a custom port (python manage.py runserver 0.0.0.0:8080) after activation the local pip env :

```bash
cd competence_project
./start_django.sh
``` 
Your server should now be running and accessible via the specified IP and port.


### 7. Rest API is available

http://your_server:8080/api



### 8. Prototype api

code is in prototype app, after cloning :

```bash
cd prototype
npm install
npm run build
``` 






## 📢 Contributing

Feel free to contribute by submitting issues or pull requests. Your feedback is appreciated!

## 📧 Contact

For any inquiries, please contact [nathabee123@gmail.com](mailto:nathabee123@gmail.com).

---

**Thank you for your support and patience!**

## License

MIT License

Copyright (c) 2024 Natha Bee

 