# Competence Project

 
## Overview

This project is a Django-based system designed to manage and evaluate student competencies through various assessments. It stores student data, tracks evaluation results, and analyzes progress over time. It integrates with a REST API, enabling access by an Android application.

Frontend: Next.js application or WordPress plugin


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
- `competence-frontend`: WordPress plugin project. Later it may share code with or replace parts of `competence-app`.
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
service installation guide: see [systemctl-install.md](https://github.com/nathabee/competence_project/blob/main/docs/systemctl-install.md )

## 🚀 Getting Started

To set up and run this project, follow these instructions.

### 0. Project Initialization

Clone the repository:

```bash
git clone https://github.com/nathabee/competence_project.git
cd competence_project
```

The setup scripts are called directly from `./tools/`.

---

### 1. Server and Database Setup

Use the environment setup script.

#### Interactive/manual mode

```bash
./tools/setup_environment.sh --install
```

This script can:

* install required system packages
* create or update the Python virtual environment
* install Django in the virtual environment
* create or update the MySQL database and user
* prepare shared paths such as:

  * `/home/<user>/sav`
  * `/var/www/competence_project/media`
  * `/var/www/competence_project/staticfiles`
* ensure the project symlinks for `media` and `staticfiles`

#### Non-interactive mode

For a reproducible setup on a prepared server, use explicit flags.

Example:

```bash
./tools/setup_environment.sh --install --ci \
  --project-path /home/nathabee/competence_project \
  --project-owner nathabee \
  --project-group www-data \
  --create-db --db-name competencedb --db-user competence_user --db-pass 'REAL_DB_PASSWORD_HERE' \
  --prepare-shared-paths
```

After the database is created, verify access with:

```bash
mysql -u competence_user -p competencedb
```

---

### 2. Configure `.env`

Create the backend environment file in the repository root, next to `manage.py`.

```bash
cp env.example.prod .env
# adapt from a dev example if you use a separate local flow
```

Generate secrets:

```bash
python3 -c "import secrets; print(secrets.token_urlsafe(50))"
python3 -c "import secrets; print(secrets.token_urlsafe(50))"
```

Use:

* first output for `DJANGO_SECRET_KEY`
* second output for `JWT_SECRET_KEY`

Then edit:

```bash
nano .env
```

* Make sure the database settings match the database, user, and password actually created by `setup_environment.sh`.



* `CI_DEPLOY_ENV`
  informational label for the pipeline

* `CI_UPDATE_DEPLOY_TREE`
  whether Jenkins is allowed to run `git fetch` + `git reset --hard` on the deployment tree
  `false` in dev protects your working tree
  `true` in prod updates the deploy tree from GitHub

* `CI_FRONTEND_ENV_FILE`
  the frontend env file that must exist in `competence-app/`

* `CI_FRONTEND_BUILD_CMD`
  the build command Jenkins should run for the frontend

* `CI_RUN_EXTERNAL_SMOKE`
  whether Jenkins should run the public HTTPS smoke checks


---

### 3. Django Setup, Migration, and Initialization

Use the Django setup script.

#### Interactive/manual mode

```bash
./tools/setup_django.sh --setup
```

This script can perform Django-side tasks such as:

* install Python requirements
* run `makemigrations`
* run `migrate`
* load fixture data
* run `copy_data_init`
* run `populate_data_init`
* run `create_groups_and_permissions`
* run `populate_teacher`
* run `populate_translation`
* reset example user passwords
* run `collectstatic`

#### Non-interactive mode

Example for a full Django initialization on an already prepared server:

```bash
./tools/setup_django.sh --setup --ci \
  --project-path /home/nathabee/competence_project \
  --venv-path /home/nathabee/competence_project/venv \
  --install-requirements \
  --migrate \
  --copy-data-init \
  --populate-data-init \
  --create-groups \
  --populate-teacher \
  --populate-translation
```

If you want to reset the example users to the password defined in `.env`:

```bash
./tools/setup_django.sh --setup --ci \
  --project-path /home/nathabee/competence_project \
  --venv-path /home/nathabee/competence_project/venv \
  --reset-passwords
```

#### Minimal migration-only run

```bash
./tools/setup_django.sh --setup --ci \
  --project-path /home/nathabee/competence_project \
  --venv-path /home/nathabee/competence_project/venv \
  --migrate
```

---

### 4. Run the Backend Server

#### Prerequisite

Configure DNS and Apache first:

* see [`docs/apache.md`](https://github.com/nathabee/competence_project/blob/main/docs/apache.md)

#### Development server

```bash
cd /home/nathabee/competence_project
source venv/bin/activate
python manage.py runserver 127.0.0.1:8080 --insecure
```

At this stage, only the backend endpoints are expected to work.

After DNS and Apache are configured, these URLs should be available:

* `https://competence.nathabee.de/api/` → Django backend on `127.0.0.1:8080`
* `https://competence.nathabee.de/admin/` → Django backend on `127.0.0.1:8080`
* `https://competence.nathabee.de/media/` → `/var/www/competence_project/media/`

The root URL `https://competence.nathabee.de/` is not expected to work yet, because the frontend on port `3000` is configured later.

#### Production backend service

Install and configure Gunicorn on `127.0.0.1:8080`.

See:

* [`docs/gunicorn.md`](https://github.com/nathabee/competence_project/blob/main/docs/gunicorn.md)

Then start it with:

```bash
sudo systemctl start gunicorn
```

---

### 5. Static Files

When `setup_environment.sh --prepare-shared-paths` has been used, the project already uses:

* `/var/www/competence_project/staticfiles` as the real static target
* `staticfiles` in the project as a symlink to that target

To collect static files:

```bash
./tools/setup_django.sh --setup --ci \
  --project-path /home/nathabee/competence_project \
  --venv-path /home/nathabee/competence_project/venv \
  --collectstatic
```

You can verify that admin CSS was collected:

```bash
find /var/www/competence_project/staticfiles/admin/css -maxdepth 1 -type f | head
```

You should see files such as `base.css`.

---

### 6. Frontend

#### 6.0 Environment files

Create the frontend environment files from the examples and adapt them to your target environment.

For development:

* `.env.demo` for the GitHub Pages demo build
* `.env.demolocal` for local demo testing
* `.env.development` for local development against Django

For production:

* `.env.production`

Modify `competence-app/.env.*` with the correct values.

#### 6.1 Production frontend

For production, the frontend is built as a Next.js application and run through the `npm-app` systemd service on `127.0.0.1:3000`, behind Apache.

For manual production installation, follow:

* [`docs/systemctl-install.md`](./docs/systemctl-install.md)

That guide covers:

* Node 20 location used for production
* frontend build with `npm install` and `npm run build`
* creation of the `npm-app` systemd service
* local service checks on `127.0.0.1:3000`

Start the frontend service:

```bash
sudo systemctl start npm-app
```

Check it locally:

```bash
curl -I http://127.0.0.1:3000/
```

In a Jenkins-managed deployment, Jenkins performs the build and restarts `npm-app`.

#### 6.2 Local development frontend

For local development, do not use Jenkins and do not use the `npm-app` systemd service.

Check that `competence-app/.env.development` exists, then run:

```bash
cd /home/nathabee/competence_project/competence-app
npm install
npm run local-build
npm run local-start
```

---

### 7. Demo Frontend App

The frontend can be compiled as a static site for local testing or GitHub Pages deployment.

#### Test locally

```bash
cd competence-app
npm run demo-test
```

#### Deploy to GitHub Pages

```bash
cd competence-app
npm run demo-deploy
```

---

### 8. Automated Tests

#### Backend tests

This uses Django’s test framework.

Tests are in `competence/tests/test*.py`.

`test_integration_workflow.py` validates installation behavior in the production environment.

```bash
python manage.py test competence.tests.test_integration_workflow
```

#### Frontend tests

This uses the frontend test setup in `competence-app/__tests__`.

```bash
dotenv -e .env.development jest
```


 
---

## 🌐 WordPress Frontend Plugin (`competence-frontend`)

This part is currently not covered by the main installation flow and still requires additional integration work.
see TODO list to see features to be modified

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




## 🛠️ Jenkins Pipelines

This repository contains two Jenkins pipeline files.

### `Jenkinsfile`

This is the standard deployment pipeline.

It performs the normal deployment flow:

1. backup
2. checkout/update
3. stop services
4. install dependencies
5. migrate database
6. build frontend
7. collect static files
8. start services
9. run tests
10. internal health check
11. external smoke check

This job is the normal day-to-day deployment job.

### `Jenkinsfile.bootstrap`

This is the bootstrap/reset pipeline.

It is used only when you explicitly need one or more of the following:

- prepare media/shared paths
- reset the database
- initialize Django seed data
- populate translation data
- reset example user passwords

This job is for first setup, environment repair, or controlled reset operations.

### Jenkins server setup

See:

- [`docs/jenkins.md`](https://github.com/nathabee/competence_project/blob/main/docs/jenkins.md)

That document covers:

- Jenkins installation
- systemd requirement
- shared-path preparation
- Jenkins service override
- Jenkins rights and sudoers
- Jenkins MySQL client file
- Django CI user creation
- Jenkins credentials
- creation of the two Jenkins jobs

### Development note

In development, `/home/nathabee/competence_project` may be a symlink to the real working tree.

If Jenkins is pointed at that path, normal deployment jobs may reset or overwrite local changes depending on the pipeline flow.

Do not use destructive bootstrap/reset runs on that path unless it is intentionally the source of truth for the test.

---



## 📢 Contributing

Feel free to contribute by submitting issues or pull requests. Your feedback is appreciated!

## 📧 Contact

For any inquiries, please contact [nathabee123@gmail.com](mailto:nathabee123@gmail.com).

--- 

## License

MIT License

Copyright (c) 2024 Natha Bee

 