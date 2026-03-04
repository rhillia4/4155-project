module.exports = {
  apps: [

    // Backend (Django REST API via Gunicorn)
    {
      name: "backend",
      cwd: "/home/ec2-user/backend",
      script: "/home/ec2-user/backend/venv/bin/gunicorn",
      args: "project.wsgi:application --bind 127.0.0.1:8000 --workers 3 --timeout 60 --access-logfile - --error-logfile -",
      interpreter: "none",
      exec_mode: "fork",
      autorestart: true,
      max_memory_restart: "500M",
      env: {
        DJANGO_SETTINGS_MODULE: "project.settings",
        PYTHONUNBUFFERED: "1"
      }
    },

    // Daily cron job (Python script in venv)
    {
      name: "daily-job",
      cwd: "/home/ec2-user/backend",
      script: "/home/ec2-user/backend/venv/bin/python",
      args: "scripts/daily_job.py",
      interpreter: "none",
      cron_restart: "0 22 * * *", // 10 PM daily
      autorestart: false
    },

    // Frontend (React via PM2 using 'serve')
    {
      name: "frontend",
      cwd: "/home/ec2-user/frontend",
      script: "serve",
      args: "-s build -l 3000",
      interpreter: "none",
      autorestart: true
    }

  ]
}