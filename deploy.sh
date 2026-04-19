#!/bin/bash
# Deploy to phone — run from Git Bash
# Usage: ./deploy.sh

PHONE="u0_a269@192.168.1.151"
PORT=8022

set -e

echo "Building..."
npm run build

echo "Transferring built files..."
scp -P $PORT dist/index.html "$PHONE:~/website/dist/"
scp -P $PORT -r dist/assets/. "$PHONE:~/website/dist/assets/"
scp -P $PORT dist/papers.json "$PHONE:~/website/dist/"

echo "Syncing PDF.js viewer (once)..."
ssh -p $PORT "$PHONE" "[ -d ~/website/dist/pdfjs ] || mkdir -p ~/website/dist/pdfjs"
ssh -p $PORT "$PHONE" "[ -f ~/website/dist/pdfjs/web/viewer.html ]" || \
  scp -P $PORT -r dist/pdfjs/. "$PHONE:~/website/dist/pdfjs/"

echo "Syncing PDFs (skipping unchanged)..."
uploaded_any=0
for local_file in $(find dist/docs dist/games -name "*.pdf" 2>/dev/null); do
  remote_file="~/website/$local_file"
  local_size=$(wc -c < "$local_file")
  remote_size=$(ssh -p $PORT "$PHONE" "wc -c < $remote_file 2>/dev/null || echo 0")
  if [ "$local_size" != "$remote_size" ]; then
    echo "  Uploading $local_file ($local_size bytes)..."
    remote_dir="~/website/$(dirname $local_file)"
    ssh -p $PORT "$PHONE" "mkdir -p $remote_dir"
    scp -P $PORT "$local_file" "$PHONE:$remote_dir/"
    uploaded_any=1
  else
    echo "  Skipping $local_file (unchanged)"
  fi
done

echo "Linearizing PDFs on phone (fast web view)..."
ssh -p $PORT "$PHONE" 'if ! command -v qpdf >/dev/null; then
  echo "  qpdf not installed on phone — run: pkg install qpdf"
else
  for pdf in ~/website/dist/docs/*.pdf ~/website/dist/games/*.pdf; do
    [ -f "$pdf" ] || continue
    if qpdf --check "$pdf" 2>&1 | grep -q "File is linearized"; then
      continue
    fi
    qpdf --linearize --replace-input "$pdf" 2>/dev/null && echo "  linearized $(basename "$pdf")"
  done
fi'

echo "Reloading nginx..."
ssh -p $PORT "$PHONE" "nginx -s reload"

echo "Restarting Node API..."
ssh -p $PORT "$PHONE" "pkill -f 'node.*api.js' 2>/dev/null; sleep 1; nohup setsid node ~/website/api.js >> ~/website/api.log 2>&1 < /dev/null &" >/dev/null 2>&1

echo "Ensuring cloudflared tunnel is running..."
ssh -p $PORT "$PHONE" "pgrep cloudflared > /dev/null || nohup setsid cloudflared tunnel run lemonworlds >> ~/.cloudflared/tunnel.log 2>&1 < /dev/null &" >/dev/null 2>&1

echo "Done."
