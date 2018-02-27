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
        exclude: ['transform-regenerator', 'transform-async-to-generator'],
      }],
      'react'
    ],
    plugins: [
      'babel-plugin-transform-class-properties'
    ],
  };

  if (isWebpack) {
    config.plugins.unshift(['transform-object-rest-spread', { 'useBuiltIns': true }],
      ['fast-async', { spec: true }],
      'transform-object-entries');
    config.presets[0][1].targets = {
      browsers: args.browsers || '> 2% in US',
      useBuiltIns: true,
    };
    config.presets[0][1].modules = false;
    if (env === 'development') {
      try {
        require('react-hot-loader/babel');
        config.plugins.unshift('react-hot-loader/babel');
      } catch (error) {
        console.log(
          'babel-preset-gasbuddy requires react-hot-loader@^3.0.0-beta.6 for hot load support.\n',
          'Please add a dev only dependency to your project if you want hot loader support.'
        );
      }
    }
    if (env === 'production') {
      config.presets.push('react-optimize');
    }
  } else {
    config.plugins.push(['css-modules-transform', {
      generateScopedName: '[name]__[local]___[hash:base64:5]',
    }]);
    config.plugins.push(['transform-object-rest-spread', { useBuiltIns: true }]);
    if (env === 'test') {
      config.plugins.unshift('istanbul');
    }
  }

  return config;
}
