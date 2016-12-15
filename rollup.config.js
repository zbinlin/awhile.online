"use strict";

import babel from "rollup-plugin-babel";

export default {
    entry: "./server/index.js",
    dest: "./index.js",
    format: "cjs",
    plugins: [
        babel({
            babelrc: false,
            presets: [
                [
                    "latest", {
                        es2015: false,
                    },
                ],
            ],
            plugins: [
                "external-helpers",
            ],
        }),
    ],
};
