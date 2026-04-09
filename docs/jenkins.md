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
EOF
```

Paste this:

```ini
[Service]
Environment="JENKINS_PORT=8081"
Environment="PATH=/home/nathabee/.nvm/versions/node/v20.20.2/bin:/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin"
```

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

```bash
sudo mkdir -p /home/nathabee/sav
sudo chown nathabee:www-data /home/nathabee/sav
sudo chmod 775 /home/nathabee/sav
```

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

 

## 7. In Jenkins UI, create the one credential your pipeline already expects

Create a **Username with password** credential with:

* **ID:** `competence-app-teacher-id`
* username: one of your known teacher users
* password: the known password you reset

Your pipeline uses `withCredentials([usernamePassword(...)])`, and Jenkins credentials are the intended way to inject secrets into builds. The Credentials Binding plugin is specifically for that. ([Jenkins Plugins][2])

## 8. Create the pipeline job

Create a **Pipeline** job and point it to:

* repo: `https://github.com/nathabee/competence_project.git`
* branch: `main`
* script path: `Jenkinsfile`

Because the repo is public, you do **not** need Git credentials for checkout. If you later switch to SSH, Jenkins’ Git steps require an SSH private key credential; for authenticated HTTPS, they require username/password credentials. ([Jenkins][3])

## 9. First run: keep it conservative

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

## 10. First smoke checks after Jenkins starts

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

