"use strict";

const webpack = require("webpack");

module.exports = {
    entry: {
        app: "./client/src/app.js",
        vendor: ["babel-polyfill", "whatwg-fetch", "preact", "preact-router", "redux", "redux-thunk", "moment", "qr.js", "shared-session-storage", "validator"],
    },
    output: {
        path: "./client/javascripts",
        filename: "bundle.js",
    },
    module: {
        loaders: [
            {
                test: /\.jsx?$/,
                loader: "babel",
                exclude: /node_modules/,
            },
        ],
    },
    plugins: [
        new webpack.optimize.CommonsChunkPlugin({
            names: ["vendor"],
            filename: "vendor.bundle.js",
        }),
    ],
};
