/* eslint-disable no-console */
const Terrajs = require('./src/index');

const example = async () => {
  const tf = new Terrajs({ execute: false });

  [
    await tf.version(),
    await tf.validate(),
    await tf.fmt({ check: false, diff: true }),
    await tf.fmt({ check: true, diff: true, dir: 'some/path' }),
    await tf.init({ backendConfig: { key: 'KEYKEYKEY' } }),
    await tf.plan({ var: { environment: 'SP', location: 'westeurope' } }),
    await tf.apply({ var: { environment: 'SP', location: 'westeurope' } }),
    await tf.apply({ var: { environment: 'SP', location: 'westeurope' }, plan: 'terraform.tfplan' }),
    await tf.output({ json: true }),
    await tf.taint(),
    await tf.untaint(),
  ].forEach(command => console.log(command));
};

example();
