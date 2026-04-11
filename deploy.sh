#!/bin/bash
# Deploy to phone — run from Git Bash
# Usage: ./deploy.sh

PHONE="u0_a269@192.168.1.151"
PORT=8022

set -e

echo "Building..."
npm run build

echo "Transferring to phone..."
scp -P $PORT -r dist/. "$PHONE:~/website/dist/"

echo "Reloading nginx..."
ssh -p $PORT "$PHONE" "nginx -s reload"

echo "Done."
