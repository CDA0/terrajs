class TerraformDiffError extends Error {
  constructor(stdout, stderr, ...args) {
    super(...args);
    Error.captureStackTrace(this, TerraformDiffError);
    this.message = 'A change was detected';
    this.stdout = stdout;
    this.stderr = stderr;
    this.code = 2;
  }
}

module.exports = TerraformDiffError;
