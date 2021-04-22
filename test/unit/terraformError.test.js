/* eslint-disable global-require */
/* eslint-env mocha */
const assert = require('assert');
const td = require('testdouble');

describe('terraformError', () => {
  let sut;
  let TerraformError;

  beforeEach(() => {
    TerraformError = require('../../src/terraformError');
  });

  afterEach(() => td.reset());

  it('should create an instance with default values', () => {
    sut = new TerraformError('stdout', 'stderr');
    assert.equal(sut.stdout, 'stdout');
    assert.equal(sut.stderr, 'stderr');
    assert.equal(sut.message, 'An error has occurred');
    assert.equal(sut.code, 1);
  });
});
