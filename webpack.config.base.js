/**
 * Base webpack config used across other specific configs
 */

import path from "path";
import {
  dependencies as externals
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
    }]
  },

  output: {
    path: path.join(__dirname, "app"),
    filename: "bundle.js",

    // https://github.com/webpack/webpack/issues/1114
    libraryTarget: "commonjs2"
  },

  // https://webpack.github.io/docs/configuration.html#resolve
  resolve: {
    extensions: [".js", ".jsx", ".json"],
    mainFields: ["webpack", "browser", "web", "browserify", ["jam", "main"], "main"]
  },

  plugins: [],

  externals: Object.keys(externals || {})
};
