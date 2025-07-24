const { exec } = require("child_process");
module.exports = {
  apps: [
    {
      name: 'glsistema',
      script: 'bun', 
      args: ['start'],
      cwd: './', 
      instances: 1, 
      autorestart: true, 
      exec_mode: 'fork', 
      watch: false, 
      env: {
        NODE_ENV: 'production',
        //PORT: 35813,
      },
    },
  ],

};
