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
