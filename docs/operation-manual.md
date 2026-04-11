# user manual

## start stop services


### jenkins

```bash
sudo systemctl daemon-reload
sudo systemctl restart jenkins
sudo systemctl show jenkins -p Environment
sudo -u jenkins /bin/sh -lc 'which node && node -v && which npm && npm -v'

``` 

### stop services


```bash
sudo systemctl stop npm-app
sudo systemctl stop gunicorn
 
```

### start services

Start the frontend service: npm-app , backend : gunicorn

```bash
sudo systemctl start npm-app
sudo systemctl start gunicorn
 
```



### who makes services restart ?


* **systemd** owns service lifecycle: boot start, restart on crash, logs, status
* **Jenkins** owns CI/CD: pull, test, build, then restart/reload the services after a successful deployment

enable restart of service, fater reboot:

```bash
sudo systemctl enable npm-app
sudo systemctl enable gunicorn
```

and in Jenkins later, after a successful deploy:

```bash
sudo systemctl restart gunicorn
sudo systemctl restart npm-app
```

 