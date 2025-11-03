module.exports = {
  apps: [
    {
      name: 'crm-backend',
      script: 'server.js',
      instances: 1,
      exec_mode: 'fork',
      env: {
        NODE_ENV: 'development',
        PORT: 2000
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: 2000
      }
    }
  ]
};
