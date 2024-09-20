
## before all
configure you server to open port 3000, TCP to input traffic
configure apache proxy  
    # Proxy requests to Next.js
    ProxyPass "/competenceapp" "http://localhost:3000/"
    ProxyPassReverse "/competenceapp" "http://localhost:3000/"
  

    # Serve static files from /competenceapp/_next/static
    Alias /competenceapp/_next/static /var/www/html/competenceapp/.next/static
    <Directory /var/www/html/competenceapp/.next/static>
        Require all granted
    </Directory>
    
    # Serve other static assets (e.g., images, CSS)
    Alias /competenceapp/static /var/www/html/competenceapp/static
    <Directory /var/www/html/competenceapp/static>
        Require all granted
    </Directory>


## Getting Started
create a .env.local with NEXT_PUBLIC_API_URL
The prefix NEXT_PUBLIC_ is required for environment variables that need to be exposed to the client side 
NEXT_PUBLIC_API_URL=http://localhost:8000/api


npm install
npm run build
node .next/standalone/server.js -H 0.0.0.0




## 
This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).
