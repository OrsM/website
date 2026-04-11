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
server/
  proxy.js               Anthropic API proxy (Express)
```

## Local dev

```bash
# Install deps
npm install

# Start Vite dev server (port 5173)
npm run dev

# Start API proxy (port 3001) — needed for the Quiz tool
node server/proxy.js
```

The Vite dev server proxies `/api/*` → `localhost:3001`.

## API proxy setup

Create `server/.env` (never commit this):
```
ANTHROPIC_API_KEY=sk-ant-...
```

## Build

```bash
npm run build   # outputs to dist/
```

## Deploy to Android (Termux)

```bash
# Transfer build and proxy
scp -r dist/ <user>@<phone-ip>:~/website/
scp server/proxy.js <user>@<phone-ip>:~/server/

# On phone — install deps
pkg install nginx nodejs
cd ~/server && npm install express http-proxy-middleware dotenv

# Create .env on phone (do NOT transfer it)
echo "ANTHROPIC_API_KEY=sk-ant-..." > ~/server/.env

# Start services
node ~/server/proxy.js &
nginx
```

Configure nginx to serve `~/website/dist` on port 8080 and proxy `/api/*` → `localhost:3001`.

DuckDNS auto-update (add to cron or boot script):
```bash
curl "https://www.duckdns.org/update?domains=<your-domain>&token=<your-token>&ip="
```
