/* eslint-disable global-require */
/* eslint-env mocha */
const td = require('testdouble');

describe('registerHelpers', () => {
  let registerHelper;
  let registerHelpers;
  beforeEach(() => {
    registerHelper = td.function();
    td.replace('handlebars', { registerHelper });
    registerHelpers = require('../../src/registerHelpers');
  });

  afterEach(() => {
    td.reset();
  });

  it('should call exec with the correct arguments', () => {
    registerHelpers();
    td.verify(registerHelper(td.matchers.isA(String), td.matchers.isA(Function)), { times: 8 });
  });
});
