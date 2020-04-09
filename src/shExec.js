const { exec } = require('shelljs');
const TerraformDiffError = require('./terraformDiffError');
const TerraformError = require('./terraformError');

module.exports = (cmd, options) => new Promise((resolve, reject) => {
  exec(cmd, options, (code, stdout, stderr) => {
    switch (code) {
      case 0:
        return resolve(stdout);
      case 2:
        return reject(new TerraformDiffError(stdout, stderr));
      default:
        return reject(new TerraformError(stdout, stderr));
    }
  });
});
