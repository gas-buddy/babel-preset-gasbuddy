/* global module */
/**
 * NOTE: This may have to change in babel@7. To wit:
 * loganfsmyth [3:20 PM]
 * the point is, a preset function in 6.x is executed every time a file is compiled, in 7.x
 * we will try to reexecute them less often, so if you depend on potentially mutable state,
 * you'll have to give babel a way to know when that state changes. Using `env` will do that
 * automatically, but if you check a global yourself you'll need to handle that, once 7.x
 * lands anyway
 *
 * Will need to add something like: api.cache(() => process.env.WEBPACK_BROWSER_TARGET || '')
 */
module.exports = function (babel, args) {
  const isWebpack = (args && args.webpack);
  const env = process.env.NODE_ENV || 'development';

  const config = {
    sourceMaps: 'inline',
    presets: [
      ['env', {
        targets: { node: 'current' },
        exclude: ['transform-async-to-generator'],
      }],
      'react'
    ],
    plugins: [
      ['transform-object-rest-spread', { 'useBuiltIns': true }],
      ['fast-async', { spec: true }],
      'transform-object-entries',
      'babel-plugin-transform-class-properties'
    ],
  };

  if (isWebpack) {
    config.presets[0][1].targets = { browsers: args.browsers || '> 2% in US' };
    config.presets[0][1].modules = false;
    if (env === 'development') {
      config.plugins.push('react-hot-loader/babel');
    }
    if (env === 'production') {
      config.presets.push('react-optimize');
    }
  } else {
    config.plugins.push('css-modules-transform');
    if (env !== 'production') {
      config.retainLines = true;
    }
    if (env === 'test') {
      config.plugins.unshift('istanbul');
    }
  }

  return config;
}
