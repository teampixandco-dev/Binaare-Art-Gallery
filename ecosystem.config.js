module.exports = {
  apps: [
    {
      name: "binaare",
      script: "server.js",
      instances: 1,
      exec_mode: "fork",
      max_memory_restart: "160M",
      node_args: "--max-old-space-size=128",
      env: {
        NODE_ENV: "production",
        PORT: 3000,
        HOSTNAME: "0.0.0.0",
      },
    },
  ],
};
