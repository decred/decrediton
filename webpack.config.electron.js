/**
 * Build config for electron 'Main Process' file
 */

import webpack from "webpack";
import path from "path";

export default {
  // Generate code for electron's ipc-main process.
  target: "electron-main",

  devtool: "source-map",

  entry: [ "@babel/polyfill", "./app/main.development" ],

  // 'main.js' in root
  output: {
    path: path.resolve(__dirname, "app"),
    filename: "main.js"
  },

  node: {
    __dirname: false
  },

  module: {
    rules: [
      // Pass code through babel.
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        include: /app/,
        loader: "babel-loader"
      },

      // Native modules.
      {
        test: /\.node$/,
        loader: "node-loader",
        options: {
          name: "[name].[ext]"
        }
      }
    ]
  },

  plugins: [
    new webpack.DefinePlugin({
      "process.env": {
        NODE_ENV: JSON.stringify("production")
      },
      "__ELECTRON_ENV": JSON.stringify("main")
    })
  ],

  resolve: {
    extensions: [ ".js", ".jsx", ".json", ".node" ],
    modules: [
      "node_modules"
    ],
    alias: {
      ws: path.resolve(path.join(__dirname, "node_modules/ws/index.js"))
    }
  }
};
