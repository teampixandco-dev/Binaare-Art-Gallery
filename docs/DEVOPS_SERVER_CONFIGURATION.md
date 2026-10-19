# DevOps Server Configuration & Operations Guide
**Project:** Binaare Art Gallery  
**Target Environment:** Hostinger Cloud / Shared Hosting (CloudLinux / CageFS)  
**Document Version:** 1.0.0  
**Date:** October 2026  
**Status:** Production Ready  

---

## 1. Executive Summary & Architecture Overview

Binaare Art Gallery is a high-performance Next.js 15 application running on Node.js 24 with SQLite WAL (`node:sqlite`). Because the current production host is a **Hostinger CloudLinux shared environment** rather than a root VPS, the application operates under an **Apache + PHP 8.3 reverse proxy bridge** supervised by **PM2**.

```
[ Visitor / CDN (Port 443 HTTPS) ]
              │
              ▼
[ Apache Web Server (.htaccess) ]
              │
       ┌──────┴────────────────────────┐
       │ (Static Asset Check)          │ (Dynamic Request)
       ▼                               ▼
[ Direct Disk Serving ]         [ index.php Proxy Bridge ]
- /_next/static/*                      │  (Timeout: 30s, ConnectTimeout: 2s)
- /media/* (data/uploads)              ▼
                           [ Node.js Next.js Server ]
                           - Bound to: 145.79.58.61:3000
                           - Managed by: PM2 fork mode
                           - Memory Heap: --max-old-space-size=768
                           - Max Restart Threshold: 1G
```

---

## 2. Critical CloudLinux Environment Quirks

### 2.1. Loopback Address & Network Namespace (`145.79.58.61`)
* **Do NOT change backend host to `127.0.0.1` or `localhost`.**
* Under Hostinger's CloudLinux network namespace isolation, each hosting user is assigned a dedicated IP alias on the loopback (`lo`) interface (in this account: `145.79.58.61`).
* Standard loopback (`127.0.0.1`) connection attempts are intercepted by CloudLinux firewall rules to prevent cross-account socket snooping.
* **Production Rule:** Both `index.php` and `scripts/keep-alive.sh` **must target `http://145.79.58.61:3000`**.

### 2.2. V8 Memory Heap Requirements
* Next.js 15 pre-renders pages and compiles runtime route trees during boot, requiring **~150MB–200MB RSS** at startup.
* Artificially restricting V8 heap (`--max-old-space-size`) below 512MB causes V8 scavenge GC to fail with:
  `FATAL ERROR: MarkCompactCollector: young object promotion failed Allocation failed - JavaScript heap out of memory`
* **Production Rule:** `ecosystem.config.js` must specify:
  ```javascript
  node_args: "--max-old-space-size=768",
  max_memory_restart: "1G",
  ```

### 2.3. Anti-Cascade & Cooldown Throttling
* `index.php` uses a connection timeout of **2 seconds** (`CURLOPT_CONNECTTIMEOUT = 2`) so that dead backend sockets do not exhaust Apache/PHP-FPM worker pools.
* Self-healing watchdog triggers are strictly rate-limited using `/tmp/binaare_self_heal.throttle` and `/tmp/binaare_keep_alive.lock` with a **60-second minimum cooldown**.
* The 503 fallback recovery page uses `<meta http-equiv="refresh" content="8">` to give Node.js sufficient time to complete initialization before subsequent requests hit the port.

---

## 3. Server-Side Specifications & Resource Limits

DevOps should verify the following resource allocations in **hPanel / CloudLinux LVE Manager**:

| Resource | Recommended Minimum | Configured Setting | Notes |
| :--- | :--- | :--- | :--- |
| **Physical Memory (PMEM)** | 1024 MB (1 GB) | 1536 MB – 2048 MB | Prevents kernel OOM-killer termination |
| **Virtual Memory (VMEM)** | Unlimited / 2 GB | Unlimited | Avoids swap thrashing |
| **CPU Allocation** | 100% (1 Core) | 100% – 200% | Ensures Next.js boots in < 4 seconds |
| **Entry Processes (EP)** | 20 | 30 | Prevents 508 Resource Limit Reached errors |
| **Number of Processes (NPROC)** | 60 | 100 | Allows Apache, PHP-FPM, and Node.js threads |
| **I/O Usage** | 10 MB/s | 20 MB/s+ | Needed during static build extraction |
| **Node.js Version** | >= 22.18.0 | v24.21.0 | Required for native `node:sqlite` DatabaseSync |
| **PHP Version** | >= 8.2 | 8.3 (cURL, OPcache enabled) | Fast reverse proxying |

---

## 4. PM2 Process Management Specification

The application process must always be supervised using `ecosystem.config.js`:

```javascript
// ecosystem.config.js
module.exports = {
  apps: [
    {
      name: "binaare",
      script: "server.js",
      instances: 1,
      exec_mode: "fork",
      autorestart: true,
      max_restarts: 30,
      min_uptime: "10s",
      restart_delay: 5000,
      kill_timeout: 5000,
      listen_timeout: 8000,
      max_memory_restart: "1G",
      node_args: "--max-old-space-size=768",
      env: {
        NODE_ENV: "production",
        PORT: 3000,
        HOSTNAME: "0.0.0.0",
      },
    },
  ],
};
```

### Critical Operational Rules for PM2
1. **Never run `pm2 restart <name>` after file edits.** `pm2 restart` retains cached V8 flags and stale PID handles in daemon memory, leading to `[PM2][ERROR] Process with pid already exists`.
2. **Always perform a clean reset:**
   ```bash
   npx pm2 delete all
   npx pm2 start ecosystem.config.js
   npx pm2 save
   ```

---

## 5. Automated Watchdog & Cron Job Setup

To ensure zero-downtime self-healing across server reboots and CloudLinux process recycling, verify the following cron entry in `crontab -e`:

```bash
# Run keep-alive watchdog every 2 minutes
*/2 * * * * /bin/bash /home/u890905085/domains/binaareartgallery.com/public_html/scripts/keep-alive.sh > /dev/null 2>&1
```

### Watchdog Logic (`scripts/keep-alive.sh`):
1. Verifies if `/tmp/binaare_keep_alive.lock` is less than 60 seconds old; if so, exits immediately (cooldown protection).
2. Sends a 3-second cURL probe to `http://145.79.58.61:3000`.
3. If HTTP code is `000` (offline), sets the cooldown lock and triggers PM2 restart/start.
4. Saves state with `pm2 save`.

---

## 6. One-Click Emergency Rescue Runbook

If the site ever encounters an incident (`503 Service Unavailable`, PM2 restart loop, or high server load), DevOps can execute the pre-packaged 1-click rescue script:

```bash
cd ~/domains/binaareartgallery.com/public_html
npm run rescue
```
*(Alternative direct execution: `bash scripts/rescue.sh`)*

### Actions Performed by `npm run rescue`:
1. `pkill -9 -f 'server.js'` and `pkill -9 -f 'node '` to release port 3000 immediately.
2. Removes `/tmp/binaare_keep_alive.lock` and `/tmp/binaare_self_heal.throttle`.
3. Calls `npx pm2 delete all` and `npx pm2 kill` to purge desynchronized daemon state.
4. Spawns a clean PM2 instance with `--max-old-space-size=768`.
5. Waits 6 seconds for Next.js route initialization.
6. Probes `http://145.79.58.61:3000` and displays the live health status table.

---

## 7. Future Architecture: Transitioning to Root VPS (Docker)

If traffic scales significantly or full container isolation is desired, the codebase already includes production-ready Docker infrastructure:

* **Files included in repository:**
  - `Dockerfile` (Multi-stage Next.js standalone build)
  - `docker-compose.yml` (Next.js container + persistent SQLite & uploads volumes)
  - `Caddyfile` (Automatic Let's Encrypt SSL reverse proxy)
  - `scripts/deploy-vps.sh` (Automated 1-click Docker deployment)

### Why Docker Cannot Run on Current Host:
Hostinger Shared/Cloud Web Hosting (`in-mum2-web2215`) restricts unprivileged users from kernel-level container virtualization (`docker: command not found`). Moving to Docker requires a **Hostinger KVM VPS Plan** with Ubuntu 24.04 LTS and root access.

---

## 8. Verification & Health Monitoring Commands

DevOps engineers can verify live application status with the following diagnostic commands via SSH:

```bash
# 1. Check HTTP response directly from internal listener
curl -I http://145.79.58.61:3000

# 2. Check public HTTPS edge response
curl -I https://binaareartgallery.com

# 3. Check active PM2 process health, uptime, and memory consumption
npx pm2 list

# 4. View real-time application logs
npx pm2 logs binaare --lines 30 --nostream

# 5. Check system load average
uptime
```
