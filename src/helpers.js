const camelToKebab = str => str.split(/(?=[A-Z])/).join('-').toLowerCase();
const camelToSnake = str => str.split(/(?=[A-Z])/).join('_').toLowerCase();
const includes = (a, b, opts) => (a.includes(b) ? opts.fn(this) : opts.inverse(this));

function ifeq(a, b, opts) {
  return (a === b) ? opts.fn(this) : opts.inverse(this);
}

function ifneq(a, b, opts) {
  return (a !== b) ? opts.fn(this) : opts.inverse(this);
}

function switchHandlebarHelper(value, opts) {
  this.switch_value = value;
  this.switch_break = false;
  return opts.fn(this);
}

function caseHandlebarHelper() {
  /* eslint-disable-next-line prefer-rest-params */
  const args = Array.prototype.slice.call(arguments);
  const opts = args.pop();
  const caseValues = args;

  if (this.switch_break || caseValues.indexOf(this.switch_value) === -1) {
    return '';
  }

  if (opts.hash.break === true) {
    this.switch_break = true;
  }

  return opts.fn(this);
}

function defaultHandlebarHelper(opts) {
  return (!this.switch_break ? opts.fn(this) : '');
}

module.exports = {
  camelToKebab,
  camelToSnake,
  includes,
  ifeq,
  ifneq,
  switchHandlebarHelper,
  caseHandlebarHelper,
  defaultHandlebarHelper,
};
