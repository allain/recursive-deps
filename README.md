# recursive-deps

Finds all the required dependencies by walking the dependency tree starting from a specified array of source paths

## Installation

```bash
npm install recursive-deps
```

or if you want to use it as a command line tool:

```bash
npm install -g recursive-deps
```


## Programmatic Usage
```js
var recursiveDeps = require('recursive-deps');

// with a string path
recursiveDeps('./index.js').then(function(dependencies) {
  console.log(dependencies); // ['bluebird', 'fs-promise', ...]
});

// with an array of paths
recursiveDeps(['./index.js']).then(function(dependencies) {
  console.log(dependencies); // ['bluebird', 'fs-promise', ...]
});
```

## Command Line Usage

```bash
recursive-deps path1 ...
```


