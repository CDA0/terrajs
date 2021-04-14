/* eslint-disable global-require */
/* eslint-env mocha */
const assert = require('assert');
const td = require('testdouble');

describe('terraformDiffError', () => {
  let sut;
  let TerraformDiffError;

  beforeEach(() => {
    TerraformDiffError = require('../../src/terraformDiffError');
  });

  afterEach(() => td.reset());

  it('should create an instance with default values', () => {
    sut = new TerraformDiffError('stdout', 'stderr');
    assert.equal(sut.stdout, 'stdout');
    assert.equal(sut.stderr, 'stderr');
    assert.equal(sut.message, 'A change was detected');
    assert.equal(sut.code, 2);
  });
});
