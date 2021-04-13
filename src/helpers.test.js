/* eslint-disable global-require */
/* eslint-env mocha */
const assert = require('assert');
const td = require('testdouble');
const {
  camelToKebab,
  camelToSnake,
  includes,
  ifeq,
  ifneq,
  ifMajor,
} = require('./helpers');

describe('helpers', () => {
  describe('camelToKebab', () => {
    it('should convert a camel cased string to kebab case', () => {
      const response = camelToKebab('kebabCase');
      assert.equal(response, 'kebab-case');
    });
  });

  describe('camelToSnake', () => {
    it('should convert a camel cased string to snake case', () => {
      const response = camelToSnake('snakeCase');
      assert.equal(response, 'snake_case');
    });
  });

  describe('includes', () => {
    const opts = {};
    beforeEach(() => {
      opts.fn = td.function();
      opts.inverse = td.function();
    });

    afterEach(() => td.reset());

    it('should call fn function if a includes b', () => {
      includes(['a', 'b'], 'a', opts);
      td.verify(opts.fn(td.matchers.isA(Object)), { times: 1 });
    });

    it('should call inverse function if a includes b', () => {
      includes(['a', 'b'], 'c', opts);
      td.verify(opts.inverse(td.matchers.isA(Object)), { times: 1 });
    });
  });

  describe('ifeq', () => {
    const opts = {};
    beforeEach(() => {
      opts.fn = td.function();
      opts.inverse = td.function();
    });

    afterEach(() => td.reset());

    it('should call fn function if values match', () => {
      ifeq('a', 'a', opts);
      td.verify(opts.fn(td.matchers.isA(Object)), { times: 1 });
    });

    it('should call inverse function if values do not match', () => {
      ifeq('a', 'b', opts);
      td.verify(opts.inverse(td.matchers.isA(Object)), { times: 1 });
    });
  });

  describe('ifneq', () => {
    const opts = {};
    beforeEach(() => {
      opts.fn = td.function();
      opts.inverse = td.function();
    });

    afterEach(() => td.reset());

    it('should call fn function if values do not match', () => {
      ifneq('a', 'b', opts);
      td.verify(opts.fn(td.matchers.isA(Object)), { times: 1 });
    });

    it('should call inverse function if values match', () => {
      ifneq('a', 'a', opts);
      td.verify(opts.inverse(td.matchers.isA(Object)), { times: 1 });
    });
  });

  describe('ifMajor', () => {
    const opts = {};
    beforeEach(() => {
      opts.fn = td.function();
      opts.inverse = td.function();
    });

    afterEach(() => td.reset());

    it(`should call fn function if is major`, () => {
      ifMajor('0.13', '0.12', opts);
      td.verify(opts.fn(td.matchers.isA(Object)), { times: 1 });
    });

    it(`should call inverse function if values not major`, () => {
      ifMajor('0.12', '0.13', opts);
      td.verify(opts.inverse(td.matchers.isA(Object)), { times: 1 });
    });
  });
});
