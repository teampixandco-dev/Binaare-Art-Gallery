#!/bin/bash
# ==============================================================================
# Binaare Art Gallery — 1-Click Server Rescue & Health Recovery Script
# ==============================================================================

echo "=== [1/5] Terminating any hung or orphaned Node processes ==="
pkill -9 -f 'server.js' 2>/dev/null || true
pkill -9 -f 'node ' 2>/dev/null || true

echo "=== [2/5] Cleaning up stale locks & throttling markers ==="
rm -f /tmp/binaare_keep_alive.lock /tmp/binaare_self_heal.throttle

echo "=== [3/5] Resetting PM2 daemon and clearing state ==="
npx pm2 delete all 2>/dev/null || true
npx pm2 kill 2>/dev/null || true

echo "=== [4/5] Starting application via PM2 (768M heap limit) ==="
cd "$(dirname "$0")/.."
npx pm2 start ecosystem.config.js
npx pm2 save

echo "=== [5/5] Waiting for Next.js initialization (6s) ==="
sleep 6

TARGET_IP="145.79.58.61"
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" -m 5 "http://$TARGET_IP:3000" 2>/dev/null || echo "000")

if [ "$HTTP_CODE" = "200" ] || [ "$HTTP_CODE" = "304" ] || [ "$HTTP_CODE" = "307" ] || [ "$HTTP_CODE" = "308" ]; then
    echo "✓ [SUCCESS] Next.js is healthy and responding (HTTP $HTTP_CODE)!"
else
    echo "⚠️  Initial check returned $HTTP_CODE. Retrying in 4s..."
    sleep 4
    HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" -m 5 "http://$TARGET_IP:3000" 2>/dev/null || echo "000")
    echo "Final check: HTTP $HTTP_CODE"
fi

echo ""
npx pm2 list
echo ""
echo "=== Rescue Complete! Website is active at https://binaareartgallery.com ==="
