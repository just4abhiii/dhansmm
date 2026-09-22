// PM2 ecosystem config template for DhanSMM API server
module.exports = {
  apps: [
    {
      name: "dhansmm-api",
      script: "node",
      args: "--enable-source-maps dist/index.mjs",
      cwd: "/var/www/dhansmm/backend",

      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: "512M",

      // Logs
      out_file: "/var/log/dhansmm/api-out.log",
      error_file: "/var/log/dhansmm/api-err.log",
      log_date_format: "YYYY-MM-DD HH:mm:ss",
      merge_logs: true,

      // Graceful restart
      kill_timeout: 5000,
      listen_timeout: 10000,

      env: {
        NODE_ENV: "production",
        PORT: "8080",
        DATABASE_URL: "postgresql://username:password@localhost:5432/dhansmm",
        SESSION_SECRET: "YOUR_SESSION_SECRET",
        SUPABASE_PROJECT_URL: "https://your-project.supabase.co",
        SUPABASE_ANON_KEY: "YOUR_SUPABASE_ANON_KEY",
        SUPABASE_SERVICE_ROLE_KEY: "YOUR_SUPABASE_SERVICE_ROLE_KEY",
        TELEGRAM_BOT_TOKEN: "YOUR_TELEGRAM_BOT_TOKEN",
        TELEGRAM_ADMIN_CHAT_ID: "YOUR_ADMIN_CHAT_ID",
        ZAPUPI_API_KEY: "YOUR_ZAPUPI_API_KEY",
      },
    },
  ],
};
