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
    sourceMaps: true,
    presets: [
      ['@babel/preset-env', {
        targets: { node: 'current' },
        exclude: ['transform-regenerator', 'transform-async-to-generator'],
      }],
      '@babel/preset-react',
    ],
    plugins: [
      '@babel/plugin-transform-flow-strip-types',
      '@babel/plugin-proposal-class-properties',
      '@babel/plugin-proposal-optional-chaining',
    ],
  };

  if (isWebpack) {
    config.plugins.unshift(['module:fast-async', { spec: true }]);
    Object.assign(config.presets[0][1], {
      targets: args.browsers || '> 2% in US',
      modules: false,
      useBuiltIns: 'usage',
    });
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
      config.plugins.push(
        '@babel/plugin-transform-react-constant-elements',
        '@babel/plugin-transform-react-inline-elements',
        'babel-plugin-transform-react-remove-prop-types',
        'babel-plugin-transform-react-class-to-function',
      );
    }
  } else {
    config.plugins.push(['babel-plugin-css-modules-transform', {
      generateScopedName: '[name]__[local]___[hash:base64:5]',
    }]);
    if (env === 'test') {
      config.plugins.unshift('istanbul');
    }
  }

  return config;
}
