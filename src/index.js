const fs = require('fs');
const path = require('path');
const debug = require('debug')('terrajs');
const merge = require('deepmerge');
const Handlebars = require('handlebars');

const { templatePath } = require('./constants');
const defaults = require('./defaults');
const registerPartials = require('./registerPartials');
const registerHelpers = require('./registerHelpers');
const shExec = require('./shExec');

class Terrajs {
  constructor(options = {}) {
    this.command = options.command || 'terraform';
    this.execute = Object.prototype.hasOwnProperty.call(options, 'execute')
      ? options.execute
      : true;
    this.terraformDir = options.terraformDir || null;
    registerHelpers();
    registerPartials();
  }

  static getTemplate(action) {
    const source = fs.readFileSync(path.join(templatePath, `${action}.hbs`), 'utf-8');
    return Handlebars.compile(source);
  }

  async getTerraformVersion() {
    const response = await shExec(`${this.command} -version`, { silent: true });
    return response.split('v')[1].split('.').slice(0, 2).join('.');
  }

  async buildCommand(action, args) {
    const context = merge(defaults[action], args);
    const template = Terrajs.getTemplate(action);
    const tfVersion = await this.getTerraformVersion();
    const tfCmd = template({ ...context, command: this.command, version: tfVersion }).replace(/\r?\n|\r/g, ' ').trim();
    debug('command: %s', tfCmd);
    return tfCmd;
  }

  async buildAndExec(action, args, execOptions) {
    const cmd = await this.buildCommand(action, args);
    const opts = { ...execOptions };
    if (this.terraformDir) {
      opts.cwd = this.terraformDir;
    }
    return shExec(cmd, opts);
  }

  async commandWrapper(action, args, execOptions) {
    return this.execute
      ? this.buildAndExec(action, args, execOptions)
      : this.buildCommand(action, args);
  }

  async apply(args = {}, execOptions = {}) {
    return this.commandWrapper('apply', args, execOptions);
  }

  async destroy(args = {}, execOptions = {}) {
    return this.commandWrapper('destroy', args, execOptions);
  }

  async fmt(args = {}, execOptions = {}) {
    return this.commandWrapper('fmt', args, execOptions);
  }

  async get(args = {}, execOptions = {}) {
    return this.commandWrapper('get', args, execOptions);
  }

  async graph(args = {}, execOptions = {}) {
    return this.commandWrapper('graph', args, execOptions);
  }

  async init(args = {}, execOptions = {}) {
    return this.commandWrapper('init', args, execOptions);
  }

  async import(args = {}, execOptions = {}) {
    return this.commandWrapper('import', args, execOptions);
  }

  async output(args = {}, execOptions = {}) {
    return this.commandWrapper('output', args, execOptions);
  }

  async plan(args = {}, execOptions = {}) {
    return this.commandWrapper('plan', args, execOptions);
  }

  async providers(args = {}, execOptions = {}) {
    return this.commandWrapper('providers', args, execOptions);
  }

  async refresh(args = {}, execOptions = {}) {
    return this.commandWrapper('refresh', args, execOptions);
  }

  async show(args = {}, execOptions = {}) {
    return this.commandWrapper('show', args, execOptions);
  }

  async taint(args = {}, execOptions = {}) {
    return this.commandWrapper('taint', args, execOptions);
  }

  async untaint(args = {}, execOptions = {}) {
    return this.commandWrapper('untaint', args, execOptions);
  }

  async validate(args = {}, execOptions = {}) {
    return this.commandWrapper('validate', args, execOptions);
  }

  async version(args = {}, execOptions = {}) {
    return this.commandWrapper('version', args, execOptions);
  }

  async workspaceDelete(args = {}, execOptions = {}) {
    return this.commandWrapper('workspace-delete', args, execOptions);
  }

  async workspaceList(args = {}, execOptions = {}) {
    return this.commandWrapper('workspace-list', args, execOptions);
  }

  async workspaceNew(args = {}, execOptions = {}) {
    return this.commandWrapper('workspace-new', args, execOptions);
  }

  async workspaceSelect(args = {}, execOptions = {}) {
    return this.commandWrapper('workspace-select', args, execOptions);
  }

  async workspaceShow(args = {}, execOptions = {}) {
    return this.commandWrapper('workspace-show', args, execOptions);
  }
}

module.exports = Terrajs;
