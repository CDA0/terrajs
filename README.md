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
const tf = new Terrajs( { terraformDir: 'path/to/files.tf' } );
const cmdString = tf.init({ backendConfig: { key: 'MY_KEY' } });
```

To view the generated Terraform command without running:

```js
const tf = new Terrajs({ execute: false, terraformDir: 'path/to/files.tf' });
tf.init({ backendConfig: { key: 'MY_KEY' } });
```

If you need to use a Terraform binary that's not on your path as `terraform`,
then you can tell Terrajs where to find it in the constructor.

```js
const tf = new Terrajs( { command: 'terraform12', terraformDir: 'path/to/files.tf' } );
const cmdString = tf.init({ backendConfig: { key: 'MY_KEY' } });
```

### Variables

Variables are mapped from JavaScript camelCase convention to Terraform CLI snake_case convention. For example:

```js
tf.plan({
  var: {
    subscriptionId: '123',
    tenantId: 'abc',
    zones: ['A', 'B'],
  }
});
```

...will be mapped to the following Terraform shell command:

```bash
terraform plan -var subscription_id=123 -var tenant_id=abc -var 'zones=["A","B"]'
```

## Test

`npm run test`

## Coverage

`npm run coverage`

## Contributing

Terraform commands live in the `templates` directory.

Each command has a line for each partial, found in the `partials` directory.

A partial contains the logic for a command line argument.
