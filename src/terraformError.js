class TerraformError extends Error {
  constructor(stdout, stderr, ...args) {
    super(...args);
    Error.captureStackTrace(this, TerraformError);
    this.message = 'An error has occurred';
    this.stdout = stdout;
    this.stderr = stderr;
    this.code = 1;
  }
}

module.exports = TerraformError;
