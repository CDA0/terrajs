# Terrajs

[![Build Status](https://travis-ci.org/CDA0/terrajs.svg?branch=master)](https://travis-ci.org/CDA0/terrajs)
[![npm version](https://badge.fury.io/js/%40cda0%2Fterrajs.svg)](https://badge.fury.io/js/%40cda0%2Fterrajs)

A module to help with creating terraform commands.

## Supported Commands

- `apply`
- `fmt`
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

## Usage

Terrajs will run terraform commands from the directory pass in with `terraformDir`.

```js
const tf = new Terrajs( { terraformDir: 'path/to/files.tf' } );
const cmdString = tf.init({ backendConfig: { key: 'MY_KEY' } });
```

To view the generated terraform command without running:

```js
const tf = new Terrajs({ execute: false, terraformDir: 'path/to/files.tf' });
tf.init({ backendConfig: { key: 'MY_KEY' } });
```

### Variables

Variables are mapped from JS camelCase convention to Terraform CLI snake_case convention. For example:

```js
tf.plan({
  var: {
    subscriptionId: '123',
    tenantId: 'abc'
  }
});
```

...will be mapped to the following terraform shell command:

```bash
terraform plan -var subscription_id=123 -var tenant_id=abc
```

### Lists

Passing a list variable requires some additional preparation. For example:

```js
const subnetArray = [ 'subnetA', 'subnetB' ]
const subnetString = subnetArray.length
  ? `[\\"${subnetArray.join('\\", \\"')}\\"]`
  : '';

tf.plan({
  var: {
    subnets: subnetString
  }
});
```

...will be mapped to the following terraform shell command:

```bash
terraform plan -var "subnets=[\"subnetA\", \"subnetB\"]"
```

## Test

`npm run test`

## Coverage

`npm run coverage`

## Contributing

Commands live in the `templates` dir.

Each command has a line for each partial.

A partial contains the logic for a command line argument.
