# Operation Manual

## Start and stop services

### Jenkins

```bash
sudo systemctl daemon-reload
sudo systemctl restart jenkins
sudo systemctl show jenkins -p Environment
sudo -u jenkins /bin/sh -lc 'which node && node -v && which npm && npm -v'
````

This is useful after changing the Jenkins systemd override or checking whether the Jenkins service really sees the expected Node.js path.

### Stop application services

```bash
sudo systemctl stop npm-app
sudo systemctl stop gunicorn
```

### Start application services

Frontend service: `npm-app`
Backend service: `gunicorn`

```bash
sudo systemctl start npm-app
sudo systemctl start gunicorn
```

### Enable services at boot

To make the application services start automatically after reboot:

```bash
sudo systemctl enable npm-app
sudo systemctl enable gunicorn
```

### Who restarts services?

* **systemd** manages the service lifecycle:

  * start at boot
  * restart on crash if configured
  * logs
  * status
* **Jenkins** manages CI/CD:

  * update code
  * run tests
  * build frontend
  * run migrations or collectstatic if needed
  * restart services after a successful deployment

Typical restart commands used during deployment:

```bash
sudo systemctl restart gunicorn
sudo systemctl restart npm-app
```
 