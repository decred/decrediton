/**
 * Build config for electron 'Main Process' file in development mode.
 */

const merge = require("webpack-merge").default;
const baseConfig = require("./webpack.config.electron.production.js");

module.exports = merge(baseConfig, {
  mode: "development",

  optimization: {
    minimize: false
  }
});
