#!/bin/bash
# ==============================================================================
# Binaare Art Gallery — PM2 & Next.js Watchdog / Self-Healing Script
# ==============================================================================

export PATH="/home/u890905085/.nvm/versions/node/v24.21.0/bin:/usr/local/bin:/usr/bin:$PATH"
export PM2_HOME="/home/u890905085/.pm2"
export NODE_OPTIONS="--max-old-space-size=256"

APP_DIR="/home/u890905085/domains/binaareartgallery.com/public_html"
TARGET_URL="http://145.79.58.61:3000"
LOCK_FILE="/tmp/binaare_keep_alive.lock"

# Prevent concurrent resurrection attempts
if [ -f "$LOCK_FILE" ]; then
  LOCK_AGE=$(( $(date +%s) - $(stat -c %Y "$LOCK_FILE" 2>/dev/null || echo 0) ))
  if [ "$LOCK_AGE" -lt 60 ]; then
    exit 0
  fi
fi

# Quick check if Next.js HTTP server responds
STATUS=$(curl -s -o /dev/null -w "%{http_code}" -m 2 "$TARGET_URL" 2>/dev/null)

if [ "$STATUS" != "000" ] && [ -n "$STATUS" ]; then
  # Server is healthy and responding
  exit 0
fi

# Server is down, acquire lock
touch "$LOCK_FILE"
echo "[$(date '+%Y-%m-%d %H:%M:%S')] Next.js offline ($STATUS). Restarting via PM2..." >> "$APP_DIR/keep-alive.log"

cd "$APP_DIR" || exit 1

# Try to resurrect or restart
if pm2 describe binaare > /dev/null 2>&1; then
  pm2 restart binaare >> "$APP_DIR/keep-alive.log" 2>&1
else
  pm2 start ecosystem.config.js >> "$APP_DIR/keep-alive.log" 2>&1
fi

pm2 save >> "$APP_DIR/keep-alive.log" 2>&1

rm -f "$LOCK_FILE"
