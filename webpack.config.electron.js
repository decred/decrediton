/**
 * Build config for electron 'Main Process' file
 */

import webpack from "webpack";
import path from "path";
import merge from "webpack-merge";
import baseConfig from "./webpack.config.base";

export default merge(baseConfig, {
  // Generate code for electron's ipc-main process.
  target: "electron-main",

  devtool: "source-map",

  entry: [ "@babel/polyfill", "./app/main.development" ],

  // 'main.js' in root
  output: {
    path: __dirname,
    filename: "./app/main.js"
  },

  plugins: [
    new webpack.DefinePlugin({
      "process.env": {
        NODE_ENV: JSON.stringify("production")
      }
    })
  ],

  resolve: {
    alias: {
      ws: path.resolve(path.join(__dirname, "node_modules/ws/index.js"))
    }
  }
});
