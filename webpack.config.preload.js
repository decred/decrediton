/**
 * Build config for trezor's iframe. This is used to contact trezor-bridge on a
 * separate iframe in the wallet.
 */

const path = require("path");
const webpack = require("webpack");
const TerserPlugin = require("terser-webpack-plugin");

module.exports = {
    mode: "production",

    target: "electron-preload",

    entry: "./app/wallet-preload.js",

    devtool: "source-map",

    output: {
      filename: "wallet-preload.js",
      path: path.join(__dirname, "app/dist"),
      publicPath: "./",
      library: {
        name: "_decrediton",
        type: "var"
      }
    },

    module: {
        rules: [
            {
                test: /\.js?$/,
                exclude: /node_modules/,
                use: ["babel-loader"]
            }
        ]
    },

    resolve: {
        modules: ["node_modules"]
    },

    plugins: [
        new webpack.DefinePlugin({
          "process.env.NODE_DEBUG": false,
          "__ELECTRON_ENV": JSON.stringify("preload")
        })
    ],

    optimization: {
      minimizer: [
          new TerserPlugin({
              parallel: true,
              extractComments: false,
              terserOptions: {
                  ecma: 6,
                  mangle: {
                      reserved: [
                          "Array",
                          "BigInteger",
                          "Boolean",
                          "Buffer",
                          "ECPair",
                          "Function",
                          "Number",
                          "Point",
                          "Script"
                      ]
                  }
              }
          })
      ]
    }
};
