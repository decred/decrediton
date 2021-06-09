/**
 * Build config for electron 'Main Process' file in development mode.
 */

const merge = require("webpack-merge").default;
const baseConfig = require("./electron.prod.js");

module.exports = merge(baseConfig, {
  mode: "development",

  optimization: {
    minimize: false
  }
});
