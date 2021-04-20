/**
 * Base webpack config. This is merged with other env-specific configs.
 */

import path from "path";
import webpack from "webpack";

export default {
  mode: "production",

  module: {
    rules: [
      // Pass code through babel.
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        include: /app/,
        loader: "babel-loader"
      },

      // Image files.
      { test: /\.(svg|png|jpg|gif|mp4)$/, type: "asset" },

      // Font files.
      { test: /\.(woff|woff2|eot|ttf)$/, type: "asset" },

      // Documents/texts.
      { test: /\.(md)$/, type: "asset/source" }
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
    extensions: [ ".js", ".jsx", ".json" ],
    mainFields: [ "webpack", "browser", "web", "browserify", [ "jam", "main" ], "main" ],
    modules: [
      path.resolve(__dirname, "app"),
      path.resolve(__dirname, "app/components"),
      "node_modules"
    ]
  },

  plugins: [
    new webpack.ProvidePlugin({
      React: "react",
      PropTypes: "prop-types"
    }),

    new webpack.IgnorePlugin({
      resourceRegExp: /\.node$/
    })
 ]
};
