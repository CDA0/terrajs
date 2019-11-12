/* eslint-disable no-console */
const Terrajs = require('./src/index');

const tf = new Terrajs({ execute: false });
console.log(tf.validate());
console.log(tf.fmt({ check: false, diff: true }));
console.log(tf.fmt({ check: true, diff: true, dir: 'some/path' }));
console.log(tf.init({ backendConfig: { key: 'KEYKEYKEY' } }));
console.log(tf.plan({ var: { environment: 'SP', location: 'westeurope' } }));
console.log(tf.apply({ var: { environment: 'SP', location: 'westeurope' } }));
console.log(tf.apply({ var: { environment: 'SP', location: 'westeurope' }, plan: 'terraform.tfplan' }));
console.log(tf.output({ json: true }));
