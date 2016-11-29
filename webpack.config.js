"use strict";

module.exports = {
    entry: "./client/src/app.js",
    output: {
        path: "./client/javascripts/",
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
};
