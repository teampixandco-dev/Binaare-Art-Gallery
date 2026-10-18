module.exports = {
  apps: [
    {
      name: "binaare",
      script: "server.js",
      instances: 1,
      exec_mode: "fork",
      max_memory_restart: "500M",
      node_args: "--expose-gc",
      autorestart: true,
      max_restarts: 50,
      min_uptime: "10s",
      restart_delay: 2000,
      env: {
        NODE_ENV: "production",
        PORT: 3000,
        HOSTNAME: "0.0.0.0",
      },
    },
  ],
};
