/* eslint-env mocha */const { assert, td, Terrajs } = require('../common');
describe('init', () => {
  let tf;
  beforeEach(() => {
    tf = new Terrajs({ execute: false });
    td.replace(tf, 'getTerraformVersion');
    td.when(tf.getTerraformVersion()).thenReturn('0.15.0');
  });
  afterEach(() => td.reset());
  it('should init without deprecated flags', async () => {
    assert.strictEqual(
      await tf.init(),
      'terraform init -backend=true -force-copy -get=true -input=false -no-color -upgrade=false',
    );
  });
});
