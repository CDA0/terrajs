const { exec } = require('shelljs');

module.exports = (cmd, options) => new Promise((resolve, reject) => {
  exec(cmd, options, (code, stdout, stderr) => (code === 0 ? resolve(stdout) : reject(stderr)));
});
