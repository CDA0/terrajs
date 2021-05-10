/* eslint-disable global-require */
/* eslint-env mocha */
const assert = require('assert');
const td = require('testdouble');
const {
  camelToKebab,
  camelToSnake,
  ifVersionSatisfies,
  includes,
  parseVariable,
} = require('../../src/helpers');

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

  describe('ifVersionSatisfies', () => {
    const opts = {};

    beforeEach(() => {
      opts.fn = td.function();
      opts.inverse = td.function();
    });

    afterEach(() => td.reset());

    it('should call fn function if version is within the range', () => {
      ifVersionSatisfies('0.11.14', '<0.12', opts);
      td.verify(opts.fn(td.matchers.isA(Object)), { times: 1 });
    });

    it('should call inverse function if version is outside of the range', () => {
      ifVersionSatisfies('0.11.14', '>=0.12', opts);
      td.verify(opts.inverse(td.matchers.isA(Object)), { times: 1 });
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

  describe('parseVariable', () => {
    describe('linux', () => {
      beforeEach(function setPlatform() {
        this.originalPlatform = process.platform;
        Object.defineProperty(process, 'platform', {
          value: 'linux',
        });
      });

      afterEach(function resetPlatform() {
        Object.defineProperty(process, 'platform', {
          value: this.originalPlatform,
        });
        td.reset();
      });

      it('should correctly parse a string variable', () => {
        const variable = 'West Europe';
        const response = parseVariable('someVar', variable);
        assert.equal(response, '"some_var=West Europe"');
      });

      it('should correctly parse a number variable', () => {
        const variable = 42;
        const response = parseVariable('someVar', variable);
        assert.equal(response, '"some_var=42"');
      });

      it('should correctly parse a boolean variable', () => {
        const variable = true;
        const response = parseVariable('someVar', variable);
        assert.equal(response, '"some_var=true"');
      });

      it('should correctly parse a list variable', () => {
        const variable = ['Apple', 'Banana'];
        const response = parseVariable('someVar', variable);
        assert.equal(response, '\'some_var=["Apple","Banana"]\'');
      });

      it('should correctly parse a map variable', () => {
        const variable = { name: 'Bob', age: 42 };
        const response = parseVariable('someVar', variable);
        assert.equal(response, '\'some_var={"name":"Bob","age":42}\'');
      });

      it('should correctly escape single quotes', () => {
        const variable = { name: '\'Bob\'' };
        const response = parseVariable('someVar', variable);
        // 'some_var={"name":"\'Bob\'"}'
        assert.equal(response, "'some_var={\"name\":\"\\'Bob\\'\"}'");
      });
    });

    describe('windows', () => {
      beforeEach(function setPlatform() {
        process.env.ComSpec = 'C:\\WINDOWS\\system32\\cmd.exe';
        this.originalPlatform = process.platform;
        Object.defineProperty(process, 'platform', {
          value: 'win32',
        });
      });

      afterEach(function resetPlatform() {
        Object.defineProperty(process, 'platform', {
          value: this.originalPlatform,
        });
        td.reset();
      });

      it('should correctly parse a string variable', () => {
        const variable = 'West Europe';
        const response = parseVariable('someVar', variable);
        assert.equal(response, '"some_var=West Europe"');
      });

      it('should correctly parse a number variable', () => {
        const variable = 42;
        const response = parseVariable('someVar', variable);
        assert.equal(response, '"some_var=42"');
      });

      it('should correctly parse a boolean variable', () => {
        const variable = true;
        const response = parseVariable('someVar', variable);
        assert.equal(response, '"some_var=true"');
      });

      it('should correctly parse a list variable', () => {
        const variable = ['Apple', 'Banana'];
        const response = parseVariable('someVar', variable);
        assert.equal(response, '"some_var=[\\"Apple\\",\\"Banana\\"]"');
      });

      it('should correctly parse a map variable', () => {
        const variable = { name: 'Bob', age: 42 };
        const response = parseVariable('someVar', variable);
        assert.equal(response, '"some_var={\\"name\\":\\"Bob\\",\\"age\\":42}"');
      });

      it('should correctly escape double quotes', () => {
        const variable = { name: '"Bob"' };
        const response = parseVariable('someVar', variable);
        // "some_var={\"name\":\"\\\"Bob\\\"\"}"
        assert.equal(response, '"some_var={\\"name\\":\\"\\\\\\"Bob\\\\\\"\\"}"');
      });

      it('should throw when "ComSpec" does not end with "cmd.exe"', async () => {
        process.env.ComSpec = 'C:\\WINDOWS\\system32\\WindowsPowerShell\\v1.0\\powershell.exe';
        let error;
        try {
          parseVariable('someVar', { name: 'Bob' });
        } catch (e) {
          error = e;
        }
        assert.notStrictEqual(error, null);
        assert.strictEqual(error.message, 'Currently Terrajs only supports using "cmd.exe" as the "%ComSpec%" value');
      });
    });
  });
});
