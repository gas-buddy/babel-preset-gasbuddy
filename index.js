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
  if (isWebpack) {
    Object.assign(config.presets[0][1], {
      targets: browserTarget,
      modules: false,
      useBuiltIns: 'usage',
    });
  }
  if (isReactModule) {
    // This is the babel-only build of a package intended to be node module, which
    // needs CSS names mangled just like it will be when included from node_modules
    const pkg = process.env.npm_package_name;
    config.plugins.push(['babel-plugin-css-modules-transform', {
      generateScopedName: '[name]__[local]___[hash:base64:5]',
      // Two important conventions here - source in src and build-webpack for output.
      // Would be nice to pass this in somehow, but all I can think of is env
      rootDir: process.env.BABEL_ROOT_DIR || `${process.cwd()}/src`,
      hashPrefix: process.env.BABEL_HASH_PREFIX || `node_modules/${pkg}/build-webpack/`,
    }]);
  } else if (!isWebpack) {
    // This is just the node build of a project, which needs to
    // transform css names like the webpack config does.
    // TODO this forced agreement is denormalized. Maybe a module?
    config.plugins.push(['babel-plugin-css-modules-transform', {
      generateScopedName: '[name]__[local]___[hash:base64:5]',
    }]);
  }

  if (!isWebpack && !isReactModule && env === 'test') {
    config.plugins.unshift('istanbul');
  }
  return config;
}
