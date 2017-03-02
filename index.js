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
    ["fast-async", { spec: true }],
    "transform-object-entries",
  ],
  env: {
    test: {
      plugins: ["istanbul"]
    }
  }
};
