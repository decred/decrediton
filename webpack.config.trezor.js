/**
 * Build config for trezor's iframe. This is used to contact trezor-bridge on a
 * separate iframe in the wallet.
 */

import NodePolyfillPlugin from "node-polyfill-webpack-plugin";
import path from "path";
import webpack from "webpack";
import HtmlWebpackPlugin from "html-webpack-plugin";
import CopyWebpackPlugin from "copy-webpack-plugin";
import TerserPlugin from "terser-webpack-plugin";

module.exports = {
    mode: "production",

    target: "web",

    entry: "./node_modules/connect/lib/iframe/iframe.js",

    devtool: "inline-source-map",

    output: {
      filename: "trezor-iframe.js",
      path: path.join(__dirname, "app/dist-trezor"),
      publicPath: "./"
    },

    module: {
        rules: [
            {
                test: /\.js?$/,
                exclude: /node_modules/,
                use: ["babel-loader"]
            }
        ]
    },

    resolve: {
        modules: ["node_modules"]
    },

    plugins: [
        // fix blake2b import
        new webpack.NormalModuleReplacementPlugin(/.blake2b$/, "./blake2b.js"),

        new HtmlWebpackPlugin({
            // trezor-connect doesn't allow overriding the iframe source file,
            // so we need to use the too-generic "iframe.html" filename.
            filename: "iframe.html",
            template: "./app/trezor-iframe.development.html",
            scriptLoading: "blocking"
        }),

        new CopyWebpackPlugin({
            patterns: [
                { from: "./node_modules/connect/data", to: "data" }
            ]
        }),

        new webpack.DefinePlugin({
          "process.env.NODE_DEBUG": false
        }),

        new webpack.ProvidePlugin({
          Buffer: ["buffer", "Buffer"]
        }),

        new NodePolyfillPlugin()
    ],

    optimization: {
        minimizer: [
            new TerserPlugin({
                parallel: true,
                extractComments: false,
                terserOptions: {
                    ecma: 6,
                    mangle: {
                        reserved: [
                            "Array",
                            "BigInteger",
                            "Boolean",
                            "Buffer",
                            "ECPair",
                            "Function",
                            "Number",
                            "Point",
                            "Script"
                        ]
                    }
                }
            })
        ]
    }
};
