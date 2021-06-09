/**
 * Build config for the preload script in development mode.
 */

const merge = require("webpack-merge").default;
const baseConfig = require("./preload.prod.js");

module.exports = merge(baseConfig, {
  mode: "development",

  optimization: {
    minimize: false
  }
});
