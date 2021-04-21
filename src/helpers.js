const semver = require('semver');

const camelToKebab = (str) => str.split(/(?=[A-Z])/).join('-').toLowerCase();
const camelToSnake = (str) => str.split(/(?=[A-Z])/).join('_').toLowerCase();
const includes = (a, b, opts) => (a.includes(b) ? opts.fn(this) : opts.inverse(this));

function ifeq(a, b, opts) {
  return (a === b) ? opts.fn(this) : opts.inverse(this);
}

function ifneq(a, b, opts) {
  return (a !== b) ? opts.fn(this) : opts.inverse(this);
}

function ifArray(value, opts) {
  return (value instanceof Array) ? opts.fn(this) : opts.inverse(this);
}

function ifVersionSatisfies(version, range, opts) {
  return (semver.satisfies(version, range)) ? opts.fn(this) : opts.inverse(this);
}

function parseVariable(key, value) {
  const parsedKey = camelToSnake(key);
  const parsedValue = JSON.stringify(value, null, 0);

  if (typeof value === 'object') {
    if (process.platform === 'win32') {
      if (!process.env.ComSpec.endsWith('cmd.exe')) {
        // Changing ComSpec is ill-advised, so it's unlikely that we'll need to handle other cases.
        // If we ever do wish to support PowerShell, then see this issue:
        // https://github.com/hashicorp/terraform/issues/17032#issuecomment-355168162
        throw Error('Currently Terrajs only supports using "cmd.exe" as the "%ComSpec%" value');
      }

      // For "cmd.exe" everything needs to be enclosed in double-quotes.
      // We then need to escape any additional double-quotes that we find,
      // and escape any double-quotes that were already escaped.
      return `"${parsedKey}=${parsedValue.replace(/"/g, '\\"').replace(/\\\\"/g, '\\\\\\"')}"`;
    }

    // Single-quotes can prematurely close the string, so they need to be escaped.
    return `'${parsedKey}=${parsedValue.replace(/'/g, '\\\'')}'`;
  }

  if (typeof value === 'boolean') {
    return `"${parsedKey}=${value}"`;
  }

  // Double-quotes can prematurely close the string, so they need to be escaped.
  return `"${parsedKey}=${value.replace(/"/g, '\\"')}"`;
}

module.exports = {
  camelToKebab,
  camelToSnake,
  ifArray,
  ifeq,
  ifneq,
  ifVersionSatisfies,
  includes,
  parseVariable,
};
