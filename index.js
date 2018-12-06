module.exports = function (api, options) {
  api.assertVersion(7);

  const isWebpack = (options && options.webpack);
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
      ['@babel/plugin-proposal-object-rest-spread', { useBuiltIns: true }],
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
    },
  };

  if (api.env(['development'])) {
    config.plugins.push('react-hot-loader/babel');
  }

  if (api.env('test')) {
    config.plugins.push('istanbul');
  }

  return config;
}
