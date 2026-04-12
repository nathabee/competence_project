# Jenkins Setup

## Purpose

This document explains how Jenkins is used for the Competence Project.

The repository now uses three different Jenkins roles:

- `Jenkinsfile` for normal deploy, test, and smoke-check flow
- `Jenkinsfile.bootstrap` for explicit reset/cleanup operations
- `devops/jenkins/Jenkinsfile.admin` as the reference for host-level admin work

Important:

- the normal deploy and bootstrap jobs can be loaded from SCM
- the admin job should **not** be executed from the public repository through “Pipeline script from SCM”
- the admin job should be created as an **inline Pipeline script** in Jenkins

---

## 1. Prerequisite: this machine must run systemd

The Jenkins Debian package installs Jenkins as a `systemd` service.

Before installing Jenkins, verify that:

```bash
command -v systemctl
ps -p 1 -o comm=
test -d /run/systemd/system && echo "systemd runtime present" || echo "no systemd runtime"
````

Expected result:

* `systemctl` exists
* PID 1 is `systemd`
* `/run/systemd/system` exists

If this is not true, do not use the Jenkins `.deb` install path on that machine.

---

## 2. Prepare the server and install Jenkins

Use the environment setup script instead of running many separate manual commands.

```bash
cd /home/nathabee/competence_project

./tools/setup_environment.sh --install --ci \
  --project-path /home/nathabee/competence_project \
  --backend-path /home/nathabee/competence_project/backend \
  --project-owner nathabee \
  --project-group www-data \
  --create-db --db-name competencedb --db-user competence_user --db-pass 'REAL_DB_PASSWORD_HERE' \
  --prepare-shared-paths \
  --install-jenkins \
  --write-jenkins-override --jenkins-port 8081 --node-bin /home/nathabee/.nvm/versions/node/v20.20.2/bin \
  --grant-jenkins-access \
  --write-jenkins-mycnf --db-host localhost \
  --write-jenkins-sudoers \
  --enable-jenkins
```

This command does the following:

* installs required system packages
* creates or updates the backend Python virtual environment and Django base install
* creates or updates the MySQL database/user
* prepares shared paths:

  * `/home/nathabee/sav`
  * `/var/www/competence_project/media`
  * `/var/www/competence_project/staticfiles`
* ensures backend symlinks:

  * `/home/nathabee/competence_project/backend/media`
  * `/home/nathabee/competence_project/backend/staticfiles`
* installs Jenkins
* writes the Jenkins systemd override
* grants Jenkins access to the project/shared paths
* writes `/var/lib/jenkins/.my.cnf`
* writes `/etc/sudoers.d/jenkins-competence`
* enables and starts Jenkins

### Note

Run `setup_environment.sh` as a normal user with sudo rights.

Do not normally run the whole script itself with `sudo`, because the script already elevates only the operations that require it.

If the database password changes later, rerun only the DB-related part:

```bash
./tools/setup_environment.sh --apply --ci \
  --project-path /home/nathabee/competence_project \
  --backend-path /home/nathabee/competence_project/backend \
  --project-owner nathabee \
  --project-group www-data \
  --create-db --db-name competencedb --db-user competence_user --db-pass 'REAL_DB_PASSWORD_HERE' \
  --write-jenkins-mycnf --db-host localhost
```

---

## 3. Check Jenkins is running

```bash
sudo systemctl status jenkins --no-pager
curl -I http://127.0.0.1:8081/
```

---

## 4. Get the initial admin password and finish the UI setup

```bash
sudo cat /var/lib/jenkins/secrets/initialAdminPassword
```

Before Apache reverse proxy is configured, open:

```text
http://YOUR_SERVER_IP:8081/
```

After Apache + HTTPS for Jenkins are configured, prefer:

```text
https://jenkins.nathabee.de/
```

Then:

* unlock Jenkins with the initial admin password
* choose **Install suggested plugins**
* wait for plugin installation
* create the first Jenkins web admin account

Example:

* username: `jenkins-admin`
* password: your chosen password
* full name: optional
* email: optional but useful

This account is only for the Jenkins web UI and Jenkins administration.

---

## 5. Create the Django CI user and the Jenkins credential

These are two different things:

1. a Django application user in the app database
2. a Jenkins credential storing that username/password

### Create the Django CI user

Set these values in the repository root `.env` file:

```env
CI_HEALTHCHECK_USERNAME="compet_ci"
CI_HEALTHCHECK_EMAIL="YOUR_REAL_EMAIL"
CI_HEALTHCHECK_PASSWORD="YOUR_REAL_PASSWORD"
```

Then run:

```bash
./tools/setup_django.sh --setup --ci \
  --project-path /home/nathabee/competence_project \
  --backend-path /home/nathabee/competence_project/backend \
  --venv-path /home/nathabee/competence_project/backend/venv \
  --ensure-ci-user
```

If the API really requires the teacher role, add the user to the correct group afterward.

### Test the token endpoint

```bash
curl -sS -X POST \
  -H "Content-Type: application/json" \
  -H "X-Forwarded-Proto: https" \
  -d '{"username":"compet_ci","password":"YOUR_REAL_PASSWORD"}' \
  http://127.0.0.1:8080/api/token/
```

If this returns access and refresh tokens, the Django-side user is correct.

### Create the Jenkins credential

In the Jenkins UI:

* **Manage Jenkins**
* **Credentials**
* **System**
* **Global credentials (unrestricted)**
* **Add Credentials**

Use:

* **Kind:** Username with password
* **Scope:** Global
* **Username:** `compet_ci`
* **Password:** the Django password
* **ID:** `competence-app-teacher-id`
* **Description:** `Django CI user for competence health check`

---

## 6. Create the pipeline jobs

## 6.1 Standard deployment job

Create a Pipeline job from SCM.

For `competence-deploy`:

* Type: **Pipeline**
* Definition: **Pipeline script from SCM**
* SCM: **Git**
* Repository URL: `https://github.com/nathabee/competence_project.git`
* Credentials: none
* Branches to build: `*/main`
* Script Path: `Jenkinsfile`
* Do not allow concurrent builds: checked
* Everything else: leave default unless you explicitly need it

Because the repository is public, no Git credential is required for checkout.

---

## 6.2 Bootstrap/reset job

Create a second Pipeline job from SCM.

For `competence-bootstrap`:

* Type: **Pipeline**
* Definition: **Pipeline script from SCM**
* SCM: **Git**
* Repository URL: `https://github.com/nathabee/competence_project.git`
* Credentials: none
* Branches to build: `*/main`
* Script Path: `Jenkinsfile.bootstrap`
* Do not allow concurrent builds: checked
* Everything else: leave default unless you explicitly need it

Because the repository is public, no Git credential is required for checkout.

---

## 6.3 Admin job

Create the admin job manually as an inline Pipeline script.

Do **not** use “Pipeline script from SCM” from the public repository for this one.

For `competence-admin`:

* Type: **Pipeline**
* Definition: **Pipeline script**
* Paste the content of `devops/jenkins/Jenkinsfile.admin`
* Do not configure automatic triggers
* Keep it manual only

This job is for host-level operations such as:

* prepare shared paths
* create or update DB user and DB
* write Jenkins `.my.cnf`
* grant Jenkins access
* write Jenkins sudoers
* write Jenkins systemd override
* enable Jenkins
* optionally install base packages

### Important

The admin job depends on the host-side installed files:

* `/usr/local/sbin/competence-admin-runner`
* `/etc/sudoers.d/jenkins-competence-admin`

and, if you use the hardened setup, the installed root-owned admin script copy outside the repo.

This admin path is separate from the normal deploy/bootstrap jobs.

---

## 7. Access control

The admin job should not be available to regular developers.

Restrict at least these permissions for `competence-admin`:

* Configure
* Build
* Cancel
* Workspace access

Only trusted admins should be able to run or edit it.

The normal deploy/bootstrap jobs can have broader access depending on your workflow.

---

## 8. What each job is for

### `competence-deploy`

Normal day-to-day deployment job.

Expected flow:

1. backup
2. optional deploy-tree update
3. stop services
4. install backend and frontend dependencies
5. database migration
6. ensure CI Django user
7. frontend build
8. collect static files
9. start services
10. backend and frontend tests
11. internal health check
12. optional external smoke check

### `competence-bootstrap`

Explicit reset/cleanup job.

Used only when you intentionally want operations such as:

* database reset
* media cleanup
* staticfiles cleanup

It does **not** do the normal deploy/build/test flow.

### `competence-admin`

Host-level admin and repair job.

Used only for privileged infrastructure actions.

It is not for normal deploys or daily app usage.

---

## 9. First run: keep it conservative

For the first proof run, use the normal deployment job and avoid destructive reset operations.

The expected first successful deploy run is:

* backup
* checkout/update if enabled
* stop services
* install dependencies
* migrate
* ensure CI user
* build frontend
* collectstatic
* start services
* run tests
* internal health check
* external smoke check if enabled

Use the bootstrap job only when you explicitly want reset/cleanup behavior.

Use the admin job only for host-level setup or repair.

### Safe first admin test

For the first admin test, keep it narrow:

* check `I_UNDERSTAND_THIS_PIPELINE_MODIFIES_THE_HOST`
* check `PREPARE_SHARED_PATHS`
* leave everything else off

Then test:

* `GRANT_JENKINS_ACCESS`

Only later move on to:

* `WRITE_JENKINS_OVERRIDE`
* `WRITE_JENKINS_SUDOERS`
* `WRITE_JENKINS_MYCNF`
* `ENABLE_JENKINS`

Use `INSTALL_BASE_ENV` and `INSTALL_JENKINS_PACKAGE` only in explicit admin sessions.

---

## 10. Smoke checks

After Jenkins starts:

```bash
sudo journalctl -u jenkins -n 100 --no-pager
curl -I http://127.0.0.1:8081/
```

After a build:

```bash
curl -I https://competence.nathabee.de/api/
curl -I https://competence.nathabee.de/admin/
curl -I https://competence.nathabee.de/static/admin/css/base.css
```

If the frontend is served at `/evaluation`, also test:

```bash
curl -I https://competence.nathabee.de/evaluation/
```

If Jenkins is reverse-proxied through Apache, also test:

```bash
curl -I https://jenkins.nathabee.de/
```

---

## 11. Operational notes

### Deploy tree caution

In development, `/home/nathabee/competence_project` may be a symlink to the real working tree.

If Jenkins points at that path, deploy jobs may reset or overwrite local changes depending on pipeline settings.

Do not run destructive bootstrap/admin actions against that path unless it is intentionally the source of truth for the environment.

### First Jenkins install on a fresh machine

The admin pipeline is useful only **after Jenkins already exists**.

For the very first Jenkins installation on a completely fresh machine, Jenkins obviously is not there yet to run a Jenkins job.

So the first Jenkins installation must still be done manually or through a separate infra tool. After that, the admin pipeline becomes useful for controlled maintenance and repair.

---

## 12. Long-term note

The current layout is workable, but the project still lives under a private home directory.

A cleaner long-term layout would be something like:

* `/srv/competence_project`
* `/srv/competence_backups`
* `/var/www/competence_project`

That is not required now, but it is the cleaner server layout for the future.
 