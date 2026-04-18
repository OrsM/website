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

Builds the site and transfers it to the phone via scp. Run from Git Bash.

## Phone setup (one-time, already done)

Phone: u0_a269@192.168.1.151, SSH on port 8022.
Live at: https://miguelors.com and https://www.miguelors.com

```bash
pkg install nginx cloudflared
```

nginx config at `$PREFIX/etc/nginx/nginx.conf`, serves `~/website/dist` on port 8080:

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

Cloudflare Tunnel config at `~/.cloudflared/config.yml`:

```yaml
tunnel: 62e5bf82-c4c9-4e95-8678-8d65f460c883
credentials-file: /data/data/com.termux/files/home/.cloudflared/62e5bf82-c4c9-4e95-8678-8d65f460c883.json

ingress:
  - hostname: miguelors.com
    service: http://localhost:8080
  - hostname: www.miguelors.com
    service: http://localhost:8080
  - service: http_status:404
```

Start manually (if not running):
```bash
nginx
cloudflared tunnel run miguelors &
```

## Termux:Boot (TODO — high priority)

Without this, sshd/nginx/cloudflared all die on phone reboot or when Termux is killed.
Symptoms: `deploy.sh` times out on SSH, site goes down, can't redeploy without opening Termux manually.

Install the Termux:Boot app from F-Droid, then create `~/.termux/boot/start.sh`:

```bash
#!/data/data/com.termux/files/usr/bin/sh
sshd
nginx
cloudflared tunnel run miguelors
```

This auto-starts sshd + nginx + tunnel on phone reboot.

## TODO

### PDF viewer
- [ ] Add annotation support — highlights and notes stored on the phone's Node API (groundwork explored, shelved for now)
- [ ] Style the PDF.js viewer to match the site theme (toolbar colours, fonts)
- [ ] Add a back button inside the PDF.js viewer that returns to the home page
- [ ] Test text selection on iOS Safari

### Infrastructure
- [ ] Install Termux:Boot app so nginx + tunnel auto-start on reboot

### Deploy
- [ ] `deploy.sh` currently only runs from Git Bash — make it work from PowerShell or add a `.ps1` equivalent

### Site
- [ ] Add content to the home page (bio, description)
- [ ] Make the PDF reading list dynamic (JSON file) so new papers can be added without touching JSX
