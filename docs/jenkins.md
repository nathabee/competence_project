# Jenkins Setup

## 1. Prerequisite: this machine must run systemd

The Jenkins Debian package installs Jenkins as a `systemd` service.

Before installing Jenkins, verify that:

```bash
command -v systemctl
ps -p 1 -o comm=
test -d /run/systemd/system && echo "systemd runtime present" || echo "no systemd runtime"
```

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
* creates or updates the Python virtual environment and Django base install
* creates or updates the MySQL database/user
* prepares shared paths:

  * `/home/nathabee/sav`
  * `/var/www/competence_project/media`
  * `/var/www/competence_project/staticfiles`
* ensures project symlinks:

  * `/home/nathabee/competence_project/media`
  * `/home/nathabee/competence_project/staticfiles`
* installs Jenkins
* writes the Jenkins systemd override
* grants Jenkins access to the project/shared paths
* writes `/var/lib/jenkins/.my.cnf`
* writes `/etc/sudoers.d/jenkins-competence`
* enables and starts Jenkins

### Note

If the database password changes later, rerun only the DB-related part:

```bash
./tools/setup_environment.sh --install --ci \
  --project-path /home/nathabee/competence_project \
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

Open:

```text
http://YOUR_SERVER_IP:8081/
```

After unlocking Jenkins, use **Install suggested plugins**.

After that:

choose Install suggested plugins
wait for plugin installation
Jenkins then asks you to create the first admin user

This is where you create the Jenkins web admin account, for example:

username: jenkins-admin
password: your chosen password
full name: optional
email: optional but useful

This account is only for logging into the Jenkins web UI and administering Jenkins itself.

---

## 5. Create the Django CI user and the Jenkins credential

These are two different things:

1. a Django application user in the app database
2. a Jenkins credential storing that username/password

### Create the Django user

```bash
cd /home/nathabee/competence_project
source venv/bin/activate
python manage.py shell
```

Then:

```python
from django.contrib.auth import get_user_model

User = get_user_model()

username = "compet_ci"
email = "fill_your_adresse_here"
password = "PUT_A_STRONG_PASSWORD_HERE"

user, created = User.objects.get_or_create(
    username=username,
    defaults={"email": email}
)

user.email = email
user.is_active = True
user.is_staff = False
user.is_superuser = False
user.set_password(password)
user.save()

print("created:", created)
print("username:", user.username)
print("active:", user.is_active)
print("staff:", user.is_staff)
print("superuser:", user.is_superuser)
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

If this returns access/refresh tokens, the Django-side user is correct.

### Create the Jenkins credential

In Jenkins UI:

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

Create two Pipeline jobs from SCM.

### Standard deployment job

* Repository: `https://github.com/nathabee/competence_project.git`
* Branch: `main`
* Script Path: `Jenkinsfile`

### Bootstrap/reset job

* Repository: `https://github.com/nathabee/competence_project.git`
* Branch: `main`
* Script Path: `Jenkinsfile.bootstrap`

Because the repository is public, no Git credential is required for checkout.

---

## 7. First run: keep it conservative

For the first proof run, use the standard deployment job and do not reset anything.

The expected first successful run is:

* backup
* checkout/update
* stop services
* install dependencies
* migrate
* build frontend
* collectstatic
* start services
* health check
* smoke check

Use the bootstrap job only when you explicitly want:

* media preparation
* DB reset
* init data
* translation population
* password reset

---

## 8. Smoke checks

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

---

## 9. Long-term note

The current paths are workable, but the project still lives under a private home directory.

A cleaner long-term layout would be something like:

```bash
* `/srv/competence_project`
* `/srv/competence_backups`
* `/var/www/competence_project`

```
