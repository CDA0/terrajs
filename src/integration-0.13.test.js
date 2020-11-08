/* eslint-disable global-require */
/* eslint-env mocha */
const assert = require('assert');
const td = require('testdouble');
const Terrajs = require('./index');

describe('integration (Terraform 0.13)', () => {
  let tf;

  beforeEach(() => {
    tf = new Terrajs({ execute: false });
    td.replace(tf, 'getTerraformVersion');
    td.when(tf.getTerraformVersion()).thenReturn('0.13');
  });

  afterEach(() => td.reset());

  describe('destroy', () => {
    it('should map var flags', async () => {
      assert.strictEqual(await tf.destroy({
        var: {
          foo: 'foo1',
          bar: 'bar1',
        },
      }), 'terraform destroy -backup=terraform.backup -lock=true -lock-timeout=0s -no-color -parallelism=10 -refresh=true -state=terraform.tfstate -var foo="foo1" -var bar="bar1"');
    });
  });

  describe('plan', () => {
    it('should map var flags', async () => {
      assert.strictEqual(await tf.plan({
        var: {
          foo: 'foo1',
          bar: 'bar1',
        },
      }), 'terraform plan -input=false -lock=true -lock-timeout=0s -no-color -out=terraform -parallelism=10 -refresh=true -state=terraform.tfstate -var foo="foo1" -var bar="bar1"');
    });

    it('should map var files flag', async () => {
      assert.strictEqual(await tf.plan({
        varFile: [
          'foo',
          'bar',
        ],
      }), 'terraform plan -input=false -lock=true -lock-timeout=0s -no-color -out=terraform -parallelism=10 -refresh=true -state=terraform.tfstate -var-file=foo -var-file=bar');
    });

    it('should remove no-color', async () => {
      assert.strictEqual(await tf.plan({
        noColor: false,
      }), 'terraform plan -input=false -lock=true -lock-timeout=0s -out=terraform -parallelism=10 -refresh=true -state=terraform.tfstate');
    });

    it('should include detailed-exitcode', async () => {
      assert.strictEqual(await tf.plan({
        detailedExitcode: true,
      }), 'terraform plan -detailed-exitcode -input=false -lock=true -lock-timeout=0s -no-color -out=terraform -parallelism=10 -refresh=true -state=terraform.tfstate');
    });
  });
});
