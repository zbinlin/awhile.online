"use strict";

import * as fs from "fs";
import {
    MANIFEST_PATH,
} from "../config";

function getVersion() {
    if (MANIFEST_PATH) {
        const data = fs.readFileSync(MANIFEST_PATH, {
            encoding: "utf8",
        });
        const json = JSON.parse(data);
        return new Map(json.versions[json.currentIndex].client);
    }
}
let version = getVersion();
const assets = new Proxy({}, {
    get(target, name, receive) {
        if (MANIFEST_PATH) {
            return (version.get(name) || [])[0];
        } else {
            return name;
        }
    },
});

process.on("SIGHUP", function handleUpdateManifest() {
    console.log("reload manifest.json");
    version = getVersion();
});

export default assets;
