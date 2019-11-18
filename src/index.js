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

  buildCommand(action, args) {
    const context = merge(defaults[action], args);
    const template = Terrajs.getTemplate(action);
    const tfCmd = template({ ...context, command: this.command }).replace(/\r?\n|\r/g, ' ').trim();
    debug('command: %s', tfCmd);
    return tfCmd;
  }

  async buildAndExec(action, args) {
    const cmd = this.buildCommand(action, args);
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

  init(args = {}) {
    return this.execute ? this.buildAndExec('init', args) : this.buildCommand('init', args);
  }

  output(args = {}) {
    return this.execute ? this.buildAndExec('output', args) : this.buildCommand('output', args);
  }

  plan(args = {}) {
    return this.execute ? this.buildAndExec('plan', args) : this.buildCommand('plan', args);
  }

  validate(args = {}) {
    return this.execute ? this.buildAndExec('validate', args) : this.buildCommand('validate', args);
  }
}

module.exports = Terrajs;
