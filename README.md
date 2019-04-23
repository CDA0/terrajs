# Terrajs

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

## Test

`npm run test`

## Coverage

`npm run coverage`

## Contributing

Commands live in the `templates` dir.

Each command has a line for each partial.

A partial contains the logic for a command line argument.
