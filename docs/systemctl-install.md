# Service Installation Manual

This document explains how to install the production and development systemd services used by the Competence Project.

Active paths:

- frontend: `/home/nathabee/competence_project/competence-app`
- backend: `/home/nathabee/competence_project/backend`

---

## Frontend service

## Prerequisite

Build the frontend first.

### Production build

```bash
cd /home/nathabee/competence_project/competence-app
/home/nathabee/.nvm/versions/node/v20.20.2/bin/npm install
/home/nathabee/.nvm/versions/node/v20.20.2/bin/npm run build
````

---

## Frontend production service

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

NoNewPrivileges=true
PrivateTmp=true

[Install]
WantedBy=multi-user.target
SERVICE
```

---

## Frontend development service

This is only for local development. It is not the normal production setup.

Create the systemd service:

```bash
sudo tee /etc/systemd/system/npm-app.service >/dev/null <<'SERVICE'
[Unit]
Description=Competence Project Next.js frontend (development)
After=network.target

[Service]
Type=simple
User=nathabee
Group=www-data
WorkingDirectory=/home/nathabee/competence_project/competence-app

Environment=NODE_ENV=development
Environment=PORT=3000
Environment=PATH=/home/nathabee/.nvm/versions/node/v20.20.2/bin:/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin

ExecStart=/home/nathabee/.nvm/versions/node/v20.20.2/bin/npm run local-start
Restart=always
RestartSec=5

NoNewPrivileges=true
PrivateTmp=true

[Install]
WantedBy=multi-user.target
SERVICE
```

---

## Frontend service activation

```bash
sudo systemctl daemon-reload
sudo systemctl enable --now npm-app
sudo systemctl status npm-app --no-pager
```

Check the frontend locally.

For a frontend served at `/`:

```bash
curl -I http://127.0.0.1:3000/
```

For a frontend served at `/evaluation`:

```bash
curl -I http://127.0.0.1:3000/evaluation/
```

If needed, inspect logs:

```bash
sudo journalctl -u npm-app -n 100 --no-pager
```

---

## Backend production service (Gunicorn)

Install Gunicorn in the backend virtual environment if not already available:

```bash
cd /home/nathabee/competence_project/backend
source venv/bin/activate
pip install gunicorn
```

Create the systemd service:

```bash
sudo tee /etc/systemd/system/gunicorn.service >/dev/null <<'SERVICE'
[Unit]
Description=Gunicorn service for Competence Project backend
After=network.target

[Service]
Type=simple
User=nathabee
Group=www-data
WorkingDirectory=/home/nathabee/competence_project/backend
ExecStart=/home/nathabee/competence_project/backend/venv/bin/gunicorn \
    --workers 3 \
    --bind 127.0.0.1:8080 \
    competence_project.wsgi:application
Restart=always
RestartSec=5

NoNewPrivileges=true
PrivateTmp=true

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

## Notes

* `npm-app` serves the frontend on `127.0.0.1:3000`.
* `gunicorn` serves the Django backend on `127.0.0.1:8080`.
* Apache reverse-proxies public traffic to these local services.
* In production, use the production frontend service block, not the development one.
* After changing a unit file, always run:

```bash
sudo systemctl daemon-reload
```

and then restart the service.

Example:

```bash
sudo systemctl restart npm-app
sudo systemctl restart gunicorn
```

``` 