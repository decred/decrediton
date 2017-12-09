/* eslint-disable max-len */
/**
 * Build config for development process that uses Hot-Module-Replacement
 * https://webpack.github.io/docs/hot-module-replacement-with-webpack.html
 */
import webpack from "webpack";
import merge from "webpack-merge";
import baseConfig from "./webpack.config.base";

const port = process.env.PORT || 3000;

export default merge(baseConfig, {

  devtool: "inline-source-map",

  entry: [
    `webpack-hot-middleware/client?path=http://localhost:${port}/__webpack_hmr`,
    "babel-polyfill",
    "./app/index"
  ],

  output: {
    publicPath: `http://localhost:${port}/dist/`
  },

  module: {
    rules: [
      {
        test: /\.min\.css$/,
        use: [{
          loader: "style-loader"
        }, {
          loader: "css-loader",
          options: {
            sourceMap: true
          }
        }]
      },

      {
        test: /^((?!\.min).)*\.css$/,
        use: [{
          loader: "style-loader"
        }, {
          loader: "css-loader",
          options: {
            sourceMap: true,
            modules: true,
            localIdentName: "[name]__[local]___[hash:base64:5]"
          }
        }]
      },

      {
        test: /\.less$/,
        use: [{
          loader: "style-loader"
        }, {
          loader: "css-loader",
          options: {
            sourceMap: true,
            modules: true,
            importLoaders: 1,
            localIdentName: "[local]"
          }
        }, {
          loader: "less-loader",
          options: {
            noIeCompat: true,
            strictMath: true
          }
        }]
      },

      {
        test: [ /\.woff(\?v=\d+\.\d+\.\d+)?$/, /\.woff2(\?v=\d+\.\d+\.\d+)?$/ ],
        use: [{
          loader: "url-loader",
          options: { limit: 10000, mimetype: "application/font-woff" }
        }]
      },

      {
        test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
        use: [{
          loader: "url-loader",
          options: { limit: 10000, mimetype: "application/octet-stream" }
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
      }
    ]
  },

  plugins: [
    // https://webpack.github.io/docs/hot-module-replacement-with-webpack.html
    new webpack.HotModuleReplacementPlugin(),

    // “If you are using the CLI, the webpack process will not exit with an error code by enabling this plugin.”
    // https://webpack.js.org/plugins/no-emit-on-errors-plugin/
    new webpack.NoEmitOnErrorsPlugin(),

    // NODE_ENV should be production so that modules do not perform certain development checks
    new webpack.DefinePlugin({
      "process.env.NODE_ENV": JSON.stringify("development")
    }),

    new webpack.LoaderOptionsPlugin({
      debug: true
    })
  ],

  // https://github.com/chentsulin/webpack-target-electron-renderer#how-this-module-works
  target: "electron-renderer"
});
