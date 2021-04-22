/* eslint-env mocha */
const { assert, td, Terrajs } = require('../common');

describe('destroy', () => {
  let tf;

  beforeEach(() => {
    tf = new Terrajs({ execute: false });
    td.replace(tf, 'getTerraformVersion');
    td.when(tf.getTerraformVersion()).thenReturn('0.11.0');
  });

  afterEach(() => td.reset());

  it('should map var flags', async () => {
    assert.strictEqual(await tf.destroy({
      var: {
        foo: 'foo1',
        bar: 'bar1',
      },
    }), 'terraform destroy -backup=terraform.backup -lock=true -lock-timeout=0s -no-color -parallelism=10 -refresh=true -state=terraform.tfstate -var "foo=foo1" -var "bar=bar1"');
  });
});
