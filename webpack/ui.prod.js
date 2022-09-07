/**
 * Build config for electron's 'Renderer Process' (i.e. wallet UI) for the
 * production environment.
 */

const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const merge = require("webpack-merge").default;
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const baseConfig = require("./ui.base");
const webpack = require("webpack");

module.exports = merge(baseConfig, {
  devtool: "cheap-module-source-map",

  entry: ["@babel/polyfill", "./app/index"],

  output: {
    path: path.join(__dirname, "../app/dist"),
    publicPath: "../dist/"
  },

  module: {
    // CSS injected directly in the DOM.
    rules: [
      {
        test: /\.css$/,
        use: [
          { loader: MiniCssExtractPlugin.loader },
          "css-loader",
          {
            loader: "postcss-loader",
            options: {
              postcssOptions: {
                config: "./postcss.config.js"
              }
            }
          }
        ]
      }
    ]
  },

  plugins: [
    new MiniCssExtractPlugin({ filename: "style.css" }),

    new CopyWebpackPlugin({
      patterns: [
        // Copy the generated trezor iframe and code.
        { from: "./app/dist-trezor", to: "" }
      ]
    }),

    new HtmlWebpackPlugin({
      filename: "app.html",
      template: "app/app.development.html"
    }),

    new HtmlWebpackPlugin({
      filename: "confirmation-dialog.html",
      template: "app/staticPages/confirmation-dialog.html",
      inject: false
    }),

    new webpack.DefinePlugin({
      __ELECTRON_ENV: JSON.stringify("renderer")
    })
  ],

  node: {
    // Trezor-connect currently fails without this.
    __dirname: true
  },

  optimization: {
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          mangle: {
            reserved: [
              "Buffer",
              "BigInteger",
              "Point",
              "ECPubKey",
              "ECKey",
              "ECSignature",
              "sha512_asm",
              "asm",
              "ECPair",
              "HDNode",
              "BridgeTransport"
            ]
          }
        }
      })
    ]
  }
});
