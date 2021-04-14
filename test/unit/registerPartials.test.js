/* eslint-disable global-require */
/* eslint-env mocha */
const td = require('testdouble');

describe('registerPartials', () => {
  let registerPartial;
  let registerPartials;

  beforeEach(() => {
    registerPartial = td.function();
    const readdirSync = td.function();
    const readFileSync = td.function();
    td.when(readdirSync(td.matchers.isA(String))).thenReturn(['./test/filename.hbs']);
    td.when(readFileSync(td.matchers.isA(String), 'utf-8')).thenReturn('{{template}}');
    td.replace('handlebars', { registerPartial });
    td.replace('fs', { readdirSync, readFileSync });
    registerPartials = require('../../src/registerPartials');
  });

  afterEach(() => {
    td.reset();
  });

  it('should call exec with the correct arguments', () => {
    registerPartials();
    td.verify(registerPartial('filename', '{{template}}'));
  });
});
