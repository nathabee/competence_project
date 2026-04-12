Yes. The right split is:

* `Jenkinsfile` for app deploy/test
* `Jenkinsfile.bootstrap` for app reset only
* `Jenkinsfile.admin` for host-level admin work

But here is the blunt part: **do not put the admin pipeline in the public app repo and run it from SCM**. That would make root-capable host automation depend on code pulled from a public repository path. For this one, either use a **private infra repo** or paste the pipeline directly into Jenkins as an inline Pipeline script.

## What this admin pipeline should do

This pipeline is for things like:

* prepare shared paths
* create/update DB user and DB
* write Jenkins `.my.cnf`
* grant Jenkins access
* write Jenkins sudoers
* write Jenkins systemd override
* enable Jenkins
* optionally run base package install

It is **not** for app deploy, app tests, or daily reset work.

## File 1: root-owned wrapper

Create this file on the server:

Path: `/usr/local/sbin/competence-admin-runner`

 
Install it like this:

```bash
sudo install -o root -g root -m 0755 /tmp/competence-admin-runner /usr/local/sbin/competence-admin-runner
```

If you create it directly in place:

```bash
sudo chmod 0755 /usr/local/sbin/competence-admin-runner
sudo chown root:root /usr/local/sbin/competence-admin-runner
```

## File 2: narrow sudoers entry for Jenkins

Create this file:

Path: `/etc/sudoers.d/jenkins-competence-admin`

 

Install and validate it:

```bash
echo 'jenkins ALL=(root) NOPASSWD: /usr/local/sbin/competence-admin-runner' | sudo tee /etc/sudoers.d/jenkins-competence-admin >/dev/null
sudo chmod 440 /etc/sudoers.d/jenkins-competence-admin
sudo visudo -cf /etc/sudoers.d/jenkins-competence-admin
```

Keep your existing deploy sudoers entries for `systemctl` and `git`. This is an additional admin-only path, not a replacement.

## File 3: admin pipeline

Use this as `Jenkinsfile.admin`.

 

## How to put it into Jenkins

Because this pipeline is host-admin and potentially root-impacting, the safest practical option is this:

### Best option

Create the job as **Pipeline** and paste the script directly into Jenkins.

Do not use “Pipeline script from SCM” from the public app repo for this one.

The steps:

1. In Jenkins, click **New Item**
2. Name it `competence-admin`
3. Choose **Pipeline**
4. In the job configuration:

   * keep **Build Triggers** empty
   * do not enable automatic builds
   * this should be manual only
5. Under **Pipeline**, choose **Pipeline script**
6. Paste the full `Jenkinsfile.admin` content
7. Save

## Add the DB credential in Jenkins

If you want the pipeline to create/update the DB user or write `/var/lib/jenkins/.my.cnf`, create this credential first:

* **Manage Jenkins**
* **Credentials**
* **System**
* **Global credentials (unrestricted)**
* **Add Credentials**

Use:

* **Kind:** Username with password
* **ID:** `competence-db-user`
* **Username:** your DB username, for example `competence_user`
* **Password:** the real DB password

If you do not run `CREATE_DB` or `WRITE_JENKINS_MYCNF`, that credential is not needed for that build.

## Access control in Jenkins

This matters.

Regular developers should not be able to run or edit this job. Only trusted admins should.

If you use Role Strategy or a similar plugin, give `competence-admin` only to an ops/admin role. At minimum, restrict:

* Configure
* Build
* Cancel
* Workspace access

for that job to trusted admins only.

## What each pipeline is now for

Use them like this:

* `Jenkinsfile`
  normal deploy, test, build, smoke checks

* `Jenkinsfile.bootstrap`
  app reset only: DB reset, media/static cleanup

* `competence-admin`
  host/admin operations: shared paths, Jenkins access, sudoers, `.my.cnf`, Jenkins override, Jenkins enablement, package install

## Important operational note

This admin pipeline is useful **after Jenkins already exists**.

For the very first Jenkins install on a completely fresh machine, Jenkins is obviously not there yet to run a Jenkins job. So the true first install still has to be done manually or through an infra tool like Ansible. After that, this pipeline becomes useful for controlled repair and maintenance.

## First safe test

For the first run, keep it narrow:

* check `I_UNDERSTAND_THIS_PIPELINE_MODIFIES_THE_HOST`
* check `PREPARE_SHARED_PATHS`
* leave everything else off

If that works, then test:

* `GRANT_JENKINS_ACCESS`

Then later:

* `WRITE_JENKINS_OVERRIDE`
* `WRITE_JENKINS_SUDOERS`

Keep `INSTALL_BASE_ENV` and `INSTALL_JENKINS_PACKAGE` for explicit admin sessions only.
 
