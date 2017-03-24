/* global module */
module.exports = {
  sourceMaps: "inline",
  presets: [
    ["env", {
      "targets": {
        "node": "current",
      },
      "exclude": ["transform-async-to-generator"],
    }],
    "react",
  ],
  plugins: [
    ["transform-object-rest-spread", { "useBuiltIns": true }],
    ["fast-async", { spec: true }],
    "transform-object-entries",
    "babel-plugin-transform-class-properties"
  ],
  env: {
    test: {
      plugins: ["istanbul"]
    }
  }
};
