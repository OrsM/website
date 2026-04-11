#!/bin/bash
# Usage: ./deploy.sh <user>@192.168.1.151
# Example: ./deploy.sh u0_a123@192.168.1.151

HOST=${1:-"u0_a123@192.168.1.151"}

set -e

echo "Building..."
npm run build

echo "Transferring to $HOST..."
rsync -avz --delete dist/ "$HOST:~/website/dist/"

echo "Reloading nginx..."
ssh "$HOST" "nginx -s reload"

echo "Done. Site live at http://miguelors.duckdns.org"
