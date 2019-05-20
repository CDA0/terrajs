/* eslint-disable global-require */
/* eslint-env mocha */
const assert = require('assert');
const td = require('testdouble');

describe('index', () => {
  describe('constructor', () => {
    let tf;
    let readFileSync;
    let helpers;
    let partials;
    let Terrajs;

    beforeEach(() => {
      readFileSync = td.function();
      td.when(readFileSync(td.matchers.anything(), 'utf-8')).thenReturn('{{test}}');
      td.replace('fs', { readFileSync });
      helpers = td.replace('./registerHelpers');
      partials = td.replace('./registerPartials');
      Terrajs = require('./index');
    });

    afterEach(() => td.reset());

    it('should create an instance with default values', () => {
      tf = new Terrajs();
      assert.equal(tf.command, 'terraform');
      assert.equal(tf.execute, true);
      assert.equal(tf.cwd, null);
    });

    it('should allow setting the command', () => {
      tf = new Terrajs({ command: 'mycommand' });
      assert.equal(tf.command, 'mycommand');
    });

    it('should allow setting execute', () => {
      tf = new Terrajs({ execute: false });
      assert.equal(tf.execute, false);
    });

    it('should allow setting the cwd', () => {
      tf = new Terrajs({ terraformDir: 'mycwd' });
      assert.equal(tf.terraformDir, 'mycwd');
    });

    it('should register helpers', () => {
      tf = new Terrajs();
      td.verify(helpers());
    });

    it('should register partials', () => {
      tf = new Terrajs();
      td.verify(partials());
    });
  });

  describe('getTemplate', () => {
    let readFileSync;
    let Terrajs;

    beforeEach(() => {
      readFileSync = td.function();
      td.when(readFileSync(td.matchers.anything(), 'utf-8')).thenReturn('{{test}}');
      td.replace('fs', { readFileSync });
      Terrajs = require('./index');
    });

    afterEach(() => td.reset());

    it('should return a function', () => {
      const fn = Terrajs.getTemplate('test');
      assert.equal(typeof fn, 'function');
    });
  });

  describe('buildCommand', () => {
    let Terrajs;
    let tf;
    let getTemplate;
    let template;

    beforeEach(() => {
      td.replace('./registerHelpers');
      td.replace('./registerPartials');
      Terrajs = require('./index');
      tf = new Terrajs();
      template = td.function();
      getTemplate = td.replace(Terrajs, 'getTemplate');
      td.when(getTemplate('apply')).thenReturn(template);
      td.when(template(td.matchers.isA(Object))).thenReturn('  abc\ndef\n  ');
    });

    afterEach(() => td.reset());

    it('should trim spaces and replace new lines', () => {
      const cmd = tf.buildCommand('apply', { test: 'abc' });
      assert.equal(cmd, 'abc def');
    });
  });

  describe('buildAndExec', () => {
    let Terrajs;
    let tf;
    let buildCommand;
    let template;
    let shExec;

    beforeEach(() => {
      shExec = td.replace('./shExec');
      td.replace('./registerHelpers');
      td.replace('./registerPartials');
      Terrajs = require('./index');
      tf = new Terrajs();
      template = 'template';
      buildCommand = td.replace(tf, 'buildCommand');
      td.when(buildCommand('test', { test: 'abc' })).thenReturn(template);
    });

    afterEach(() => td.reset());

    it('should call exec with the compiled template', () => {
      tf.buildAndExec('test', { test: 'abc' });
      td.verify(shExec('template', {}));
    });

    it('should pass cwd to if terraformDir is set', () => {
      tf.terraformDir = 'pop';
      tf.buildAndExec('test', { test: 'abc' });
      td.verify(shExec('template', { cwd: 'pop' }));
    });
  });

  describe('apply', () => {
    let Terrajs;
    let tf;
    let buildCommand;
    let buildAndExec;

    beforeEach(() => {
      td.replace('./registerHelpers');
      td.replace('./registerPartials');
      Terrajs = require('./index');
      tf = new Terrajs();
      buildCommand = td.replace(tf, 'buildCommand');
      buildAndExec = td.replace(tf, 'buildAndExec');
    });

    afterEach(() => td.reset());

    it('should call build command if execute is not set', () => {
      tf.execute = false;
      tf.apply();
      td.verify(buildCommand('apply', {}));
    });

    it('should call execute command if execute is set', () => {
      tf.apply();
      td.verify(buildAndExec('apply', {}));
    });
  });

  describe('destroy', () => {
    let Terrajs;
    let tf;
    let buildCommand;
    let buildAndExec;

    beforeEach(() => {
      td.replace('./registerHelpers');
      td.replace('./registerPartials');
      Terrajs = require('./index');
      tf = new Terrajs();
      buildCommand = td.replace(tf, 'buildCommand');
      buildAndExec = td.replace(tf, 'buildAndExec');
    });

    afterEach(() => td.reset());

    it('should call build command if execute is not set', () => {
      tf.execute = false;
      tf.destroy();
      td.verify(buildCommand('destroy', {}));
    });

    it('should call execute command if execute is set', () => {
      tf.destroy();
      td.verify(buildAndExec('destroy', {}));
    });
  });

  describe('init', () => {
    let Terrajs;
    let tf;
    let buildCommand;
    let buildAndExec;

    beforeEach(() => {
      td.replace('./registerHelpers');
      td.replace('./registerPartials');
      Terrajs = require('./index');
      tf = new Terrajs();
      buildCommand = td.replace(tf, 'buildCommand');
      buildAndExec = td.replace(tf, 'buildAndExec');
    });

    afterEach(() => td.reset());

    it('should call build command if execute is not set', () => {
      tf.execute = false;
      tf.init();
      td.verify(buildCommand('init', {}));
    });

    it('should call execute command if execute is set', () => {
      tf.init();
      td.verify(buildAndExec('init', {}));
    });
  });

  describe('output', () => {
    let Terrajs;
    let tf;
    let buildCommand;
    let buildAndExec;

    beforeEach(() => {
      td.replace('./registerHelpers');
      td.replace('./registerPartials');
      Terrajs = require('./index');
      tf = new Terrajs();
      buildCommand = td.replace(tf, 'buildCommand');
      buildAndExec = td.replace(tf, 'buildAndExec');
    });

    afterEach(() => td.reset());

    it('should call build command if execute is not set', () => {
      tf.execute = false;
      tf.output();
      td.verify(buildCommand('output', {}));
    });

    it('should call execute command if execute is set', () => {
      tf.output();
      td.verify(buildAndExec('output', {}));
    });
  });

  describe('plan', () => {
    let Terrajs;
    let tf;
    let buildCommand;
    let buildAndExec;

    beforeEach(() => {
      td.replace('./registerHelpers');
      td.replace('./registerPartials');
      Terrajs = require('./index');
      tf = new Terrajs();
      buildCommand = td.replace(tf, 'buildCommand');
      buildAndExec = td.replace(tf, 'buildAndExec');
    });

    afterEach(() => td.reset());

    it('should call build command if execute is not set', () => {
      tf.execute = false;
      tf.plan();
      td.verify(buildCommand('plan', {}));
    });

    it('should call execute command if execute is set', () => {
      tf.plan();
      td.verify(buildAndExec('plan', {}));
    });
  });

  describe('validate', () => {
    let Terrajs;
    let tf;
    let buildCommand;
    let buildAndExec;

    beforeEach(() => {
      td.replace('./registerHelpers');
      td.replace('./registerPartials');
      Terrajs = require('./index');
      tf = new Terrajs();
      buildCommand = td.replace(tf, 'buildCommand');
      buildAndExec = td.replace(tf, 'buildAndExec');
    });

    afterEach(() => td.reset());

    it('should call build command if execute is not set', () => {
      tf.execute = false;
      tf.validate();
      td.verify(buildCommand('validate', {}));
    });

    it('should call execute command if execute is set', () => {
      tf.validate();
      td.verify(buildAndExec('validate', {}));
    });
  });
});
