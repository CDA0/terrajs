# Terrajs

[![Build Status](https://travis-ci.org/CDA0/terrajs.svg?branch=master)](https://travis-ci.org/CDA0/terrajs)
[![npm version](https://badge.fury.io/js/%40cda0%2Fterrajs.svg)](https://badge.fury.io/js/%40cda0%2Fterrajs)

A module to help with creating Terraform commands.

## Supported Commands

- `apply`
- `fmt`
- `get`
- `graph`
- `import`
- `init`
- `output`
- `plan`
- `providers`
- `refresh`
- `show`
- `taint`
- `untaint`
- `validate`
- `version`
- `workspace`
  - `delete`
  - `list`
  - `new`
  - `select`
  - `show`

## Usage

Terrajs will run Terraform commands from the directory passed in with `terraformDir`.

```js
const tf = new Terrajs( { terraformDir: 'path/to/configuration' } );
await tf.init({ backendConfig: { key: 'MY_KEY' } });
```

To view the generated Terraform command without running:

```js
const tf = new Terrajs({ execute: false, terraformDir: 'path/to/configuration' });
console.log(await tf.init({ backendConfig: { key: 'MY_KEY' } }));
```

If you need to use a Terraform binary that's not on your path as `terraform`,
then you can tell Terrajs where to find it in the constructor.

```js
const tf = new Terrajs( { command: 'terraform12', terraformDir: 'path/to/configuration' } );
await tf.init({ backendConfig: { key: 'MY_KEY' } });
```

See `example.js` for a quick impression of how to use the extra commands.

### Variables

Variables are mapped from JavaScript camelCase convention to Terraform CLI snake_case convention. For example:

```js
await tf.plan({
  var: {
    subscriptionId: '123',
    tenantId: 'abc',
    zones: ['A', 'B'],
  }
});
```

...will be mapped to the following command:

```bash
terraform plan -var "subscription_id=123" -var "tenant_id=abc" -var 'zones=["A","B"]'
```

...or on Windows (Command Prompt):

```batch
terraform plan -var "subscription_id=123" -var "tenant_id=abc" -var "zones=[\"A\",\"B\"]"
```

If variables are not being represented as you expect,
please set `TF_LOG=trace` and check to see what Terraform is receiving.
Terrajs uses the default shell assumed by [`child_process`][child-process] which is generally `/bin/sh` and `cmd.exe` (on Windows).
If a variable's value is quite complex with special characters,
this may cause problems with the shell's interpolation.

## Test

`npm run test`

## Coverage

`npm run coverage`

## Contributing

Terraform commands live in the `templates` directory.

Each command has a line for each partial, found in the `partials` directory.

A partial contains the logic for a command line argument.

[child-process]: https://nodejs.org/api/child_process.html#child_process_child_process_exec_command_options_callback
