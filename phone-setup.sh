#!/bin/bash
# Run from Git Bash on Windows

PHONE="u0_a269@192.168.1.151"
PORT=8022

# Set up Termux:Boot auto-start
ssh -p $PORT $PHONE "mkdir -p ~/.termux/boot && cat > ~/.termux/boot/start.sh && chmod +x ~/.termux/boot/start.sh" << 'EOF'
#!/data/data/com.termux/files/usr/bin/sh
nginx
EOF
