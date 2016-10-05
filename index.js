/* global module */
module.exports = {
  presets: [
    require('babel-preset-node6'),
  ],
  plugins: [
    require('babel-plugin-transform-async-to-generator'),
    require('babel-plugin-transform-object-entries'),
  ],
};
