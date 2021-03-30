/**
 * Build config for electron's 'Renderer Process' (i.e. wallet UI) for the
 * production environment.
 */

import path from "path";
import MiniCssExtractPlugin from "mini-css-extract-plugin";
import TerserPlugin from "terser-webpack-plugin";
import merge from "webpack-merge";
import HtmlWebpackPlugin from "html-webpack-plugin";
import baseConfig from "./webpack.config.base";

const config = merge(baseConfig, {
  // Generate code for electron's ipc-renderer process.
  target: "electron-renderer",

  devtool: "cheap-module-source-map",

  entry: ["@babel/polyfill", "./app/index"],

  output: {
    path: path.join(__dirname, "app/dist"),
    publicPath: "../dist/"
  },

  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader
          },
          {
            loader: "css-loader",
            options: {
              importLoaders: 1,
              modules: {
                localIdentName: "[hash:base64]"
              }
            }
          }
        ],
        include: /\.module\.css$/
      },
      {
        test: [/\.css$/],
        use: [
          {
            loader: MiniCssExtractPlugin.loader
          },
          {
            loader: "css-loader",
            options: {
              importLoaders: 1
            }
          }
        ],
        exclude: /\.module\.css$/
      }
    ]
  },

  plugins: [
    new MiniCssExtractPlugin({ filename: "style.css" }),

    new HtmlWebpackPlugin({
      filename: "app.html",
      template: "app/app.development.html"
    })
  ],

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

export default config;
