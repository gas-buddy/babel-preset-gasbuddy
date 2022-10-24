/* global module */
module.exports = function (api, options) {
  const browserTarget = process.env.WEBPACK_BROWSER_TARGET || '> 2% in US';
  const isForBrowser = api.env('webpack');
  const isDevelopment = process.env.NODE_ENV === 'development';
  const isProduction = process.env.NODE_ENV === 'production';
  const generateScopedName = isProduction ? '[hash:base64:5]' : '[name]__[local]___[hash:base64:5]';

  api.assertVersion(7);
  api.cache.using(() =>  browserTarget || process.env.NODE_ENV || 'development');

  return {
    presets: [
      [
        '@babel/preset-env',
        {
          targets: isForBrowser ? browserTarget : { node: 'current' },
        }
      ],
      '@babel/preset-react',
      '@babel/preset-typescript',
    ],
    plugins: [
      '@babel/plugin-proposal-class-properties',
      '@loadable/babel-plugin',
      !isForBrowser && 'babel-plugin-dynamic-import-node',
      !isForBrowser && ['babel-plugin-css-modules-transform', { generateScopedName }],
      isDevelopment && isForBrowser && ['react-refresh/babel', { skipEnvCheck: true }],
    ].filter(Boolean),
  };
}
