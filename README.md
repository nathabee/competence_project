# Competence Project

## Overview

Competence Project is a Django-based system for managing and evaluating student competencies through structured assessments. It stores student data, tracks evaluation results, and analyzes progress over time. The backend exposes a REST API that can be consumed by different frontend clients.

The active frontend is a Next.js application in `competence-app/`.

Older or alternative frontend and backend code that still needs review or merging is kept in `to-be-merged/`.

## Active Project Layout

```text
competence_project/
├── backend/                 # active Django backend
├── competence-app/          # active Next.js frontend
├── devops/                  # admin pipeline reference and host install files
├── docker/                  # compose/orchestration area
├── docs/                    # project documentation
├── tools/                   # project utility and setup scripts
├── to-be-merged/            # legacy / merge-source code kept out of active runtime
├── Jenkinsfile              # main deploy/test pipeline
├── Jenkinsfile.bootstrap    # reset/cleanup pipeline
├── env.example.dev
├── env.example.prod
└── README.md
```

Inside `backend/` you will find the active Django runtime, including:

* `manage.py`
* `requirements.txt`
* the Django project package
* the active Django app
* backend static assets
* backend data scripts

## Demo Frontend

A frontend demo is available on [GitHub Pages](https://nathabee.github.io/competence_project/).

This demo is static and uses mock data and simulated API calls.

Important limitations:

* no real Django backend
* no MySQL database
* no JWT authentication
* no real persistence

It is only meant to demonstrate frontend rendering and navigation.

## Branches

* `main`: active repository branch for backend, frontend, tooling, and documentation
* `gh-pages`: static frontend demo for GitHub Pages

## Documentation

Current status: [TODO.md](./TODO.md)

Main operational documents:

* [docs/apache.md](./docs/apache.md)
* [docs/jenkins.md](./docs/jenkins.md)
* [docs/operation-manual.md](./docs/operation-manual.md)
* [docs/systemctl-install.md](./docs/systemctl-install.md)

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/nathabee/competence_project.git
cd competence_project
```

Project utility scripts are called from `./tools/`.

## 2. Server and database setup

Use the environment setup script:

```bash
./tools/setup_environment.sh --install
```

This script can:

* install required system packages
* create or update the backend Python virtual environment
* install Django in that virtual environment
* create or update the MySQL database and user
* prepare shared directories such as:

  * `/home/<user>/sav`
  * `/var/www/competence_project/media`
  * `/var/www/competence_project/staticfiles`
* create or repair backend symlinks:

  * `backend/media`
  * `backend/staticfiles`

For a reproducible non-interactive setup, use explicit flags.

Example:

```bash
./tools/setup_environment.sh --install --ci \
  --project-path /home/nathabee/competence_project \
  --backend-path /home/nathabee/competence_project/backend \
  --project-owner nathabee \
  --project-group www-data \
  --create-db \
  --db-name competencedb \
  --db-user competence_user \
  --db-pass 'REAL_DB_PASSWORD_HERE' \
  --prepare-shared-paths
```

After database creation, verify access:

```bash
mysql -u competence_user -p competencedb
```

## 3. Configure environment files

### Backend environment

The backend `.env` file lives at the repository root:

```bash
cp env.example.prod .env
nano .env
```

Generate secrets:

```bash
python3 -c "import secrets; print(secrets.token_urlsafe(50))"
python3 -c "import secrets; print(secrets.token_urlsafe(50))"
```

Use:

* the first output for `DJANGO_SECRET_KEY`
* the second output for `JWT_SECRET_KEY`

Make sure the database settings in `.env` match the actual database, user, and password created earlier.

Pipeline-related variables in `.env` include:

* `CI_DEPLOY_ENV`
* `CI_UPDATE_DEPLOY_TREE`
* `CI_FRONTEND_ENV_FILE`
* `CI_FRONTEND_BUILD_CMD`
* `CI_RUN_EXTERNAL_SMOKE`
* `CI_INSTALL_FRONTEND_DEPS`

### Frontend environment

Frontend env files live in `competence-app/`.

Typical examples are:

* `.env.development`
* `.env.production`
* `.env.demo`
* `.env.demolocal`

Adjust them to match the target environment.

## 4. Django setup, migration, and initialization

Use the Django setup script.

Interactive mode:

```bash
./tools/setup_django.sh --setup
```

Non-interactive example:

```bash
./tools/setup_django.sh --setup --ci \
  --project-path /home/nathabee/competence_project \
  --backend-path /home/nathabee/competence_project/backend \
  --venv-path /home/nathabee/competence_project/backend/venv \
  --install-requirements \
  --migrate \
  --copy-data-init \
  --populate-data-init \
  --create-groups \
  --populate-teacher \
  --populate-translation
```

Reset example user passwords to the value from `.env`:

```bash
./tools/setup_django.sh --setup --ci \
  --project-path /home/nathabee/competence_project \
  --backend-path /home/nathabee/competence_project/backend \
  --venv-path /home/nathabee/competence_project/backend/venv \
  --reset-passwords
```

Minimal migration-only run:

```bash
./tools/setup_django.sh --setup --ci \
  --project-path /home/nathabee/competence_project \
  --backend-path /home/nathabee/competence_project/backend \
  --venv-path /home/nathabee/competence_project/backend/venv \
  --migrate
```

## 5. Run the backend

### Development server

```bash
cd /home/nathabee/competence_project/backend
source venv/bin/activate
python manage.py runserver 127.0.0.1:8080 --insecure
```

At this stage, only backend endpoints are expected to work.

After DNS and Apache are configured, these URLs should be available:

* `https://competence.nathabee.de/api/`
* `https://competence.nathabee.de/admin/`
* `https://competence.nathabee.de/media/`

The public root URL may still depend on the frontend setup.

### Production backend service

The production backend is expected to run behind Apache through a service such as Gunicorn on `127.0.0.1:8080`.

If you document Gunicorn separately, keep that reference only if the file really exists in `docs/`.

For now, the README should not point to a missing `docs/gunicorn.md`.

## 6. Static files

When shared paths are prepared, the project uses:

* `/var/www/competence_project/staticfiles` as the real static target
* `backend/staticfiles` as a symlink to that target

Collect static files with:

```bash
./tools/setup_django.sh --setup --ci \
  --project-path /home/nathabee/competence_project \
  --backend-path /home/nathabee/competence_project/backend \
  --venv-path /home/nathabee/competence_project/backend/venv \
  --collectstatic
```

To verify Django admin CSS was collected:

```bash
find /var/www/competence_project/staticfiles/admin/css -maxdepth 1 -type f | head
```

## 7. Frontend

### Production frontend

The active frontend is the Next.js app in `competence-app/`.

In production it is expected to run through the `npm-app` systemd service on `127.0.0.1:3000`, behind Apache.

For manual production installation, see:

* [docs/systemctl-install.md](./docs/systemctl-install.md)

That guide should cover:

* Node version and binary path
* `npm install`
* frontend build
* `npm-app` service creation
* local service checks on `127.0.0.1:3000`

Start the service:

```bash
sudo systemctl start npm-app
```

Check it locally depending on `NEXT_PUBLIC_BASE_PATH`:

```bash
curl -I http://127.0.0.1:3000/
curl -I http://127.0.0.1:3000/evaluation/
```

### Local frontend development

```bash
cd /home/nathabee/competence_project/competence-app
npm install
npm run local-build
npm run local-start
```

## 8. Demo frontend build

For local demo testing:

```bash
cd competence-app
npm run demo-test
```

For GitHub Pages deployment:

```bash
cd competence-app
npm run demo-deploy
```

## 9. Automated tests

### Backend tests

Backend tests live under `backend/competence/tests/`.

Example:

```bash
cd /home/nathabee/competence_project/backend
source venv/bin/activate
python manage.py test competence.tests.test_integration_workflow
```

### Frontend tests

```bash
cd /home/nathabee/competence_project/competence-app
npm run test
```

## Legacy and merge-source code

Code that is not part of the active runtime tree but is still kept for review or later merge work is stored under:

```text
to-be-merged/
```

This currently includes older or alternative code such as:

* WordPress plugin work
* legacy frontend code
* older Django code
* prototype code

That code is not part of the main installation flow.

## Jenkins pipelines

This repository now contains three Jenkins-related pipeline files or roles.

### `Jenkinsfile`

This is the normal deploy/test pipeline.

It performs the regular deployment flow:

1. backup
2. optional deploy-tree update
3. stop services
4. install backend and frontend dependencies
5. run database migration
6. ensure CI Django user
7. build frontend
8. collect static files
9. restart services
10. run tests
11. internal health check
12. optional external smoke check

This is the normal day-to-day deployment job.

### `Jenkinsfile.bootstrap`

This is the reset/cleanup pipeline.

It is used only for explicit reset operations such as:

* reset database
* clear media
* clear staticfiles

It does not perform the normal deployment flow.

### `devops/jenkins/Jenkinsfile.admin`

This is the host-admin pipeline reference.

Important: this file should be kept in the repository for documentation/versioning, but the actual Jenkins admin job should be created as an inline Pipeline script in Jenkins, not executed from public SCM.

This pipeline is for host-level operations such as:

* shared path preparation
* Jenkins access repair
* Jenkins sudoers
* Jenkins `.my.cnf`
* Jenkins service override
* Jenkins enablement
* package installation

See:

* [docs/jenkins.md](./docs/jenkins.md)

## Development note

In development, `/home/nathabee/competence_project` may be a symlink to the real working tree.

If Jenkins points to that path, deployment jobs may overwrite local changes depending on pipeline settings.

Do not run destructive reset/admin actions against that path unless it is intentionally the source of truth for the environment.

## Contributing

Issues and pull requests are welcome.

## Contact

For inquiries: [nathabee123@gmail.com](mailto:nathabee123@gmail.com)

## License

MIT License

Copyright (c) 2026 Natha Bee

--- 