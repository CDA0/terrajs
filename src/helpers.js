const camelToKebab = str => str.split(/(?=[A-Z])/).join('-').toLowerCase();
const camelToSnake = str => str.split(/(?=[A-Z])/).join('_').toLowerCase();
const includes = (a, b, opts) => (a.includes(b) ? opts.fn(this) : opts.inverse(this));

module.exports = {
  camelToKebab,
  camelToSnake,
  includes,
};
