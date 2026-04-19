# lemonworlds-website

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

Builds the site and transfers it to the phone via scp. Run from Git Bash.

## Phone setup (one-time, already done)

Phone: u0_a269@192.168.1.151, SSH on port 8022.
Live at: https://lemonworlds.com and https://www.lemonworlds.com

```bash
pkg install nginx cloudflared
```

nginx config at `$PREFIX/etc/nginx/nginx.conf`, serves `~/website/dist` on port 8080. Long cache headers on static assets let Cloudflare's edge cache PDFs so the phone's uplink isn't the bottleneck on every hit:

```nginx
events {}
http {
  include mime.types;
  server {
    listen 8080;
    root /data/data/com.termux/files/home/website/dist;
    index index.html;
    location ~* \.(pdf|js|css|woff2)$ {
      expires 30d;
      add_header Cache-Control "public, max-age=2592000, immutable";
    }
    location /api/ {
      proxy_pass http://localhost:3000/;
    }
    location / {
      try_files $uri $uri/ /index.html;
    }
  }
}
```

Cloudflare Tunnel config at `~/.cloudflared/config.yml`:

```yaml
tunnel: 62e5bf82-c4c9-4e95-8678-8d65f460c883
credentials-file: /data/data/com.termux/files/home/.cloudflared/62e5bf82-c4c9-4e95-8678-8d65f460c883.json

ingress:
  - hostname: lemonworlds.com
    service: http://localhost:8080
  - hostname: www.lemonworlds.com
    service: http://localhost:8080
  - service: http_status:404
```

Start manually (if not running):
```bash
nginx
cloudflared tunnel run lemonworlds &
```

## Termux:Boot

Auto-starts sshd / nginx / API / tunnel on phone reboot. Without `termux-wake-lock`, Android doze suspends Termux after a while and the tunnel drops — that's the main cause of intermittent 5xx's.

`~/.termux/boot/start.sh`:

```bash
#!/data/data/com.termux/files/usr/bin/sh
termux-wake-lock
sshd
nginx
nohup setsid node ~/website/api.js >> ~/website/api.log 2>&1 < /dev/null &
sleep 5
nohup setsid cloudflared tunnel run lemonworlds >> ~/.cloudflared/tunnel.log 2>&1 < /dev/null &
```

Ensure it's executable: `chmod +x ~/.termux/boot/start.sh`. Requires `pkg install termux-api` for the wake-lock binary.

