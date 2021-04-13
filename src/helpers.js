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

function ifMajor(v1, v2, opts) {
  return (Number(v1) > Number(v2)) ? opts.fn(this) : opts.inverse(this);
}

module.exports = {
  camelToKebab,
  camelToSnake,
  includes,
  ifeq,
  ifneq,
  ifArray,
  ifVersionSatisfies,
};
