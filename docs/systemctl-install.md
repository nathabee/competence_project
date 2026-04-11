# service installation manual




##  frontend service


### prerequise
Build the frontend first:

```bash
cd /home/nathabee/competence_project/competence-app
/home/nathabee/.nvm/versions/node/v20.20.2/bin/npm install
/home/nathabee/.nvm/versions/node/v20.20.2/bin/npm run build
```



### Production 
Create the systemd service:

```bash
sudo tee /etc/systemd/system/npm-app.service >/dev/null <<'SERVICE'
[Unit]
Description=Competence Project Next.js frontend
After=network.target

[Service]
Type=simple
User=nathabee
Group=www-data
WorkingDirectory=/home/nathabee/competence_project/competence-app

Environment=NODE_ENV=production
Environment=PORT=3000
Environment=PATH=/home/nathabee/.nvm/versions/node/v20.20.2/bin:/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin

ExecStart=/home/nathabee/.nvm/versions/node/v20.20.2/bin/npm run start
Restart=always
RestartSec=5

# optional but sensible
NoNewPrivileges=true
PrivateTmp=true

[Install]
WantedBy=multi-user.target
SERVICE
```

### Development
Create the systemd service:

```bash
sudo tee /etc/systemd/system/npm-app.service >/dev/null <<'SERVICE'
[Unit]
Description=Competence Project Next.js frontend
After=network.target

[Service]
Type=simple
User=nathabee
Group=www-data
WorkingDirectory=/home/nathabee/competence_project/competence-app

Environment=NODE_ENV=production
Environment=PORT=3000
Environment=PATH=/home/nathabee/.nvm/versions/node/v20.20.2/bin:/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin

ExecStart=/home/nathabee/.nvm/versions/node/v20.20.2/bin/npm run start
Restart=always
RestartSec=5

# optional but sensible
NoNewPrivileges=true
PrivateTmp=true

[Install]
WantedBy=multi-user.target
SERVICE
```

### Service activation
Activate it:

```bash
sudo systemctl daemon-reload
sudo systemctl enable --now npm-app
sudo systemctl status npm-app --no-pager
```

Check the frontend locally:

```bash
curl -I http://127.0.0.1:3000/
```




## Backend production service (Gunicorn)

Install Gunicorn in the virtual environment if not already available:

```bash
cd /home/nathabee/competence_project
source venv/bin/activate
pip install gunicorn
````

Create the systemd service:

```bash
sudo tee /etc/systemd/system/gunicorn.service >/dev/null <<'SERVICE'
[Unit]
Description=Gunicorn service for competence_project
After=network.target

[Service]
User=nathabee
Group=www-data
WorkingDirectory=/home/nathabee/competence_project
ExecStart=/home/nathabee/competence_project/venv/bin/gunicorn \
    --workers 3 \
    --bind 127.0.0.1:8080 \
    competence_project.wsgi:application
Restart=always
RestartSec=5

[Install]
WantedBy=multi-user.target
SERVICE
```

Reload systemd and start the service:

```bash
sudo systemctl daemon-reload
sudo systemctl enable --now gunicorn
sudo systemctl status gunicorn --no-pager
```

Check locally:

```bash
curl -I http://127.0.0.1:8080/api/
curl http://127.0.0.1:8080/api/
```

If needed, inspect logs:

```bash
sudo journalctl -u gunicorn -n 100 --no-pager
```
  
--- 