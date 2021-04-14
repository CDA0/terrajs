/* eslint-disable global-require */
/* eslint-env mocha */
const assert = require('assert');
const td = require('testdouble');

describe('index', () => {
  let shExec;

  beforeEach(() => {
    shExec = td.replace('../../src/shExec');
    td.when(shExec('terraform -version'), { ignoreExtraArgs: true }).thenReturn('Terraform v0.12.15');
  });

  afterEach(() => td.reset());

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
      helpers = td.replace('../../src/registerHelpers');
      partials = td.replace('../../src/registerPartials');
      Terrajs = require('../../src/index');
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
      Terrajs = require('../../src/index');
    });

    afterEach(() => td.reset());

    it('should return a function', () => {
      const fn = Terrajs.getTemplate('test');
      assert.equal(typeof fn, 'function');
    });
  });

  describe('getTerraformVersion', () => {
    let Terrajs;
    let tf;

    beforeEach(() => {
      td.replace('../../src/registerHelpers');
      td.replace('../../src/registerPartials');
      Terrajs = require('../../src/index');
      tf = new Terrajs();
    });

    afterEach(() => td.reset());

    it('should return the version string', async () => {
      const result = await tf.getTerraformVersion();
      assert.strictEqual(result, '0.12.15');
    });
  });

  describe('buildCommand', () => {
    let Terrajs;
    let tf;
    let getTemplate;
    let template;

    beforeEach(() => {
      td.replace('../../src/registerHelpers');
      td.replace('../../src/registerPartials');
      Terrajs = require('../../src/index');
      tf = new Terrajs();
      template = td.function();
      getTemplate = td.replace(Terrajs, 'getTemplate');
      td.when(getTemplate('apply')).thenReturn(template);
      td.when(template(td.matchers.isA(Object))).thenReturn('  abc\ndef\n  ');
    });

    afterEach(() => td.reset());

    it('should trim spaces and replace new lines', async () => {
      const cmd = await tf.buildCommand('apply', { test: 'abc' });
      assert.equal(cmd, 'abc def');
    });
  });

  describe('buildAndExec', () => {
    let Terrajs;
    let tf;
    let buildCommand;
    let template;

    beforeEach(() => {
      td.replace('../../src/registerHelpers');
      td.replace('../../src/registerPartials');
      Terrajs = require('../../src/index');
      tf = new Terrajs();
      template = 'template';
      buildCommand = td.replace(tf, 'buildCommand');
      td.when(buildCommand('test', { test: 'abc' })).thenReturn(template);
    });

    afterEach(() => td.reset());

    it('should call exec with the compiled template', async () => {
      await tf.buildAndExec('test', { test: 'abc' });
      td.verify(shExec('template', {}));
    });

    it('should pass cwd to if terraformDir is set', async () => {
      tf.terraformDir = 'pop';
      await tf.buildAndExec('test', { test: 'abc' });
      td.verify(shExec('template', { cwd: 'pop' }));
    });
  });

  describe('commandWrapper', () => {
    let Terrajs;
    let tf;
    let buildCommand;
    let buildAndExec;

    beforeEach(() => {
      td.replace('../../src/registerHelpers');
      td.replace('../../src/registerPartials');
      Terrajs = require('../../src/index');
      tf = new Terrajs();
      buildCommand = td.replace(tf, 'buildCommand');
      buildAndExec = td.replace(tf, 'buildAndExec');
    });

    afterEach(() => td.reset());

    it('should call build command if execute is not set', async () => {
      tf.execute = false;
      await tf.commandWrapper('any-command', {});
      td.verify(buildCommand('any-command', {}));
    });

    it('should call execute command if execute is set', async () => {
      await tf.commandWrapper('any-command', {}, {});
      td.verify(buildAndExec('any-command', {}, {}));
    });
  });

  describe('apply', () => {
    let Terrajs;
    let tf;
    let commandWrapper;

    beforeEach(() => {
      td.replace('../../src/registerHelpers');
      td.replace('../../src/registerPartials');
      Terrajs = require('../../src/index');
      tf = new Terrajs();
      commandWrapper = td.replace(tf, 'commandWrapper');
    });

    afterEach(() => td.reset());

    it('should call commandWrapper', async () => {
      await tf.apply();
      td.verify(commandWrapper('apply', {}, {}));
    });
  });

  describe('destroy', () => {
    let Terrajs;
    let tf;
    let commandWrapper;

    beforeEach(() => {
      td.replace('../../src/registerHelpers');
      td.replace('../../src/registerPartials');
      Terrajs = require('../../src/index');
      tf = new Terrajs();
      commandWrapper = td.replace(tf, 'commandWrapper');
    });

    afterEach(() => td.reset());

    it('should call commandWrapper', async () => {
      await tf.destroy();
      td.verify(commandWrapper('destroy', {}, {}));
    });
  });

  describe('fmt', () => {
    let Terrajs;
    let tf;
    let commandWrapper;

    beforeEach(() => {
      td.replace('../../src/registerHelpers');
      td.replace('../../src/registerPartials');
      Terrajs = require('../../src/index');
      tf = new Terrajs();
      commandWrapper = td.replace(tf, 'commandWrapper');
    });

    afterEach(() => td.reset());

    it('should call commandWrapper', async () => {
      await tf.fmt();
      td.verify(commandWrapper('fmt', {}, {}));
    });
  });

  describe('get', () => {
    let Terrajs;
    let tf;
    let commandWrapper;

    beforeEach(() => {
      td.replace('../../src/registerHelpers');
      td.replace('../../src/registerPartials');
      Terrajs = require('../../src/index');
      tf = new Terrajs();
      commandWrapper = td.replace(tf, 'commandWrapper');
    });

    afterEach(() => td.reset());

    it('should call commandWrapper', async () => {
      await tf.get();
      td.verify(commandWrapper('get', {}, {}));
    });
  });

  describe('graph', () => {
    let Terrajs;
    let tf;
    let commandWrapper;

    beforeEach(() => {
      td.replace('../../src/registerHelpers');
      td.replace('../../src/registerPartials');
      Terrajs = require('../../src/index');
      tf = new Terrajs();
      commandWrapper = td.replace(tf, 'commandWrapper');
    });

    afterEach(() => td.reset());

    it('should call commandWrapper', async () => {
      await tf.graph();
      td.verify(commandWrapper('graph', {}, {}));
    });
  });

  describe('init', () => {
    let Terrajs;
    let tf;
    let commandWrapper;

    beforeEach(() => {
      td.replace('../../src/registerHelpers');
      td.replace('../../src/registerPartials');
      Terrajs = require('../../src/index');
      tf = new Terrajs();
      commandWrapper = td.replace(tf, 'commandWrapper');
    });

    afterEach(() => td.reset());

    it('should call commandWrapper', async () => {
      await tf.init();
      td.verify(commandWrapper('init', {}, {}));
    });
  });

  describe('import', () => {
    let Terrajs;
    let tf;
    let commandWrapper;

    beforeEach(() => {
      td.replace('../../src/registerHelpers');
      td.replace('../../src/registerPartials');
      Terrajs = require('../../src/index');
      tf = new Terrajs();
      commandWrapper = td.replace(tf, 'commandWrapper');
    });

    afterEach(() => td.reset());

    it('should call commandWrapper', async () => {
      await tf.import();
      td.verify(commandWrapper('import', {}, {}));
    });
  });

  describe('output', () => {
    let Terrajs;
    let tf;
    let commandWrapper;

    beforeEach(() => {
      td.replace('../../src/registerHelpers');
      td.replace('../../src/registerPartials');
      Terrajs = require('../../src/index');
      tf = new Terrajs();
      commandWrapper = td.replace(tf, 'commandWrapper');
    });

    afterEach(() => td.reset());

    it('should call commandWrapper', async () => {
      await tf.output();
      td.verify(commandWrapper('output', {}, {}));
    });
  });

  describe('plan', () => {
    let Terrajs;
    let tf;
    let commandWrapper;

    beforeEach(() => {
      td.replace('../../src/registerHelpers');
      td.replace('../../src/registerPartials');
      Terrajs = require('../../src/index');
      tf = new Terrajs();
      commandWrapper = td.replace(tf, 'commandWrapper');
    });

    afterEach(() => td.reset());

    it('should call commandWrapper', async () => {
      await tf.plan();
      td.verify(commandWrapper('plan', {}, {}));
    });
  });

  describe('providers', () => {
    let Terrajs;
    let tf;
    let commandWrapper;

    beforeEach(() => {
      td.replace('../../src/registerHelpers');
      td.replace('../../src/registerPartials');
      Terrajs = require('../../src/index');
      tf = new Terrajs();
      commandWrapper = td.replace(tf, 'commandWrapper');
    });

    afterEach(() => td.reset());

    it('should call commandWrapper', async () => {
      await tf.providers();
      td.verify(commandWrapper('providers', {}, {}));
    });
  });

  describe('refresh', () => {
    let Terrajs;
    let tf;
    let commandWrapper;

    beforeEach(() => {
      td.replace('../../src/registerHelpers');
      td.replace('../../src/registerPartials');
      Terrajs = require('../../src/index');
      tf = new Terrajs();
      commandWrapper = td.replace(tf, 'commandWrapper');
    });

    afterEach(() => td.reset());

    it('should call commandWrapper', async () => {
      await tf.refresh();
      td.verify(commandWrapper('refresh', {}, {}));
    });
  });

  describe('show', () => {
    let Terrajs;
    let tf;
    let commandWrapper;

    beforeEach(() => {
      td.replace('../../src/registerHelpers');
      td.replace('../../src/registerPartials');
      Terrajs = require('../../src/index');
      tf = new Terrajs();
      commandWrapper = td.replace(tf, 'commandWrapper');
    });

    afterEach(() => td.reset());

    it('should call commandWrapper', async () => {
      await tf.show();
      td.verify(commandWrapper('show', {}, {}));
    });
  });

  describe('taint', () => {
    let Terrajs;
    let tf;
    let commandWrapper;

    beforeEach(() => {
      td.replace('../../src/registerHelpers');
      td.replace('../../src/registerPartials');
      Terrajs = require('../../src/index');
      tf = new Terrajs();
      commandWrapper = td.replace(tf, 'commandWrapper');
    });

    afterEach(() => td.reset());

    it('should call commandWrapper', async () => {
      await tf.taint();
      td.verify(commandWrapper('taint', {}, {}));
    });
  });

  describe('untaint', () => {
    let Terrajs;
    let tf;
    let commandWrapper;

    beforeEach(() => {
      td.replace('../../src/registerHelpers');
      td.replace('../../src/registerPartials');
      Terrajs = require('../../src/index');
      tf = new Terrajs();
      commandWrapper = td.replace(tf, 'commandWrapper');
    });

    afterEach(() => td.reset());

    it('should call commandWrapper', async () => {
      await tf.untaint();
      td.verify(commandWrapper('untaint', {}, {}));
    });
  });

  describe('validate', () => {
    let Terrajs;
    let tf;
    let commandWrapper;

    beforeEach(() => {
      td.replace('../../src/registerHelpers');
      td.replace('../../src/registerPartials');
      Terrajs = require('../../src/index');
      tf = new Terrajs();
      commandWrapper = td.replace(tf, 'commandWrapper');
    });

    afterEach(() => td.reset());

    it('should call commandWrapper', async () => {
      await tf.validate();
      td.verify(commandWrapper('validate', {}, {}));
    });
  });

  describe('version', () => {
    let Terrajs;
    let tf;
    let commandWrapper;

    beforeEach(() => {
      td.replace('../../src/registerHelpers');
      td.replace('../../src/registerPartials');
      Terrajs = require('../../src/index');
      tf = new Terrajs();
      commandWrapper = td.replace(tf, 'commandWrapper');
    });

    afterEach(() => td.reset());

    it('should call commandWrapper', async () => {
      await tf.version();
      td.verify(commandWrapper('version', {}, {}));
    });
  });

  describe('workspaceDelete', () => {
    let Terrajs;
    let tf;
    let commandWrapper;

    beforeEach(() => {
      td.replace('../../src/registerHelpers');
      td.replace('../../src/registerPartials');
      Terrajs = require('../../src/index');
      tf = new Terrajs();
      commandWrapper = td.replace(tf, 'commandWrapper');
    });

    afterEach(() => td.reset());

    it('should call commandWrapper', async () => {
      await tf.workspaceDelete();
      td.verify(commandWrapper('workspace-delete', {}, {}));
    });
  });

  describe('workspaceList', () => {
    let Terrajs;
    let tf;
    let commandWrapper;

    beforeEach(() => {
      td.replace('../../src/registerHelpers');
      td.replace('../../src/registerPartials');
      Terrajs = require('../../src/index');
      tf = new Terrajs();
      commandWrapper = td.replace(tf, 'commandWrapper');
    });

    afterEach(() => td.reset());

    it('should call commandWrapper', async () => {
      await tf.workspaceList();
      td.verify(commandWrapper('workspace-list', {}, {}));
    });
  });

  describe('workspaceNew', () => {
    let Terrajs;
    let tf;
    let commandWrapper;

    beforeEach(() => {
      td.replace('../../src/registerHelpers');
      td.replace('../../src/registerPartials');
      Terrajs = require('../../src/index');
      tf = new Terrajs();
      commandWrapper = td.replace(tf, 'commandWrapper');
    });

    afterEach(() => td.reset());

    it('should call commandWrapper', async () => {
      await tf.workspaceNew();
      td.verify(commandWrapper('workspace-new', {}, {}));
    });
  });

  describe('workspaceSelect', () => {
    let Terrajs;
    let tf;
    let commandWrapper;

    beforeEach(() => {
      td.replace('../../src/registerHelpers');
      td.replace('../../src/registerPartials');
      Terrajs = require('../../src/index');
      tf = new Terrajs();
      commandWrapper = td.replace(tf, 'commandWrapper');
    });

    afterEach(() => td.reset());

    it('should call commandWrapper', async () => {
      await tf.workspaceSelect();
      td.verify(commandWrapper('workspace-select', {}, {}));
    });
  });

  describe('workspaceShow', () => {
    let Terrajs;
    let tf;
    let commandWrapper;

    beforeEach(() => {
      td.replace('../../src/registerHelpers');
      td.replace('../../src/registerPartials');
      Terrajs = require('../../src/index');
      tf = new Terrajs();
      commandWrapper = td.replace(tf, 'commandWrapper');
    });

    afterEach(() => td.reset());

    it('should call commandWrapper', async () => {
      await tf.workspaceShow();
      td.verify(commandWrapper('workspace-show', {}, {}));
    });
  });
});
