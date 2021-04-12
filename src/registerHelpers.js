const Handlebars = require('handlebars');
const {
  camelToKebab,
  camelToSnake,
  ifArray,
  ifeq,
  ifneq,
  ifVersionSatisfies,
  includes,
  parseVariable,
} = require('./helpers');

module.exports = () => {
  Handlebars.registerHelper('camelToKebab', camelToKebab);
  Handlebars.registerHelper('camelToSnake', camelToSnake);
  Handlebars.registerHelper('ifArray', ifArray);
  Handlebars.registerHelper('ifeq', ifeq);
  Handlebars.registerHelper('ifneq', ifneq);
  Handlebars.registerHelper('ifVersionSatisfies', ifVersionSatisfies);
  Handlebars.registerHelper('includes', includes);
  Handlebars.registerHelper('parseVariable', parseVariable);
};
