var webpack = require("webpack");
var webpackTargetElectronRenderer = require("webpack-target-electron-renderer");

var config = {
  entry: [
    "webpack-hot-middleware/client?reload=true&path=http://localhost:9000/__webpack_hmr",
    "./app/app",
  ],
  module: {
    loaders: [{
      test: /\.jsx?$/,
      loaders: ["babel-loader"],
      exclude: /node_modules/
    },
    {
      test: /\.global\.css$/,
      loaders: [
        "style-loader",
        "css-loader?sourceMap"
      ]
    },
    {
      test: /^((?!\.global).)*\.css$/,
      loaders: [
        "style-loader",
        "css-loader?modules&sourceMap&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]"
      ]
    }]
  },
  output: {
    path: __dirname + "/dist",
    publicPath: "http://localhost:9000/dist/",
    filename: "bundle.js"
  },
  resolve: {
    extensions: ["", ".js", ".jsx"],
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
  ],
  query: { presets: ["es2015"] },

};

config.target = webpackTargetElectronRenderer(config);

module.exports = config;
