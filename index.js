var Promise = require('bluebird');
var path = require('path');
var fs = require('fs-promise');
var konan = require('konan');
var flatten = require('fj-flatten');

module.exports = function(paths) {
  if (typeof paths === 'string') {
    paths = [paths];
  }

  return extractDeps(paths, []).map(function(required) {
    if (required.match(/^\//)) return false;

    return required.replace(/^([^\/]+).*$/g, '$1');
  }).filter(Boolean);
};

function extractDeps(paths, processedDeps) {
  if (typeof paths === 'string') {
    paths = [paths];
  }

  return Promise.map(paths, function(srcPath) {
    return fs.exists(srcPath).then(function(exists) {
      if (!exists) return [];

      return fs.readFile(srcPath, 'utf-8').then(function(src) {
        return konan(src).strings.map(function (required) {
          if (required === '..') {
            return path.resolve(path.dirname(srcPath), '../index.js');
          } else if (required.match(/^[\/.]/g)) {
            return path.resolve(path.dirname(srcPath), required);
          } else {
            return required;
          }
        });
      });
    });
  }).then(flatten).each(function(dep) {
    if (processedDeps.indexOf(dep) === -1) {
      processedDeps.push(dep);
      if (dep.match(/^\//g)) {
        return extractDeps([dep], processedDeps);
      }
    }
  }).then(function() {
    processedDeps.sort();
    return processedDeps;
  });
}