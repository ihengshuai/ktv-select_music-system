// https://pm2.keymetrics.io/docs/usage/quick-start/

module.exports = {
  apps: [
    {
      name: "ktv-system-v2",
      script: "dist/server/main.js",
      watch: false,
      instance: 2,
      autorestart: true,
      max_memory_restart: "1G",
      env: {
        NODE_ENV: "development",
      },
      env_production: {
        NODE_ENV: "production",
      },
    },
  ],
}
