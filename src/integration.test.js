/* eslint-disable global-require */
/* eslint-env mocha */
const assert = require('assert');
const Terrajs = require('./index');

describe('integration', () => {
  describe('plan', () => {
    let tf;
    beforeEach(() => {
      tf = new Terrajs({ execute: false });
    });

    it('should map var flags', () => {
      assert.strictEqual(tf.plan({
        var: {
          foo: 'foo1',
          bar: 'bar1',
        },
      }), 'terraform plan -input=false -lock=true -lock-timeout=0s -module-depth=-1 -no-color -out=terraform -parallelism=10 -refresh=true -state=terraform.tfstate -var foo=foo1 -var bar=bar1');
    });

    it('should map var files flag', () => {
      assert.strictEqual(tf.plan({
        varFile: [
          'foo',
          'bar',
        ],
      }), 'terraform plan -input=false -lock=true -lock-timeout=0s -module-depth=-1 -no-color -out=terraform -parallelism=10 -refresh=true -state=terraform.tfstate -var-file=foo -var-file=bar');
    });

    it('should remove no-color', () => {
      assert.strictEqual(tf.plan({
        noColor: false,
      }), 'terraform plan -input=false -lock=true -lock-timeout=0s -module-depth=-1 -out=terraform -parallelism=10 -refresh=true -state=terraform.tfstate');
    });
  });
});
