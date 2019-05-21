const Handlebars = require('handlebars');
const { camelToKebab, camelToSnake, includes } = require('./helpers');

module.exports = () => {
  Handlebars.registerHelper('camelToKebab', camelToKebab);
  Handlebars.registerHelper('camelToSnake', camelToSnake);
  Handlebars.registerHelper('includes', includes);
};
