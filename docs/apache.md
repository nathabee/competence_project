# Apache + HTTPS for `competence.nathabee.de`

## Purpose

This document explains how to expose the Competence Project publicly through Apache with HTTPS.

Apache acts as the public reverse proxy and routes traffic to the local backend and frontend services.

## Target routing

Backend and static/media routing:

- `https://competence.nathabee.de/api/` -> `http://127.0.0.1:8080/api/`
- `https://competence.nathabee.de/admin/` -> `http://127.0.0.1:8080/admin/`
- `https://competence.nathabee.de/media/` -> `/var/www/competence_project/media/`
- `https://competence.nathabee.de/static/` -> `/var/www/competence_project/staticfiles/`

Frontend routing:

- Apache proxies frontend traffic to `http://127.0.0.1:3000`
- the effective public frontend path depends on `NEXT_PUBLIC_BASE_PATH`

Examples:

- if `NEXT_PUBLIC_BASE_PATH=` then the frontend is served at `https://competence.nathabee.de/`
- if `NEXT_PUBLIC_BASE_PATH=/evaluation` then the frontend is served at `https://competence.nathabee.de/evaluation/`

This setup assumes:

- Django runs locally on port `8080`
- the frontend runs locally on port `3000`
- Apache is the public reverse proxy
- TLS is handled by Apache with Certbot
- media files are stored under `/var/www/competence_project/media`
- collected static files are stored under `/var/www/competence_project/staticfiles`

---

## DNS in Hetzner

### IPv4

- `A competence -> VPS_IPV4`

### IPv6

- `AAAA competence -> VPS_IPV6`

---

## Hetzner Cloud Firewall

### Inbound allow

- `22/tcp`
- `80/tcp`
- `443/tcp`

### Outbound

Allow all, or at least:

- `53/udp`
- `53/tcp`
- `80/tcp`
- `443/tcp`

---

## Application prerequisites

Before touching Apache, verify the application is really running locally.

### Backend check

```bash
curl -I http://127.0.0.1:8080/api/
curl http://127.0.0.1:8080/api/
````

A JSON answer such as:

```json
{"detail":"Authentication credentials were not provided."}
```

is fine.

### Frontend check

For a frontend served at `/`:

```bash
curl -I http://127.0.0.1:3000/
```

For a frontend served at `/evaluation`:

```bash
curl -I http://127.0.0.1:3000/evaluation/
```

If the frontend is not running yet, Apache can still be configured, but the frontend page will return a proxy error until the frontend service is up.

---

## Django settings

In the repository root `.env`, make sure the public host is allowed.

```env
ALLOWED_HOSTS="competence.nathabee.de,localhost,127.0.0.1"
CORS_ALLOWED_ORIGINS="https://competence.nathabee.de,http://localhost:3000"
```

If needed, also ensure Django trusts the proxy protocol in:

`backend/competence_project/settings.py`

```python
SECURE_PROXY_SSL_HEADER = ("HTTP_X_FORWARDED_PROTO", "https")
USE_X_FORWARDED_HOST = True
```

If you use CSRF-protected admin forms over the public domain, also add:

```python
CSRF_TRUSTED_ORIGINS = ["https://competence.nathabee.de"]
```

---

## Install Apache and Certbot

If Apache is already installed, the install command is harmless.

```bash
sudo apt update
sudo apt install -y apache2 certbot
sudo a2enmod ssl proxy proxy_http proxy_wstunnel headers rewrite alias
sudo systemctl enable --now apache2
sudo apache2ctl configtest
```

---

## Create ACME, media, and staticfiles directories

```bash
sudo mkdir -p /var/www/certbot/.well-known/acme-challenge
sudo mkdir -p /var/www/competence_project/media
sudo mkdir -p /var/www/competence_project/staticfiles
sudo chown -R www-data:www-data /var/www/certbot
sudo chown -R nathabee:www-data /var/www/competence_project
sudo chmod -R 775 /var/www/competence_project
```

Normally, the backend symlinks should be created by the project setup script:

```bash
./tools/setup_environment.sh --apply --ci \
  --project-path /home/nathabee/competence_project \
  --backend-path /home/nathabee/competence_project/backend \
  --project-owner nathabee \
  --project-group www-data \
  --prepare-shared-paths
```

If you need to create or refresh them manually:

```bash
cd /home/nathabee/competence_project
ln -sfn /var/www/competence_project/media backend/media
ln -sfn /var/www/competence_project/staticfiles backend/staticfiles
ls -ld backend/media /var/www/competence_project/media
ls -ld backend/staticfiles /var/www/competence_project/staticfiles
```

---

## HTTP vhost for ACME and redirect

```bash
sudo tee /etc/apache2/sites-available/competence-http.conf >/dev/null <<'APACHE'
<VirtualHost *:80>
    ServerName competence.nathabee.de

    Alias /.well-known/acme-challenge/ /var/www/certbot/.well-known/acme-challenge/
    <Directory "/var/www/certbot/.well-known/acme-challenge/">
        Options None
        AllowOverride None
        Require all granted
    </Directory>

    RewriteEngine On
    RewriteCond %{REQUEST_URI} !^/\.well-known/acme-challenge/
    RewriteRule ^ https://%{HTTP_HOST}%{REQUEST_URI} [R=301,L]

    ErrorLog  ${APACHE_LOG_DIR}/competence-http-error.log
    CustomLog ${APACHE_LOG_DIR}/competence-http-access.log combined
</VirtualHost>
APACHE
```

Enable it:

```bash
sudo a2ensite competence-http.conf
sudo apache2ctl configtest
sudo systemctl reload apache2
```

---

## Request the certificate

```bash
sudo certbot certonly --webroot \
  -w /var/www/certbot \
  -d competence.nathabee.de \
  -m admin@nathabee.de \
  --agree-tos \
  --no-eff-email
```

---

## HTTPS vhost

This setup serves media and static files directly and proxies:

* `/api/` and `/admin/` to Django
* everything else to the frontend service

```bash
sudo tee /etc/apache2/sites-available/competence-ssl.conf >/dev/null <<'APACHE'
<VirtualHost *:443>
    ServerName competence.nathabee.de

    SSLEngine on
    SSLCertificateFile /etc/letsencrypt/live/competence.nathabee.de/fullchain.pem
    SSLCertificateKeyFile /etc/letsencrypt/live/competence.nathabee.de/privkey.pem
    Include /etc/letsencrypt/options-ssl-apache.conf

    ProxyPreserveHost On
    RequestHeader set X-Forwarded-Proto "https"
    RequestHeader set X-Forwarded-Port "443"

    Header always set X-Content-Type-Options "nosniff"
    Header always set X-Frame-Options "SAMEORIGIN"

    RedirectMatch 301 ^/media$ /media/
    RedirectMatch 301 ^/static$ /static/

    ProxyPass /media/ !
    Alias /media/ /var/www/competence_project/media/
    <Directory /var/www/competence_project/media/>
        Options FollowSymLinks
        AllowOverride None
        Require all granted
    </Directory>

    ProxyPass /static/ !
    Alias /static/ /var/www/competence_project/staticfiles/
    <Directory /var/www/competence_project/staticfiles/>
        Options FollowSymLinks
        AllowOverride None
        Require all granted
    </Directory>

    ProxyPass        /api/   http://127.0.0.1:8080/api/   connectiontimeout=5 timeout=60
    ProxyPassReverse /api/   http://127.0.0.1:8080/api/

    ProxyPass        /admin/ http://127.0.0.1:8080/admin/ connectiontimeout=5 timeout=60
    ProxyPassReverse /admin/ http://127.0.0.1:8080/admin/

    ProxyPass        / http://127.0.0.1:3000/ connectiontimeout=5 timeout=60
    ProxyPassReverse / http://127.0.0.1:3000/

    ErrorLog  ${APACHE_LOG_DIR}/competence-ssl-error.log
    CustomLog ${APACHE_LOG_DIR}/competence-ssl-access.log combined
</VirtualHost>
APACHE
```

Enable it:

```bash
sudo a2dissite 000-default.conf 2>/dev/null || true
sudo a2dissite default-ssl.conf 2>/dev/null || true

sudo a2ensite competence-http.conf
sudo a2ensite competence-ssl.conf

sudo apache2ctl configtest
sudo systemctl reload apache2
```

---

## Auto-renew reload hook

```bash
sudo install -d /etc/letsencrypt/renewal-hooks/deploy
sudo tee /etc/letsencrypt/renewal-hooks/deploy/reload-apache.sh >/dev/null <<'SH'
#!/usr/bin/env bash
systemctl reload apache2
SH
sudo chmod +x /etc/letsencrypt/renewal-hooks/deploy/reload-apache.sh
```

---

## Checks

### Apache configuration

```bash
sudo apache2ctl configtest
sudo systemctl status apache2 --no-pager
```

### Public URL checks

```bash
curl -I http://competence.nathabee.de/
curl -I https://competence.nathabee.de/api/
curl -I https://competence.nathabee.de/admin/
curl -I https://competence.nathabee.de/media/
curl -I https://competence.nathabee.de/static/
```

If the frontend uses `NEXT_PUBLIC_BASE_PATH=/evaluation`, also test:

```bash
curl -I https://competence.nathabee.de/evaluation/
```

### Local backend and frontend checks

```bash
curl -I http://127.0.0.1:8080/api/
curl -I http://127.0.0.1:3000/
curl -I http://127.0.0.1:3000/evaluation/ 2>/dev/null || true
```

### Apache logs

```bash
sudo tail -n 100 /var/log/apache2/competence-http-error.log
sudo tail -n 100 /var/log/apache2/competence-ssl-error.log
```

---

## Notes

* If `/api/` works locally but not publicly, check Apache proxy configuration first.
* If `/admin/` loads but login or redirects behave strangely, check `ALLOWED_HOSTS`, `CSRF_TRUSTED_ORIGINS`, and `SECURE_PROXY_SSL_HEADER`.
* If media URLs return `404`, check `/var/www/competence_project/media` and `Alias /media/`.
* If static URLs return `404`, check `/var/www/competence_project/staticfiles` and `Alias /static/`.
* If the frontend page gives `502` or `503`, the frontend process on port `3000` is probably not running yet.
* If the frontend is served under `/evaluation`, test that exact public path instead of only `/`.

---

# Apache reverse proxy for Jenkins

## Target routing

* `https://jenkins.nathabee.de/` -> `http://127.0.0.1:8081/`

This setup assumes:

* Jenkins runs locally on port `8081`
* Apache exposes Jenkins publicly with HTTPS
* port `8081` is not exposed directly on the public firewall

## DNS in Hetzner

### IPv4

* `A jenkins -> VPS_IPV4`

### IPv6

* `AAAA jenkins -> VPS_IPV6`

## Hetzner Cloud Firewall

### Inbound allow

* `22/tcp`
* `80/tcp`
* `443/tcp`

Do not open `8081` publicly.

## Local prerequisite check

Before touching Apache, verify Jenkins is really running locally:

```bash
curl -I http://127.0.0.1:8081/
sudo systemctl status jenkins --no-pager
```

---

## HTTP vhost for Jenkins

```bash
sudo tee /etc/apache2/sites-available/jenkins-http.conf >/dev/null <<'APACHE'
<VirtualHost *:80>
    ServerName jenkins.nathabee.de

    Alias /.well-known/acme-challenge/ /var/www/certbot/.well-known/acme-challenge/
    <Directory "/var/www/certbot/.well-known/acme-challenge/">
        Options None
        AllowOverride None
        Require all granted
    </Directory>

    RewriteEngine On
    RewriteCond %{REQUEST_URI} !^/\.well-known/acme-challenge/
    RewriteRule ^ https://%{HTTP_HOST}%{REQUEST_URI} [R=301,L]

    ErrorLog  ${APACHE_LOG_DIR}/jenkins-http-error.log
    CustomLog ${APACHE_LOG_DIR}/jenkins-http-access.log combined
</VirtualHost>
APACHE
```

Enable it:

```bash
sudo a2ensite jenkins-http.conf
sudo apache2ctl configtest
sudo systemctl reload apache2
```

---

## Request the Jenkins certificate

```bash
sudo certbot certonly --webroot \
  -w /var/www/certbot \
  -d jenkins.nathabee.de \
  -m admin@nathabee.de \
  --agree-tos \
  --no-eff-email
```

---

## HTTPS vhost for Jenkins

```bash
sudo tee /etc/apache2/sites-available/jenkins-ssl.conf >/dev/null <<'APACHE'
<VirtualHost *:443>
    ServerName jenkins.nathabee.de

    SSLEngine on
    SSLCertificateFile /etc/letsencrypt/live/jenkins.nathabee.de/fullchain.pem
    SSLCertificateKeyFile /etc/letsencrypt/live/jenkins.nathabee.de/privkey.pem
    Include /etc/letsencrypt/options-ssl-apache.conf

    ProxyRequests Off
    ProxyPreserveHost On
    AllowEncodedSlashes NoDecode

    RequestHeader set X-Forwarded-Proto "https"
    RequestHeader set X-Forwarded-Port "443"

    Header always set X-Content-Type-Options "nosniff"
    Header always set X-Frame-Options "SAMEORIGIN"

    RewriteEngine On
    RewriteCond %{HTTP:Upgrade} websocket [NC]
    RewriteCond %{HTTP:Connection} upgrade [NC]
    RewriteRule ^/(.*)$ ws://127.0.0.1:8081/$1 [P,L]

    ProxyPass        /  http://127.0.0.1:8081/ nocanon
    ProxyPassReverse /  http://127.0.0.1:8081/

    <Proxy http://127.0.0.1:8081/*>
        Require all granted
    </Proxy>

    ErrorLog  ${APACHE_LOG_DIR}/jenkins-ssl-error.log
    CustomLog ${APACHE_LOG_DIR}/jenkins-ssl-access.log combined
</VirtualHost>
APACHE
```

Enable it:

```bash
sudo a2ensite jenkins-ssl.conf
sudo apache2ctl configtest
sudo systemctl reload apache2
```

---

## Jenkins renew hook

```bash
sudo install -d /etc/letsencrypt/renewal-hooks/deploy
sudo tee /etc/letsencrypt/renewal-hooks/deploy/reload-apache.sh >/dev/null <<'SH'
#!/usr/bin/env bash
systemctl reload apache2
SH
sudo chmod +x /etc/letsencrypt/renewal-hooks/deploy/reload-apache.sh
```

---

## Jenkins checks

```bash
curl -I http://127.0.0.1:8081/
curl -I http://jenkins.nathabee.de/
curl -I https://jenkins.nathabee.de/

sudo apache2ctl configtest
sudo systemctl status apache2 --no-pager
sudo tail -n 100 /var/log/apache2/jenkins-http-error.log
sudo tail -n 100 /var/log/apache2/jenkins-ssl-error.log
```
 
