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
module.exports = function (api, options) {
  api.assertVersion(7);

  return {
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
    env: {
      browser: {
        presets: [
          ['@babel/preset-env', {
            targets: options.browsers || '> 2% in US',
            modules: false,
            useBuiltIns: 'usage',
          }],
        ],
        plugins: [
          ['module:fast-async', { spec: true }],
          '@babel/plugin-transform-react-constant-elements',
          '@babel/plugin-transform-react-inline-elements',
          'babel-plugin-transform-react-remove-prop-types',
          'babel-plugin-transform-react-class-to-function',
        ],
      },
      webserver: {
        presets: [
          // We don't want this in config by default in case you're compiling ES modules
          ['babel-plugin-css-modules-transform', {
            generateScopedName: '[name]__[local]___[hash:base64:5]',
          }],
        ],
      },
      test: {
        plugins: [
          'istanbul',
        ],
      },
      development: {
        plugins: ['react-hot-loader/babel'],
      }
    },
  };
}
