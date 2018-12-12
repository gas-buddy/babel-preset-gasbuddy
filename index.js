/* global module */
module.exports = function (api, options) {
  api.assertVersion(7);
  const browserTarget = process.env.WEBPACK_BROWSER_TARGET || '> 2% in US';
  api.cache.using(() =>  browserTarget || process.env.NODE_ENV || 'development');

  const isWebpack = api.env('webpack');
  // A react module is meant to be consumed by a higher level react project,
  // which means it needs a webpack-like build but w/o CSS transformation
  const isReactModule = api.env('react-module');
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
    if (env === 'production') {
      config.plugins.push(
        '@babel/plugin-transform-react-constant-elements',
        '@babel/plugin-transform-react-inline-elements',
        'babel-plugin-transform-react-remove-prop-types',
        'babel-plugin-transform-react-class-to-function',
      );
    }
  }
  if (isWebpack || isReactModule) {
    Object.assign(config.presets[0][1], {
      targets: browserTarget,
      modules: false,
      useBuiltIns: 'usage',
    });
  }
  if (isReactModule || !isWebpack) {
    config.plugins.push(['babel-plugin-css-modules-transform', {
      generateScopedName: '[name]__[local]___[hash:base64:5]',
    }]);
  }

  if (!isWebpack && !isReactModule && env === 'test') {
    config.plugins.unshift('istanbul');
  }
  return config;
}
