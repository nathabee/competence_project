# JENKINS SETUP


## 1. Install Jenkins

Run this exactly on the server:

```bash
sudo apt update
sudo apt install -y fontconfig openjdk-21-jre

sudo wget -O /etc/apt/keyrings/jenkins-keyring.asc \
  https://pkg.jenkins.io/debian-stable/jenkins.io-2026.key

echo "deb [signed-by=/etc/apt/keyrings/jenkins-keyring.asc] https://pkg.jenkins.io/debian-stable binary/" \
  | sudo tee /etc/apt/sources.list.d/jenkins.list > /dev/null

sudo apt update
sudo apt install -y jenkins
```

### providory solution for acces right (to be inproved)
add jenkins user in correct groupd to enable sav:

```bash 

sudo mkdir -p /home/nathabee/sav
sudo chown nathabee:www-data /home/nathabee/sav
sudo chmod 775 /home/nathabee/sav


sudo usermod -aG www-data jenkins
sudo chgrp -R www-data /home/nathabee/competence_project /home/nathabee/sav /var/www/competence_project
sudo chmod -R g+rwX /home/nathabee/competence_project /home/nathabee/sav /var/www/competence_project
sudo find /home/nathabee/competence_project /home/nathabee/sav /var/www/competence_project -type d -exec chmod g+s {} \;
 

sudo apt install -y acl

sudo setfacl -m u:jenkins:rx /home/nathabee
sudo setfacl -m u:jenkins:rwx /home/nathabee/sav
sudo setfacl -R -m u:jenkins:rwx /home/nathabee/competence_project
sudo setfacl -R -m u:jenkins:rwx /var/www/competence_project


sudo -u jenkins mkdir -p /home/nathabee/sav/test_from_jenkins
sudo -u jenkins touch /home/nathabee/sav/test_from_jenkins/ok
sudo -u jenkins rm -rf /home/nathabee/sav/test_from_jenkins

``` 

### Note :
Better long-term structure

Your deployment paths are inside a private home directory. That is awkward for a service account.

Cleaner long-term would be to move them to something like:

/srv/competence_project
/srv/competence_backups
/var/www/competence_project
 

## 2. Check which port is fir Jenkins

Per defulat port will be 8080, if already used, then fix the Jenkins port collision and Node PATH

check is collision:
sudo ss -ltnp | grep ':8080\b'

collision to be expected because of  backend already using `127.0.0.1:8080`, so move Jenkins to `8081`.

Also, Jenkins runs as the `jenkins` service user, so it will **not** see the Node 20 you installed with `nvm` for `nathabee` unless you expose that PATH to the service.

Run:

```bash
sudo mkdir -p /etc/systemd/system/jenkins.service.d

sudo tee /etc/systemd/system/jenkins.service.d/override.conf >/dev/null <<'EOF'
[Service]
Environment="JENKINS_PORT=8081"
Environment="PATH=/home/nathabee/.nvm/versions/node/v20.20.2/bin:/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin"

EOF
```




Check File
cat /etc/systemd/system/jenkins.service.d/override.conf
 

Then:

```bash
sudo systemctl daemon-reload
sudo systemctl enable --now jenkins
sudo systemctl status jenkins --no-pager
```

The port override is straight from the Jenkins Linux docs. ([Jenkins][1])

## 3. Get the initial admin password and finish the UI setup

```bash
sudo cat /var/lib/jenkins/secrets/initialAdminPassword
```

Open:

```text
http://YOUR_SERVER_IP:8081/
```

or later proxy it through Apache if you want.

After unlocking Jenkins, use **Install suggested plugins**. The Jenkins setup wizard explicitly recommends that path when you are not sure what you need. ([Jenkins][1])

## 4. Create the server-side prerequisites your pipeline expects

### Backup directory

check /home/nathabee/sav exists (created at the beginning)  


### MySQL client file for Jenkins

Since your pipeline uses:

```groovy
mysqldump --defaults-extra-file=/var/lib/jenkins/.my.cnf
```

create that file now:

```bash
sudo tee /var/lib/jenkins/.my.cnf >/dev/null <<'EOF'
[client]
user=competence_user
password=YOUR_DB_PASSWORD
host=localhost
EOF

sudo chown jenkins:jenkins /var/lib/jenkins/.my.cnf
sudo chmod 600 /var/lib/jenkins/.my.cnf
```

Keep `RESET_DB="false"` in the pipeline for now. With that setting, normal DB access for dump/migrations is enough; you do not need to solve destructive DB reset rights yet.

## 5. Give Jenkins only the minimum sudo it currently needs

Because your pipeline stops and starts services, Jenkins needs controlled sudo.

Create:

```bash
sudo tee /etc/sudoers.d/jenkins-competence >/dev/null <<'SUDO'
jenkins ALL=NOPASSWD: /usr/bin/systemctl start gunicorn, /usr/bin/systemctl stop gunicorn, /usr/bin/systemctl start npm-app, /usr/bin/systemctl stop npm-app
jenkins ALL=(nathabee) NOPASSWD: /usr/bin/git
SUDO

sudo chmod 440 /etc/sudoers.d/jenkins-competence
sudo visudo -cf /etc/sudoers.d/jenkins-competence
```

That is enough for the current start/stop and `sudo -u nathabee git ...` pattern.

## 6. check the `Jenkinsfile` before the first build

 

* `media` symlinked to `/var/www/competence_project/media`
* `staticfiles` should likewise point to `/var/www/competence_project/staticfiles`

That means the old static stage in the pipeline is no longer right. It should **not** copy `staticfiles/*` somewhere else after `collectstatic`, because `collectstatic` already writes into the final location through the symlink.

 
```groovy
STATIC_FILES_PATH = "/var/www/competence_project/staticfiles"
```

Then simplify the **Collect Static Files** stage to only:

```groovy
stage('Collect Static Files') {
    steps {
        script {
            sh ". ${VENV_PATH}/bin/activate && python ${PROJECT_PATH}/manage.py collectstatic --noinput"
        }
    }
}
```

#### 7. add apache configguration for jenkins

see docs/apache.md file


#### 8. In Jenkins UI, create two separate things

**A. Create the Jenkins administrator user**

Create the first Jenkins admin user during the setup wizard, for example:

* username: `jenkins-admin`
 
This account is only for administering Jenkins itself. It is not related to Django users. ([Jenkins][1])

**B. Create the application credential used by the pipeline**

Create a **Username with password** credential with:

* **ID:** `competence-app-teacher-id`

Use a **dedicated Django application user** for this credential.
Recommended:

* active user
* no superuser rights unless required
* no admin/staff rights unless your tests really need admin behavior

If your tests require a “teacher” domain role, then use a dedicated teacher test account. If the credential is only for API token issuance and basic authenticated API checks, a normal dedicated app user is cleaner. Jenkins credentials binding is the right storage mechanism for this. 

##### how to create the competence-app-teacher-id :

we need to create **two different things**:

1. a **Django application user** in your app database
2. a **Jenkins credential** that stores that user’s username/password

They are not the same object.

Your current pipeline only uses this credential in the internal health check via `withCredentials(...)`, and Jenkins binds that credential into environment variables only inside that block. ([Jenkins][1])

Because of that, the clean choice is:

* create a **normal active Django user**
* **not staff**
* **not superuser**
* add teacher/domain permissions **only if your API really requires them**

For a token request plus a basic authenticated API smoke check, a plain active user is usually enough. Django’s auth system is built around active users plus optional staff/superuser permissions when needed.  


So the order is:

1. create `compet_ci` in Django
2. test `/api/token/` manually
3. add Jenkins credential `competence-app-teacher-id`
4. create the Pipeline job

 

#####  django user compet_ci

Use something like:

* username: `compet_ci`
* email: `fill_your_adresse_here`
* password: a strong generated password

Do **not** reuse `compet` and do **not** use the Jenkins admin account here.

 

On the server:

```bash
cd /home/nathabee/competence_project
source venv/bin/activate
python manage.py shell
```





Then in the Django shell:

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

Then exit the shell.

#####   If your app really needs the “teacher” role

Only do this if your API endpoint behind the health check requires teacher permissions.

Back in `manage.py shell`:

```python
from django.contrib.auth import get_user_model
from django.contrib.auth.models import Group

User = get_user_model()
user = User.objects.get(username="compet_ci")
group = Group.objects.get(name="teacher")
user.groups.add(group)
user.save()

print(list(user.groups.values_list("name", flat=True)))
```

If your project uses a different group name, use that exact one.

#####  Then create the Jenkins credential

In Jenkins UI:

* **Manage Jenkins**
* **Credentials**
* under **Stores scoped to Jenkins**, click **System**
* click **Global credentials (unrestricted)**
* **Add Credentials**

Jenkins documents that path for adding global credentials. Credentials are stored in Jenkins and then referenced by `credentialsId` inside Pipeline. ([Jenkins][3])

Use:

* **Kind:** `Username with password`
* **Scope:** Global
* **Username:** `compet_ci`
* **Password:** the password you set in Django
* **ID:** `competence-app-teacher-id`
* **Description:** `Django CI user for competence health check`

Even though the ID contains `teacher`, it does not have to be a teacher unless your app logic requires that. It is just the lookup key used by the pipeline.

#####   Why Global and not some special hidden scope

Because your Pipeline job needs to read it by `credentialsId`. Jenkins’ credential model makes credentials available to jobs by ID, and the common job-usable place is global credentials under the Jenkins store. ([Jenkins][3])

#####  Best next check before creating the job

After creating the Django user, test it directly first:

```bash
curl -sS -X POST \
  -H "Content-Type: application/json" \
  -d '{"username":"compet_ci","password":"YOUR_REAL_PASSWORD"}' \
  https://competence.nathabee.de/api/token/
```
 
curl -sS -X POST \
  -H "Content-Type: application/json" \
  -H "X-Forwarded-Proto: https" \
  -d '{"username":"compet_ci","password":"333Cochon&&&"}' \
  http://127.0.0.1:8080/api/token/


If that returns access/refresh tokens, your Django-side user is good. Then create the Jenkins credential with the same values.


## 9. Create the pipeline job

Create a **Pipeline** job and point it to:

* repo: `https://github.com/nathabee/competence_project.git`
* branch: `main`
* script path: `Jenkinsfile`

Because the repo is public, you do **not** need Git credentials for checkout. If you later switch to SSH, Jenkins’ Git steps require an SSH private key credential; for authenticated HTTPS, they require username/password credentials. ([Jenkins][3])

## 10. First run: keep it conservative

For the first run, do not try the whole world at once.

Keep:

* `RESET_DB = "false"`
* `INIT_DB = "false"` unless you really want the populate commands again
* `POPULATE_TRANSLATION = "false"` for the first proof run if you want less noise

The first successful Jenkins proof should be:

* backup
* checkout/update
* stop services
* install deps
* migrate
* collectstatic
* start services
* health check

That is enough.

## 11. First smoke checks after Jenkins starts

Run these after Jenkins is up and the job exists:

```bash
sudo journalctl -u jenkins -n 100 --no-pager
curl -I http://127.0.0.1:8081/
```

And after a build:

```bash
curl -I https://competence.nathabee.de/api/
curl -I https://competence.nathabee.de/admin/
curl -I https://competence.nathabee.de/static/admin/css/base.css
```

