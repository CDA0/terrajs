const Handlebars = require('handlebars');

module.exports = () => {
  Handlebars.registerHelper('camelToKebeb', str => str.split(/(?=[A-Z])/).join('-').toLowerCase());
  Handlebars.registerHelper('camelToSnake', str => str.split(/(?=[A-Z])/).join('_').toLowerCase());
  Handlebars.registerHelper('includes', (a, b, opts) => (a.includes(b)
    ? opts.fn(this)
    : opts.inverse(this)));
};
