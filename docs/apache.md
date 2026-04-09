# Apache + HTTPS for `competence.nathabee.de`

## target urls

- `https://competence.nathabee.de/` -> `127.0.0.1:3000`
- `https://competence.nathabee.de/api/` -> `127.0.0.1:8080/api/`
- `https://competence.nathabee.de/admin/` -> `127.0.0.1:8080/admin/`
- `https://competence.nathabee.de/media/` -> `/var/www/competence_project/media/`

This setup assumes:

- Django runs locally on port `8080`
- the frontend runs locally on port `3000`
- Apache is the public reverse proxy
- TLS is handled by Apache with Certbot
- media files are stored under `/var/www/competence_project/media`

---

## DNS in Hetzner

### IPv4
- `A  competence  -> VPS_IPV4`

### IPv6
- `AAAA  competence  -> VPS_IPV6`

---

## Hetzner Cloud Firewall

### inbound allow
- `22/tcp`
- `80/tcp`
- `443/tcp`

### outbound
- allow all  
  or at least:
  - `53/udp`
  - `53/tcp`
  - `80/tcp`
  - `443/tcp`

---

## app prerequisites

Before touching Apache, verify the application is really running locally.

### backend check

```bash
curl -I http://127.0.0.1:8080/api/
curl http://127.0.0.1:8080/api/
````

A JSON answer like `{"detail":"Authentication credentials were not provided."}` is fine.

### frontend check

```bash
curl -I http://127.0.0.1:3000/
```

If the frontend is not running yet, Apache can still be configured, but the root page will return a proxy error until the frontend service is up.

---

## Django settings

In `.env`, make sure the public host is allowed.

```env
ALLOWED_HOSTS="competence.nathabee.de,localhost,127.0.0.1"
CORS_ALLOWED_ORIGINS="https://competence.nathabee.de,http://localhost:3000"
```

If needed, also ensure Django trusts the proxy protocol in `competence_project/settings.py`:

```python
SECURE_PROXY_SSL_HEADER = ("HTTP_X_FORWARDED_PROTO", "https")
USE_X_FORWARDED_HOST = True
```

If you use CSRF-protected admin forms over the public domain, also add:

```python
CSRF_TRUSTED_ORIGINS = ["https://competence.nathabee.de"]
```

---

## install apache + certbot

If Apache is already installed, the install command is harmless.

```bash
sudo apt update
sudo apt install -y apache2 certbot
sudo a2enmod ssl proxy proxy_http headers rewrite alias
sudo systemctl enable --now apache2
sudo apache2ctl configtest
```

---

## create media and ACME directories

```bash
sudo mkdir -p /var/www/certbot/.well-known/acme-challenge
sudo mkdir -p /var/www/competence_project/media
sudo chown -R www-data:www-data /var/www/certbot
sudo chown -R nathabee:www-data /var/www/competence_project
sudo chmod -R 775 /var/www/competence_project
```

If the project uses a symlink from the repo to the real media directory:

```bash
cd /home/nathabee/competence_project

if [ -e media ] && [ ! -L media ]; then
    mv media media.bak
fi

ln -s /var/www/competence_project/media media
ls -ld media /var/www/competence_project/media
```

---

## HTTP vhost for ACME + redirect

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

## request the certificate

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

This setup serves media directly and proxies:

* `/api/` and `/admin/` to Django
* everything else to the frontend

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

## auto-renew reload hook

```bash
sudo install -d /etc/letsencrypt/renewal-hooks/deploy
sudo tee /etc/letsencrypt/renewal-hooks/deploy/reload-apache.sh >/dev/null <<'SH'
#!/usr/bin/env bash
systemctl reload apache2
SH
sudo chmod +x /etc/letsencrypt/renewal-hooks/deploy/reload-apache.sh
```

---

## checks

### apache config

```bash
sudo apache2ctl configtest
sudo systemctl status apache2 --no-pager
```

### public URL checks

```bash
curl -I http://competence.nathabee.de/
curl -I https://competence.nathabee.de/
curl -I https://competence.nathabee.de/api/
curl -I https://competence.nathabee.de/admin/
curl -I https://competence.nathabee.de/media/
```

### local backend/frontend checks

```bash
curl -I http://127.0.0.1:8080/api/
curl -I http://127.0.0.1:3000/
```

### apache logs

```bash
sudo tail -n 100 /var/log/apache2/competence-http-error.log
sudo tail -n 100 /var/log/apache2/competence-ssl-error.log
```

---

## notes

* If `/api/` works locally but not publicly, check Apache proxy config first.
* If `/admin/` loads but login or redirects behave strangely, check `ALLOWED_HOSTS`, `CSRF_TRUSTED_ORIGINS`, and `SECURE_PROXY_SSL_HEADER`.
* If media URLs 404, check the `/var/www/competence_project/media` path and the Apache `Alias /media/`.
* If the root page gives `502` or `503`, the frontend process on port `3000` is likely not running yet.
 