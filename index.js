/* global module */
const isWebpack = !!process.env.WEBPACK_BROWSER_TARGET;
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
  config.presets[0][1] = {
    targets: {
      browsers: process.env.WEBPACK_BROWSER_TARGET,
    },
    modules: false,
  };
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

module.exports = config;