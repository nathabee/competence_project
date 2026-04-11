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
- `github-pages`: Contains a frontend static version with dummy data for GitHub Pages.




## Documentation
 
🛠️ Current Status   :   [TODO.md](https://github.com/nathabee/competence_project/blob/main/TODO.md )
Configure DNS and Apache :  [apache.md](https://github.com/nathabee/competence_project/blob/main/docs/apache.md )
Configure Jenkins :  [jenkins.md](https://github.com/nathabee/competence_project/blob/main/docs/jenkins.md )
Operation Manual :  [operation-manual.md](https://github.com/nathabee/competence_project/blob/main/docs/operation-manual.md )
service installation guide: se [systemctl-install.md](https://github.com/nathabee/competence_project/blob/main/docs/systemctl-install.md )

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

cp env.example.prod .env
# cp env.example.dev .env    (in dev)

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



# start the file from tools/setup_django.sh it start the server in port 8080
./setup_django.sh -s

after cloning the git (say no to new project and new app):
Start a new Django project (y/n): n
Create a new Django app (y/n): n
Run Django migrations (y/n): y


#python manage.py makemigrations competence
#./setup_django_migration.sh
```



create the source media:
```bash
# adjust if your production checkout lives elsewhere
PROJECT_DIR=/home/nathabee/competence_project
MEDIA_TARGET=/var/www/competence_project/media

sudo mkdir -p "$MEDIA_TARGET/origin/competence/header_icons"
sudo mkdir -p "$MEDIA_TARGET/origin/competence/png"
sudo mkdir -p "$MEDIA_TARGET/competence/header_icons"
sudo mkdir -p "$MEDIA_TARGET/competence/png"

sudo chown -R nathabee:www-data /var/www/competence_project
sudo find /var/www/competence_project -type d -exec chmod 2775 {} \;
sudo find /var/www/competence_project -type f -exec chmod 664 {} \;

cd "$PROJECT_DIR"

if [ -e media ] && [ ! -L media ]; then
    mv media media.bak
fi

ln -sfn "$MEDIA_TARGET" media
ls -ld media "$MEDIA_TARGET"
 
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
# python manage.py populate_demo || true
```

Reset password of the example user, with password default of .env
./reset-django-pwd.sh

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

 

#### start Backend server in production

Install and configure Gunicorn on 127.0.0.1:8080 :

See [gunicorn.md](https://github.com/nathabee/competence_project/blob/main/docs/gunicorn.md)

 

on production we can configure gunicorn and start django this way after 
```bash
sudo systemctl start gunicorn  
``` 

### 5. Statistics


#### 1. Create the real target directory

```bash id="d7uw9z"
sudo mkdir -p /var/www/competence_project/staticfiles
sudo chown -R nathabee:www-data /var/www/competence_project
sudo chmod -R 775 /var/www/competence_project
```

#### 2. Replace local `staticfiles` with a symlink

```bash
cd /home/nathabee/competence_project

if [ -e staticfiles ] && [ ! -L staticfiles ]; then
    mv staticfiles staticfiles.bak
fi

ln -s /var/www/competence_project/staticfiles staticfiles
ls -ld staticfiles /var/www/competence_project/staticfiles
```

#### 3. Run collectstatic

```bash
cd /home/nathabee/competence_project
source venv/bin/activate
python manage.py collectstatic --noinput
```

#### 4. Verify that admin CSS is really there

```bash
find /var/www/competence_project/staticfiles/admin/css -maxdepth 1 -type f | head
```

You should see files like `base.css`.

---


###  6. Frontend

#### 6.0 env files

tale the necessary value from env.example t create the files

--- IF YOU ARE ON DEV ---
.env.demo       : file to create the demo package for the github page (mok , no django)
.env.demolocal  : file to test the demo locally  (mok , no django)
.env.local      : file that is use the django (no mok, more the production architecture)

--- IF YOU ARE ON PRODUCTION ---
.env.production  : file that is use the django on production

Modify `competence-app/.env.**` with the correct values.



#### 6.1 Production frontend

--- IF YOU ARE ON PRODUCTION ---

For production, the frontend is built as a Next.js application and run through the `npm-app` systemd service on `127.0.0.1:3000`, behind Apache.



For manual production installation, follow the service installation guide in [`docs/systemctl-install.md`](./docs/systemctl-install.md), which covers:

- Node 20 location used for production
- frontend build with `npm install` and `npm run build`
- creation of the `npm-app` systemd service
- local service checks on `127.0.0.1:3000`

Start the frontend service:

```bash
sudo systemctl start npm-app
```

Check it locally:

```bash
curl -I http://127.0.0.1:3000/
```

In a Jenkins-managed production deployment, Jenkins performs the build and then restarts `npm-app`.
 

 

#### 6.2 Local development frontend


--- IF YOU ARE ON DEV ---

For local development, do not use Jenkins and do not use the `npm-app` systemd service.

Check `competence-app/.env.local` exists
Then run the frontend locally as the development user:

```bash
cd /home/nathabee/competence_project/competence-app
npm install
npm run local-build
npm run local-start
```

This development flow is separate from the production service setup.


 

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

The production Jenkins pipeline deploys the project from `main` into the live production tree.

### 1. Backup
Creates a backup of the current project directory and a MySQL dump of `competencedb`.

### 2. Checkout
Checks out the repository in the Jenkins workspace to load the pipeline definition from source control.

### 3. Update Repository
Updates the live production repository at `/home/nathabee/competence_project` by fetching from GitHub and resetting to `origin/main`.

### 4. Stop Services
Stops the production services:
- `gunicorn`
- `npm-app`

### 5. Check Tool Versions
Prints the active `PATH`, `node`, and `npm` versions used by the pipeline. This is important because the frontend build requires Node 20.

### 6. Install Dependencies
- installs Python dependencies from `requirements.txt`
- installs frontend dependencies in `competence-app`

### 7. Database Migrations
Runs Django migrations.
Optional initialization commands are available through pipeline flags, but the default production run keeps:
- `RESET_DB = "false"`
- `INIT_DB = "false"`
- `POPULATE_TRANSLATION = "false"`

### 8. Build Frontend
Builds the production frontend with `npm run build`.

### 9. Collect Static Files
Runs:

```bash
python manage.py collectstatic --noinput
```

The project uses `/var/www/competence_project/staticfiles` as the production static target.

### 10. Start Services

Starts:

* `gunicorn`
* `npm-app`

### 11. Run Tests

Runs:

* Django integration tests
* frontend test suite

### 12. Internal Health Check

Uses a Jenkins credential (`competence-app-teacher-id`) to obtain a JWT token from the Django API and verify:

* authenticated API access
* frontend availability on `127.0.0.1:3000`

### 13. External HTTPS Smoke Check

Verifies the public URLs:

* `https://competence.nathabee.de/api/`
* `https://competence.nathabee.de/admin/`
* `https://competence.nathabee.de/`

## Post-Deployment Actions

* **Success**: prints `Deployment successful!`
* **Failure**: prints `Deployment failed.`

---



## 📢 Contributing

Feel free to contribute by submitting issues or pull requests. Your feedback is appreciated!

## 📧 Contact

For any inquiries, please contact [nathabee123@gmail.com](mailto:nathabee123@gmail.com).

---

**Thank you for your patience!**

## License

MIT License

Copyright (c) 2024 Natha Bee

 