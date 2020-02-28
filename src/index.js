const fs = require('fs');
const path = require('path');
const debug = require('debug')('terrajs');
const merge = require('deepmerge');
const Handlebars = require('handlebars');

const { templatePath } = require('./constants');
const registerPartials = require('./registerPartials');
const registerHelpers = require('./registerHelpers');
const shExec = require('./shExec');
const defaults = require('./defaults');

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

  async buildAndExec(action, args) {
    const cmd = await this.buildCommand(action, args);
    const opts = this.terraformDir ? { cwd: this.terraformDir } : {};
    return shExec(cmd, opts);
  }

  apply(args = {}) {
    return this.execute ? this.buildAndExec('apply', args) : this.buildCommand('apply', args);
  }

  destroy(args = {}) {
    return this.execute ? this.buildAndExec('destroy', args) : this.buildCommand('destroy', args);
  }

  fmt(args = {}) {
    return this.execute ? this.buildAndExec('fmt', args) : this.buildCommand('fmt', args);
  }

  get(args = {}) {
    return this.execute ? this.buildAndExec('get', args) : this.buildCommand('get', args);
  }

  graph(args = {}) {
    return this.execute ? this.buildAndExec('graph', args) : this.buildCommand('graph', args);
  }

  init(args = {}) {
    return this.execute ? this.buildAndExec('init', args) : this.buildCommand('init', args);
  }

  import(args = {}) {
    return this.execute ? this.buildAndExec('import', args) : this.buildCommand('import', args);
  }

  output(args = {}) {
    return this.execute ? this.buildAndExec('output', args) : this.buildCommand('output', args);
  }

  plan(args = {}) {
    return this.execute ? this.buildAndExec('plan', args) : this.buildCommand('plan', args);
  }

  providers(args = {}) {
    return this.execute ? this.buildAndExec('providers', args) : this.buildCommand('providers', args);
  }

  refresh(args = {}) {
    return this.execute ? this.buildAndExec('refresh', args) : this.buildCommand('refresh', args);
  }

  show(args = {}) {
    return this.execute ? this.buildAndExec('show', args) : this.buildCommand('show', args);
  }

  taint(args = {}) {
    return this.execute ? this.buildAndExec('taint', args) : this.buildCommand('taint', args);
  }

  untaint(args = {}) {
    return this.execute ? this.buildAndExec('untaint', args) : this.buildCommand('untaint', args);
  }

  validate(args = {}) {
    return this.execute ? this.buildAndExec('validate', args) : this.buildCommand('validate', args);
  }

  version(args = {}) {
    return this.execute ? this.buildAndExec('version', args) : this.buildCommand('version', args);
  }

  workspaceDelete(args = {}) {
    return this.execute ? this.buildAndExec('workspace-delete', args) : this.buildCommand('workspace-delete', args);
  }

  workspaceList(args = {}) {
    return this.execute ? this.buildAndExec('workspace-list', args) : this.buildCommand('workspace-list', args);
  }

  workspaceNew(args = {}) {
    return this.execute ? this.buildAndExec('workspace-new', args) : this.buildCommand('workspace-new', args);
  }

  workspaceSelect(args = {}) {
    return this.execute ? this.buildAndExec('workspace-select', args) : this.buildCommand('workspace-select', args);
  }

  workspaceShow(args = {}) {
    return this.execute ? this.buildAndExec('workspace-show', args) : this.buildCommand('workspace-show', args);
  }
}

module.exports = Terrajs;
