# user manual

## start stop services


### jenkins

sudo systemctl daemon-reload
sudo systemctl restart jenkins
sudo systemctl show jenkins -p Environment
sudo -u jenkins /bin/sh -lc 'which node && node -v && which npm && npm -v'


### frontend

typically after a buid we will restart the services


Stop the frontend service:

```bash
sudo systemctl stop npm-app
 
```

Start the frontend service:

```bash
sudo systemctl start npm-app
 
```


### backend

typically we will restart the services


Stop the backend service:

```bash
sudo systemctl stop gunicorn

 
Start the backend service:

```bash
sudo systemctl start gunicorn
 
```
