# Terrajs
[![Build Status](https://travis-ci.org/CDA0/terrajs.svg?branch=master)](https://travis-ci.org/CDA0/terrajs)
[![npm version](https://badge.fury.io/js/%40cda0%2Fterrajs.svg)](https://badge.fury.io/js/%40cda0%2Fterrajs)

A module to help with creating terraform commands.

## Usage

Terrajs will run terraform commands from the directory pass in with `terraformDir`.

```
const tf = new Terrajs( { terraformDir: 'path/to/files.tf' } );
const cmdString = tf.init({ backendConfig: { key: 'MY_KEY' } });
```

To view the generated terraform command without running:
```
const tf = new Terrajs({ execute: false, terraformDir: 'path/to/files.tf' });
tf.init({ backendConfig: { key: 'MY_KEY' } });
```

### Variables

Variables are mapped from JS camelCase convention to Terraform CLI snake_case convention. For example:

```
tf.plan({
  var: {
    subscriptionId: '123',
    tenantId: 'abc'
  }
});
```

...will be mapped to the following terraform shell command:

```
terraform plan -var subscription_id=123 -var tenant_id=abc
```

## Test

`npm run test`

## Coverage

`npm run coverage`

## Contributing

Commands live in the `templates` dir.

Each command has a line for each partial.

A partial contains the logic for a command line argument.
