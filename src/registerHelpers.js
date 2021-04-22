const Handlebars = require('handlebars');
const {
  camelToKebab,
  camelToSnake,
  ifVersionSatisfies,
  includes,
  parseVariable,
} = require('./helpers');

module.exports = () => {
  Handlebars.registerHelper('camelToKebab', camelToKebab);
  Handlebars.registerHelper('camelToSnake', camelToSnake);
  Handlebars.registerHelper('ifVersionSatisfies', ifVersionSatisfies);
  Handlebars.registerHelper('includes', includes);
  Handlebars.registerHelper('parseVariable', parseVariable);
};
