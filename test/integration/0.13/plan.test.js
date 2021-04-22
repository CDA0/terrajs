/* eslint-env mocha */
const { assert, td, Terrajs } = require('../common');

describe('plan', () => {
  let tf;

  beforeEach(() => {
    tf = new Terrajs({ execute: false });
    td.replace(tf, 'getTerraformVersion');
    td.when(tf.getTerraformVersion()).thenReturn('0.13.0');
  });

  afterEach(() => td.reset());

  it('should map var flags', async () => {
    assert.strictEqual(await tf.plan({
      var: {
        foo: 'foo1',
        bar: 'bar1',
      },
    }), 'terraform plan -input=false -lock=true -lock-timeout=0s -no-color -out=terraform -parallelism=10 -refresh=true -state=terraform.tfstate -var "foo=foo1" -var "bar=bar1"');
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
