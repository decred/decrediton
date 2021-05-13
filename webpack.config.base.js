/**
 * Base webpack config. This is merged with other env-specific configs.
 */

import path from "path";
import webpack from "webpack";

// We use this local implementation of the NodePolyfillPlugin instead of
// importing the existing implementation from
// https://github.com/Richienb/node-polyfill-webpack-plugin/ so that we can
// specify exactly which modules are polyfilled (i.e. allowlist mode) instead
// of shimming every node module.
class NodePolyfillPlugin {
  apply(compiler) {
    compiler.options.plugins.push(new webpack.ProvidePlugin({
      Buffer: ["buffer", "Buffer"]
    }));

    compiler.options.resolve.fallback = {
      buffer: "buffer",
      stream: "stream-browserify",
      /* eslint-disable camelcase */
      _stream_duplex: "readable-stream/duplex",
      _stream_passthrough: "readable-stream/passthrough",
      _stream_readable: "readable-stream/readable",
      _stream_transform: "readable-stream/transform",
      _stream_writable: "readable-stream/writable"
    };
  }
}

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
    alias: {
      fetchModule: path.resolve(__dirname, "app/helpers/fetchModule.js"),
      walletCrypto: path.resolve(__dirname, "app/helpers/walletCryptoModule.js")
    },
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
    }),

    new NodePolyfillPlugin()
 ]
};
