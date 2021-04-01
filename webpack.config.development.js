/**
 * Build config for electron's 'Renderer Process' (i.e. wallet UI) for the
 * development environment.
 */

import webpack from "webpack";
import merge from "webpack-merge";
import baseConfig from "./webpack.config.base";
import HtmlWebpackPlugin from "html-webpack-plugin";

const port = process.env.PORT || 3000;

export default merge(baseConfig, {
  mode: "development",

  // Generate code for electron's ipc-renderer process.
  target: "electron-renderer",

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
                // Adds original className as prefix to the hashed css module
                // class names.
                localIdentName: "[local]__[hash:base64:5]"
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
      }
    ]
  },
  resolve: {
    alias: {
      "react-dom": "@hot-loader/react-dom"
    }
  },

  plugins: [
    new webpack.HotModuleReplacementPlugin(),

    new webpack.DefinePlugin({
      "process.env.NODE_ENV": JSON.stringify("development")
    }),

    new webpack.LoaderOptionsPlugin({
      debug: true
    }),

    new HtmlWebpackPlugin({
      filename: "app.html",
      template: "app/app.development.html"
    })
  ]
});
