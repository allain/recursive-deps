var test = require('blue-tape');

var recursiveDeps = require('..');

test('works in simple case', function(t) {
  return recursiveDeps(__dirname + '/fixtures/simple.js').then(function(dependencies) {
    t.deepEqual(dependencies, ['events', 'fs']);
  });
});

test('follows relative requires', function(t) {
  return recursiveDeps(__dirname + '/fixtures/relative.js').then(function(dependencies) {
    t.deepEqual(dependencies, ['events', 'fs']);
  });
});

test('follows es6 import syntax',function(t) {
  return recursiveDeps(__dirname + '/fixtures/import.js').then(function(dependencies) {
    t.deepEqual(dependencies, ['events', 'fs', 'path']);
  });
});

test('requiring internal path in a package only considers the package',function(t) {
  return recursiveDeps(__dirname + '/fixtures/internal.js').then(function(dependencies) {
    t.deepEqual(dependencies, ['a']);
  });
});

test('missing path yields empty',function(t) {
  return recursiveDeps(__dirname + '/fixtures/missing.js').then(function(dependencies) {
    t.deepEqual(dependencies, []);
  });
});

test('deps are returned in sorted order',function(t) {
  return recursiveDeps(__dirname + '/fixtures/order.js').then(function(dependencies) {
    t.deepEqual(dependencies, ['a', 'b']);
  });
});