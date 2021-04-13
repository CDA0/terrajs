const Handlebars = require('handlebars');
const {
  camelToKebab,
  camelToSnake,
  includes,
  ifeq,
  ifneq,
  switchHandlebarHelper,
  caseHandlebarHelper,
  defaultHandlebarHelper,
  ifArray,
  ifMajor,
} = require('./helpers');

module.exports = () => {
  Handlebars.registerHelper('camelToKebab', camelToKebab);
  Handlebars.registerHelper('camelToSnake', camelToSnake);
  Handlebars.registerHelper('includes', includes);
  Handlebars.registerHelper('ifeq', ifeq);
  Handlebars.registerHelper('ifneq', ifneq);
  Handlebars.registerHelper('switch', switchHandlebarHelper);
  Handlebars.registerHelper('case', caseHandlebarHelper);
  Handlebars.registerHelper('default', defaultHandlebarHelper);
  Handlebars.registerHelper('ifArray', ifArray);
  Handlebars.registerHelper('ifMajor', ifMajor);
};
