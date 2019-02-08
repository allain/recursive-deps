const path = require('path')
const fs = require('fs')
const util = require('util')
const readFile = util.promisify(fs.readFile)
const konan = require('konan')
const flatten = require('fj-flatten')

const pathExists = path => new Promise(resolve => fs.exists(path, resolve))

module.exports = function (paths) {
  if (typeof paths === 'string') {
    paths = [paths]
  }

  return extractDeps(paths, []).then(deps =>
    deps.reduce(
      (result, dep) =>
        dep.match(/^\//)
          ? result
          : result.concat(dep.replace(/^([^\/]+).*$/g, '$1')),
      []
    )
  )
}

async function extractDeps (paths, processedDeps) {
  return Promise.all(
    paths.map(srcPath =>
      pathExists(srcPath).then(exists =>
        exists
          ? readFile(srcPath, 'utf-8').then(src =>
            konan(src).strings.map(dep =>
              dep === '..'
                ? path.resolve(path.dirname(srcPath), '../index.js')
                : dep.match(/^[\/.]/g)
                  ? path.resolve(path.dirname(srcPath), dep)
                  : dep
            )
          )
          : []
      )
    )
  )
    .then(flatten)
    .then(async deps => {
      const newDeps = deps.filter(dep => processedDeps.indexOf(dep) === -1)
      for (let dep of newDeps) {
        processedDeps.push(dep)
        if (dep.match(/^\//g)) {
          await extractDeps([dep], processedDeps)
        }
      }
      return processedDeps.sort()
    })
}
