# miguel-website

Personal site with games, tools, and reading links. Built with Vite + React.

## Project structure

```
src/
  pages/
    Home.jsx              landing page
    tools/                React tool pages
public/
  games/                  standalone HTML games
  docs/                   PDF papers
```

## Local dev

```bash
npm install
npm run dev   # Vite on :5173
```

## Deploy to phone (one-liner)

```bash
./deploy.sh
```

This builds the site and transfers it to the phone via scp. Run from Git Bash.

## Phone setup (one-time, already done)

Phone: u0_a269@192.168.1.151, SSH on port 8022.

```bash
# Install nginx and cloudflared
pkg install nginx cloudflared

# nginx config at $PREFIX/etc/nginx/nginx.conf
# serves ~/website/dist on port 8080

# Termux:Boot auto-start at ~/.termux/boot/start.sh
```

nginx config:
```nginx
events {}
http {
  include mime.types;
  server {
    listen 8080;
    root /data/data/com.termux/files/home/website/dist;
    index index.html;
    location / {
      try_files $uri $uri/ /index.html;
    }
  }
}
```

## Cloudflare Tunnel — pending domain approval

eu.org request saved as: `20260412004452-arf-52743`
Domain requested: `miguelors.eu.org`
Tunnel name: `miguelors` (already created in Cloudflare)

Once eu.org approves the domain, complete the setup:

**1. Route the tunnel to the domain:**
```bash
# On the phone
cloudflared tunnel route dns miguelors miguelors.eu.org
```

**2. Create tunnel config on the phone:**
```bash
cat > ~/.cloudflared/config.yml << 'EOF'
tunnel: miguelors
credentials-file: /data/data/com.termux/files/home/.cloudflared/<TUNNEL-ID>.json
ingress:
  - hostname: miguelors.eu.org
    service: http://localhost:8080
  - service: http_status:404
EOF
```
Replace `<TUNNEL-ID>` with the ID printed when you ran `cloudflared tunnel create`.

**3. Add tunnel to Termux:Boot:**
```bash
cat > ~/.termux/boot/start.sh << 'EOF'
#!/data/data/com.termux/files/usr/bin/sh
nginx
cloudflared tunnel run miguelors
EOF
```

**4. Start the tunnel:**
```bash
cloudflared tunnel run miguelors
```

Site will then be live at `https://miguelors.eu.org`.
