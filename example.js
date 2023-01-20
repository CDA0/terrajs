/* eslint-disable no-console */
const Terrajs = require('./src/index');

const example = async () => {
  // Execute has been set to false so we can preview the constructed commands.
  const tf = new Terrajs({ execute: false });

  // Run all of the commands and print the results.
  (await Promise.all([
    tf.version(),
    tf.validate(),
    tf.fmt({ check: false, diff: true }),
    tf.graph({ drawCycles: true, type: 'plan', dir: 'some/path' }),
    tf.providers({ dir: 'some/path' }),
    tf.show({ moduleDepth: 5 }),
    tf.init({ backendConfig: { key: 'KEYKEYKEY' } }),
    tf.get({ update: true, dir: 'some/path' }),
    tf.import({ address: 'a_resource.example[\\"indexer\\"]', id: '/unique/identifier' }),
    tf.refresh({ var: { environment: 'SP' }, target: ['a_resource.example'] }),
    tf.plan({
      var: {
        environment: 'SP',
        location: 'westeurope',
        anArray: [1, 2, 3],
        aMap: { name: 'Trevor', age: '30' },
      },
    }),
    tf.apply({ var: { environment: 'SP', location: 'westeurope' } }),
    tf.apply({ plan: 'terraform.tfplan' }),
    tf.output({ json: true }),
    tf.taint({ resource: 'resource' }),
    tf.untaint({ resource: 'resource' }),
    tf.workspaceDelete({ name: 'dev' }),
    tf.workspaceList({ dir: 'some/path' }),
    tf.workspaceNew({ name: 'dev' }),
    tf.workspaceSelect({ name: 'dev' }),
    tf.workspaceShow(),
  ])).forEach((command) => console.log(command));
};

example();
