/**
 * Build config for electron 'Renderer Process' file
 */

import path from "path";
import webpack from "webpack";
import MiniCssExtractPlugin from "mini-css-extract-plugin";
import CopyPlugin from "copy-webpack-plugin";
import TerserPlugin from "terser-webpack-plugin";
import merge from "webpack-merge";
import HtmlWebpackPlugin from "html-webpack-plugin";
import baseConfig from "./webpack.config.base";

const config = merge(baseConfig, {
  devtool: "cheap-module-source-map",

  entry: [
    "@babel/polyfill",
    "./app/index"
  ],

  output: {
    path: path.join(__dirname, "app/dist"),
    publicPath: "../dist/"
  },

  module: {
    rules: [
      {
        test: /\.css$/,
        use: [{
          loader: MiniCssExtractPlugin.loader
        }, {
          loader: "css-loader",
          options: {
            importLoaders: 1,
            modules: true,
            localIdentName: "[hash:base64]"
          }
        }],
        include: /\.module\.css$/
      },
      {
        test: [/\.css$/],
        use: [{
          loader: MiniCssExtractPlugin.loader
        }, {
          loader: "css-loader",
          options: {
            modules: true,
            importLoaders: 1,
            localIdentName: "[local]"
          }
        }],
        exclude: /\.module\.css$/
      },
      {
        test: [/\.woff(\?v=\d+\.\d+\.\d+)?$/, /\.woff2(\?v=\d+\.\d+\.\d+)?$/],
        use: [{
          loader: "url-loader",
          options: { limit: 10000, mimetype: "application/font-woff" }
        }]
      },

      {
        test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
        use: [{
          loader: "url-loader",
          options: { limit: 10000, mimetype: "application/octet-stream", publicPath: "./dist/" }
        }]
      },

      {
        test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
        use: [{ loader: "file-loader" }]
      },

      {
        test: /\.gif(\?v=\d+\.\d+\.\d+)?$/,
        use: [{ loader: "file-loader" }]
      },

      {
        test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
        use: [{
          loader: "url-loader",
          options: { limit: 10000, mimetype: "image/svg+xml" }
        }]
      },

      {
        test: /\.(mp4)$/,
        use: [{
          loader: "file-loader",
          options: { mimetype: "video/mp4", publicPath: "./dist/" }
        }]
      }
    ]
  },

  plugins: [
    // https://webpack.github.io/docs/list-of-plugins.html#occurrenceorderplugin
    // https://github.com/webpack/webpack/issues/864
    new webpack.optimize.OccurrenceOrderPlugin(),

    new MiniCssExtractPlugin({ filename: "style.css" }),

    new CopyPlugin({
      patterns: [
        {
          from: "app/style/icons",
          to: "style/icons"
        },
        {
          from: "app/style/animations/*.gif",
          to: "style/animations/[name].[ext]"
        }
      ]
    }),

    new HtmlWebpackPlugin({
      filename: "../app.html",
      template: "app/app.html",
      inject: false
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
  },

  // https://github.com/chentsulin/webpack-target-electron-renderer#how-this-module-works
  target: "electron-renderer"
});

export default config;
