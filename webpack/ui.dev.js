/**
 * Build config for electron's 'Renderer Process' (i.e. wallet UI) for the
 * development environment.
 */

const webpack = require("webpack");
const merge = require("webpack-merge").default;
const baseConfig = require("./ui.base");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");

const port = process.env.PORT || 3000;
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');

module.exports = merge(baseConfig, {
  mode: "development",
  devServer: {
    hot: true,
  },
  devtool: "inline-source-map",

  entry: [
    `webpack-hot-middleware/client?path=http://localhost:${port}/__webpack_hmr`,
    "@babel/polyfill",
    "./app/index"
  ],

  output: {
    publicPath: `http://localhost:${port}/dist/`
  },

  module: {
    // CSS files injected directly in the DOM.
    rules: [
      {
        test: /\.css$/,
        use: [
          "style-loader",
          {
            loader: "css-loader",
            options: {
              sourceMap: true,
              importLoaders: 1,
              modules: {
                // Prepend the original class name in dev mode to ease debugging.
                localIdentName: "[local]__[hash:base64:5]"
              }
            }
          },
          {
            loader: "postcss-loader",
            options: {
              postcssOptions: {
                config: "./postcss.config.js"
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
            loader: "style-loader"
          },
          {
            loader: "css-loader",
            options: {
              sourceMap: true,
              importLoaders: 1
            }
          }
        ],
        exclude: /\.module\.css$/
      },
      {
        test: /\.[jt]sx?$/,
        exclude: /node_modules/,
        use: [
          {
            loader: require.resolve('babel-loader'),
            options: {
              plugins: [require.resolve('react-refresh/babel')],
            },
          },
        ],
      },
    ]
  },

  node: {
    // Trezor-connect currently fails without this.
    __dirname: true
  },

  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new ReactRefreshWebpackPlugin(),

    new webpack.DefinePlugin({
      __ELECTRON_ENV: JSON.stringify("renderer")
    }),

    new webpack.LoaderOptionsPlugin({
      debug: true
    }),

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
    })
  ],
  // Uncomment to see postcss-loader warnings
  // TODO: Remove when the new solution is implemented and warning is removed
  // ignore: postcss-custom-properties: "importFrom" and "exportTo" will be removed in a future version of postcss-custom-properties.
  // We are looking for insights and anecdotes on how these features are used so that we can design the best alternative.
  // Please let us know if our proposal will work for you.
  // Visit the discussion on github for more details. https://github.com/csstools/postcss-plugins/discussions/192
  ignoreWarnings: [
    {
      module: /postcss-loader\/dist\/cjs\.js/
    }
  ]
});
