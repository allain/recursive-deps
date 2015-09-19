#!/usr/bin/env node
var argv = require('minimist')(process.argv.slice(2));
var recursiveDeps = require('..');
var fs = require('fs');

if (argv.help || argv.h) {
  return fs.createReadStream(__dirname + '/usage.txt').pipe(process.stdout);
}

recursiveDeps(argv._).each(function(dependency) {
  console.log(dependency);
});