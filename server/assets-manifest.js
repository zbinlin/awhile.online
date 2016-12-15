"use strict";

import * as fs from "fs";
import {
    MANIFEST_PATH,
} from "../config";

function getManifest() {
    const data = fs.readFileSync(MANIFEST_PATH, {
        encoding: "utf8",
    });
    return new Map(JSON.parse(data).client);
}
let manifest = getManifest();
const assets = new Proxy({}, {
    get(target, name, receive) {
        return (manifest.get(name) || [])[0];
    },
});

process.on("SIGUSR2", function handleUpdateManifest() {
    console.log("reload manifest.json");
    manifest = getManifest();
});

export default assets;
