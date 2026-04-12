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

echo "Syncing PDFs (skipping unchanged)..."
for local_file in $(find dist/docs dist/games -name "*.pdf" 2>/dev/null); do
  remote_file="~/website/$local_file"
  local_size=$(wc -c < "$local_file")
  remote_size=$(ssh -p $PORT "$PHONE" "wc -c < $remote_file 2>/dev/null || echo 0")
  if [ "$local_size" != "$remote_size" ]; then
    echo "  Uploading $local_file ($local_size bytes)..."
    remote_dir="~/website/$(dirname $local_file)"
    ssh -p $PORT "$PHONE" "mkdir -p $remote_dir"
    scp -P $PORT "$local_file" "$PHONE:$remote_dir/"
  else
    echo "  Skipping $local_file (unchanged)"
  fi
done

echo "Reloading nginx..."
ssh -p $PORT "$PHONE" "nginx -s reload"

echo "Done."
