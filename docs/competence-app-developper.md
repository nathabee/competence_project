# Developer Guide for competence-app

## Node and npm version

This project uses Node `20.20.2` via `nvm`.

The project contains a `.nvmrc`, so in a developer shell use:

```bash
cd /home/nathabee/competence_project/competence-app
nvm use
````

After that, plain `npm` commands are correct.

To verify:

```bash
node -v
npm -v
which node
which npm
```

## Install dependencies in development

```bash
cd /home/nathabee/competence_project/competence-app
nvm use
npm install
```

Example: install a specific package

```bash
npm install jspdf@4.2.1
```

## Run the app in development

```bash
cd /home/nathabee/competence_project/competence-app
nvm use
npm run dev
```

This uses `.env.development`.

## Test the local build

```bash
cd /home/nathabee/competence_project/competence-app
nvm use
npm run local-build
npm run local-start
```

These commands use `.env.development`.

## Test the production build locally

```bash
cd /home/nathabee/competence_project/competence-app
nvm use
npm run build
npm run start
```

In a standard Next.js production run, these commands use production environment values.
If a package script explicitly loads another env file, that script definition wins.

## Run tests

```bash
cd /home/nathabee/competence_project/competence-app
nvm use
npm run test
```

This uses the frontend test setup in `competence-app/__tests__`.

## Run lint

```bash
cd /home/nathabee/competence_project/competence-app
nvm use
npm run lint
```

## Audit dependencies

```bash
cd /home/nathabee/competence_project/competence-app
nvm use
npm audit
```

JSON report:

```bash
npm audit --json > audit.json
```

## Important distinction: dev shell vs services

For interactive developer work, use:

```bash
nvm use
npm ...
```

For Jenkins and systemd services, do not rely on `.nvmrc` alone.
Services must use an explicit Node/npm path or an explicitly configured `PATH`.

## Jenkins

In Jenkins, prefer `npm ci` for reproducible installs when `package-lock.json` is current and authoritative.
Use `npm install` only when you intentionally need to regenerate the lockfile.

## Production services

Frontend and backend services are managed by systemd.

Restart services:

```bash
sudo systemctl restart gunicorn
sudo systemctl restart npm-app
```

Start services:

```bash
sudo systemctl start gunicorn
sudo systemctl start npm-app
```

Stop services:

```bash
sudo systemctl stop gunicorn
sudo systemctl stop npm-app
```

Enable automatic start after reboot:

```bash
sudo systemctl enable gunicorn
sudo systemctl enable npm-app
```

## In case Jenkins is tested on a development tree

For local Jenkins/systemd testing, `/home/nathabee/competence_project` may be a symlink to the real repository, for example:

```text
/home/nathabee/competence_project -> /home/nathabee/coding/github/competence_project
```

ACLs must be applied to the real target directory, not only to the symlink path.
So for Jenkins access configuration, use the real working tree path.

Example:

```bash
./tools/setup_environment.sh --apply --ci \
  --project-path /home/nathabee/coding/github/competence_project \
  --backend-path /home/nathabee/coding/github/competence_project/backend \
  --project-owner nathabee \
  --project-group www-data \
  --sav-path /home/nathabee/sav \
  --media-target /var/www/competence_project/media \
  --static-target /var/www/competence_project/staticfiles \
  --grant-jenkins-access
```
 