# Competence Project

 
## Overview

This project is a Django-based system designed to manage and evaluate student competencies through various assessments. It stores student data, tracks evaluation results, and analyzes progress over time. It integrates with a REST API, enabling access by an Android application.

Frontend : React App or Wordpress plugin


## Project Demo (demo of react-app)

A demo version is available on [**GitHub Pages**](https://nathabee.github.io/competence_project/).  
<a href="https://nathabee.github.io/competence_project/" target="_blank"></a>

This demo showcases the frontend, compiled as static files and deployed to GitHub Pages, using mock data and simulated API calls:

- **Data**: Demo data is static and may appear incoherent, as it's not connected to a real database.
- **Backend**: All API requests are mocked—no Django backend, MySQL database, or JWT authentication is used. Axios and other services are simulated.

> **Note**: This demo is for frontend display purposes only, with no real database interactions.




## Project Structure

- `competence_project/`: Django backend for competence evaluation.
- `competence/`: Django app containing models, views, serializers, and migrations.
- `competence-frontend` : wordpress plugin (later with shared code and will replace the react-app from competence-app)
- `competence-app/`: Frontend built with Next.js and React.
- `script_db/`: SQL scripts for initializing and seeding the database.
- `static/`: Static files (CSS, JavaScript, images).
- `tools/`: Utility scripts for managing the project.
- `Jenkinsfile`: CI/CD script for automated deployment.

## Branches

- `main`: Contains all project files (backend and frontend).
- `github-pages`: Contains a fromtenmd static version with dummy data for GitHub Pages.




## 🛠️ Current Status
 
- Initial setup and database model completed.
- Django API and frontend setup.
- Automated testing with Jest.
- CI/CD pipeline implemented.
- Demo project available on GitHub Pages.
- plugin in work in progress
 

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

 
check database is created :
 ```bash  
mysql -u competence_user -p competencedb

```

modify the  .env file which is installed in the same repository as manage.py

```bash
cp .env.prod .env
python3 -c "import secrets; print(secrets.token_urlsafe(50))"
python3 -c "import secrets; print(secrets.token_urlsafe(50))"

#Use:
#first output for DJANGO_SECRET_KEY
#second output for JWT_SECRET_KEY

nano .env
``` 



### 3. Django Setup , migration and initialisation



Set up your Python virtual environment and install the necessary dependencies:

```bash
cd competence_project

source venv/bin/activate
python manage.py makemigrations competence
# ./setup_django_migration.sh


# start the file from tools/setup_django.sh it start the server in port 8080
./setup_django.sh -s

after cloning the git (say no to new project and new app):
Start a new Django project (y/n): n
Create a new Django app (y/n): n
Run Django migrations (y/n): y

```



create the source media:
```bash
cd /home/nathabee/competence_project
mkdir -p media/competence/header_icons
mkdir -p media/competence/png

sudo mkdir -p /var/www/competence_project/media/origin
sudo chown -R nathabee:www-data /var/www/competence_project
sudo chmod -R 775 /var/www/competence_project
cd /home/nathabee/competence_project

if [ -e media ] && [ ! -L media ]; then
    mv media media.bak
fi

ln -s /var/www/competence_project/media media
ls -ld media /var/www/competence_project/media


 
``` 


Run the database scripts  directory to initialize the required tables:
 
```bash 
cd /home/nathabee/competence_project
source venv/bin/activate

python manage.py copy_data_init
python manage.py populate_data_init
python manage.py create_groups_and_permissions
python manage.py populate_teacher
python manage.py populate_translation
```

### 4. Run the Backend Server

#### pre-requise


Configure DNS and Apache : see [apache.md](https://github.com/nathabee/competence_project/blob/main/docs/apache.md )


#### install and test
Start the Django development server locally after activating the virtual environment:

```bash
cd /home/nathabee/competence_project
source venv/bin/activate
python manage.py runserver 127.0.0.1:8080 --insecure
```

At this stage, only the backend endpoints are expected to work.

After DNS and Apache are configured, these URLs should be available:

* `https://competence.nathabee.de/api/` -> Django backend on `127.0.0.1:8080`
* `https://competence.nathabee.de/admin/` -> Django backend on `127.0.0.1:8080`
* `https://competence.nathabee.de/media/` -> `/var/www/competence_project/media/`

The root URL `https://competence.nathabee.de/` is not expected to work yet, because the frontend on port `3000` is configured in the next chapter.


### 5. fine tuning

#### GUNICORN : adapt Backend server to production

Install and configure Gunicorn on 127.0.0.1:8080.

See [gunicorn.md](https://github.com/nathabee/competence_project/blob/main/docs/gunicorn.md)

 

on production we can configure gunicorn and start django this way after 
```bash
sudo systemctl start gunicorn  
``` 

#### STATISTICS


##### 1. Create the real target directory

```bash id="d7uw9z"
sudo mkdir -p /var/www/competence_project/staticfiles
sudo chown -R nathabee:www-data /var/www/competence_project
sudo chmod -R 775 /var/www/competence_project
```

##### 2. Replace local `staticfiles` with a symlink

```bash id="dtw08n"
cd /home/nathabee/competence_project

if [ -e staticfiles ] && [ ! -L staticfiles ]; then
    mv staticfiles staticfiles.bak
fi

ln -s /var/www/competence_project/staticfiles staticfiles
ls -ld staticfiles /var/www/competence_project/staticfiles
```

##### 3. Run collectstatic

```bash id="m5mafc"
cd /home/nathabee/competence_project
source venv/bin/activate
python manage.py collectstatic --noinput
```

##### 4. Verify that admin CSS is really there

```bash id="f6ph5g"
find /var/www/competence_project/staticfiles/admin/css -maxdepth 1 -type f | head
```

You should see files like `base.css`.

---


###  6. Frontend

#### 6.1 Production frontend

Modify `competence-app/.env.production` with the correct production values.

Then install dependencies and build the frontend:

```bash
cd /home/nathabee/competence_project/competence-app
npm install
npm run build
````

Start the frontend service:

```bash
sudo systemctl start npm-app
```

If the service does not exist yet, create it before using Apache as reverse proxy for `/`.


### Dev second

```md
#### 6.2 Local development frontend

For local development, create `competence-app/.env.local`:

```bash
NEXT_PUBLIC_ENV=developement
NEXT_PUBLIC_API_URL=http://localhost:8080/api
NEXT_PUBLIC_BASE_PATH=/evaluation
NEXT_PUBLIC_ADMIN_URL=http://localhost:8080/admin/
NEXT_PUBLIC_MEDIA_URL=http://localhost:8080/media
```

Then run:

```bash
cd /home/nathabee/competence_project/competence-app
npm install
npm run local-build
npm run local-start
```

 

### 7. Demo frontend app

The front end can be compiled in a static file to generate a static website.
You can test this build locally or deploy it on github this way.

#### To test locally:
```bash
cd competence-app
npm run demo-test
 
```
#### To deploy on github page:
```bash
to deploy on github :
npm run demo-deploy

```


### 8. Run tests automatically


#### backend test :
This is using the Django test facilities
Test are in competence/tests/test*.py

test_integration_workflow.py  is used to validate in stallation on production environment

```bash
python manage.py test competence.tests.test_integration_workflow
```


#### frontend test :
This is using the JTEST library
Test files are in competence-app/__tests__
All the files defined in this directory will be called by JTEST 
They are used to validate in stallation on production environment
```bash
dotenv -e .env.local jest
```



 
---

## 🌐 WordPress Frontend Plugin (`competence-frontend`) / no supported with installation => code need to be merged

This repository also includes a React-based WordPress plugin that brings the frontend into a traditional CMS environment.

### 🔌 What Is It?

The `competence-frontend` project contains a **WordPress plugin** (`competence-wp`) that embeds a **React single-page application (SPA)** directly into WordPress pages. This allows the frontend to be served **within a WordPress site**, while still communicating with the **Django backend via a REST API**.

> This approach bridges modern SPA usability with the powerful content management features of WordPress.

### 📁 Folder Structure

```
competence-frontend/
│
├── competence-wp/           # WordPress plugin source
│   ├── src/                 # React code for the plugin
│   ├── dist/, build/        # Output folders
│   ├── package.json         # Plugin dependencies and scripts
│   └── competence-wp.php    # WordPress plugin bootstrap
│
├── react-app/               # Standalone frontend app (Next.js)
├── shared/                  # Shared assets/utilities
```

### 🚀 Features of the Plugin

* 📦 **Bundled as a WordPress plugin**, installable and activatable in any WP instance
* 🧩 Registers Gutenberg blocks to inject the React app
* 🔧 Provides a WP Admin Settings screen to configure the Django API URL
* 🌐 Automatically creates the pages (`/competence_home`, `/competence_dashboard`, etc.)
* 🗂 Embeds an SPA (React + TypeScript) inside Gutenberg block content

### 🖥 How It Works

* Uses `react-dom` to mount the app on blocks like `<!-- wp:competence/competence-app /-->`
* Handles routing inside the SPA via `react-router-dom`
* Dynamically pulls the Django backend URL from `wp_localize_script()`

### 🧪 Demo & Development

* Demo plugin included in the static GitHub Pages site for frontend showcase.
* Can be tested inside any WordPress instance by copying the `competence-wp/` folder to your `wp-content/plugins/`.

---

Let me know if you’d like it placed earlier in the README or broken into two chapters (`competence-frontend` and `competence-wp`).


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



## Remarks (for the developper) about the status of the project


initially the django is in competence and competence_project
initially the associated frontend is competence-app

later we have created a competence-frontend to show how it is possible to shared code betweeen a react-app and a wordpress plugin

then we have use the competence code in the beelab project in order to show the possibility to share code in backend and in frontend, so there was new modification that was not put to the competence inital project, because at that moment the competence project was set as deprecated
/django and /wordpress are partially containing the code we need to use as reference in the future (wordpress contains a plugin for wordpress that can be used as frontend)
the plugin is not implementing totally the competence-app
the django part was modified n toder to use userCore separated from the competenceCore
we have a duplication because the competence-app , competence-frontend are all using the django from competence and competence_project


what we want to do in the future :

* use a single source of truth for backend (use the django : it had the concept of demo user )
* adapt the competence-app for that demo user concept (django backend)
* check if the competence-frontend can be reuse in order to share code
* finish the wordpress plugin by trying to see if competence-frontend wordpress plugin can beused for taht




## 📢 Contributing

Feel free to contribute by submitting issues or pull requests. Your feedback is appreciated!

## 📧 Contact

For any inquiries, please contact [nathabee123@gmail.com](mailto:nathabee123@gmail.com).

---

**Thank you for your patience!**

## License

MIT License

Copyright (c) 2024 Natha Bee

 