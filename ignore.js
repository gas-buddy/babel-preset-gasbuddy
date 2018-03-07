/**
 * Helper functions for deciding whether to ignore a particular path for babel transpilation or not
 */
const path = require('path');
const findRoot = require('find-root');

module.exports = function reactTest(fn) {
  const match = fn.match(/[\\\/]node_modules[\\\/](.*)/);
  if (match) {
    const mod = match[1];
    try {
      const packagePath = path.join(findRoot(path.normalize(fn)), 'package.json');
      const package = require(packagePath);
      // Your package's main must be the ES6 source, and there must be
      // a gb key with an object with transpile key that is truthy
      if (package.gb && package.gb.transpile) {
        return false;
      }
      return true;
    } catch (error) {
      return true;
    }
  }
  // Not in node_modules, don't ignore
  return false;
};

