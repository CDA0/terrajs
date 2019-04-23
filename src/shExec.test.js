/* eslint-disable global-require */
/* eslint-env mocha */
const td = require('testdouble');

describe('shExec', () => {
  let exec;
  let shExec;
  beforeEach(() => {
    exec = td.function();
    td.replace('shelljs', { exec });
    shExec = require('./shExec');
  });

  afterEach(() => {
    td.reset();
  });

  it('should call exec with the correct arguments', () => {
    shExec('test', { cwd: 'cwd' });
    td.verify(exec('test', { cwd: 'cwd' }, td.matchers.isA(Function)));
  });
});
