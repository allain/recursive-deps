const test = require('blue-tape')

const recursiveDeps = require('..')

test('works in simple case', t =>
  recursiveDeps(__dirname + '/fixtures/simple.js').then(dependencies =>
    t.deepEqual(dependencies, ['events', 'fs'])
  ))

test('follows relative requires', t =>
  recursiveDeps(__dirname + '/fixtures/relative.js').then(dependencies =>
    t.deepEqual(dependencies, ['events', 'fs'])
  ))

test('follows es6 import syntax', t =>
  recursiveDeps(__dirname + '/fixtures/import.js').then(dependencies =>
    t.deepEqual(dependencies, ['events', 'fs', 'path'])
  ))

test('requiring internal path in a package only considers the package', t =>
  recursiveDeps(__dirname + '/fixtures/internal.js').then(dependencies =>
    t.deepEqual(dependencies, ['a'])
  ))

test('missing path yields empty', t =>
  recursiveDeps(__dirname + '/fixtures/missing.js').then(dependencies =>
    t.deepEqual(dependencies, [])
  ))

test('deps are returned in sorted order', t =>
  recursiveDeps(__dirname + '/fixtures/order.js').then(dependencies =>
    t.deepEqual(dependencies, ['a', 'b'])
  ))
