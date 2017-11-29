/**
 * Base webpack config used across other specific configs
 */

import path from "path";
import webpack from "webpack";
import {
  dependencies,
  optionalDependencies
} from "./app/package.json";

export default {
  module: {
    rules: [{
      test: /\.jsx?$/,
      exclude: /node_modules/,
      use: [{
        loader: "babel-loader"
      }]
    }, {
      test: /\.json$/,
      use: [{
        loader: "json-loader"
      }]
    },
    {
      test: /\.(png|jpg)$/,
      use: [{
        loader: "url-loader",
        options: {
          limit: 8192
        }
      }]
    },
    {
      test: /\.node$/,
      use: [{
        loader: "node-addon-loader",
        options: {
          basePath: path.resolve(__dirname, "bin")
        }
      }]
    }
    ]
  },

  output: {
    path: path.join(__dirname, "app"),
    filename: "bundle.js",

    // https://github.com/webpack/webpack/issues/1114
    libraryTarget: "commonjs2"
  },

  // https://webpack.github.io/docs/configuration.html#resolve
  resolve: {
    extensions: [".js", ".jsx", ".json", ".node"],
    mainFields: ["webpack", "browser", "web", "browserify", ["jam", "main"], "main"],
    modules: [
      path.resolve(__dirname, "app"),
      path.resolve(__dirname, "app/components"),
      "node_modules"
    ]
  },

  plugins: [new webpack.ProvidePlugin({
    React:     "react",
    PropTypes: "prop-types",
    autobind: ["core-decorators", "autobind"],
    Aux:      ["shared/EmptyHandler",      "default"]
  })],

  externals: Object.keys(dependencies || {}).concat(Object.keys(optionalDependencies || {}))
};
