"use strict";

const path = require("path");
const fs = require("fs");
const pkg = require("./package.json");
const mkdir = require("mkdir-promise");
const childProcess = require("child_process");
const crypto = require("crypto");
const promisify = require("promise-adapter");
const posthtml = require("posthtml");
const postcss = require("postcss");
const valueParser = require("postcss-value-parser");

const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);
const linkFile = promisify(fs.link);
const symlink = promisify(fs.symlink);
const unlink = promisify(fs.unlink);
const exec = promisify(childProcess.exec);

const DEST = process.env.DEPLOY_DEST || "./dist";
const versions = path.join(DEST, "versions");
const PRODUCTION = "production";
const VERSION = generateVersion();
const PUBLIC = "public";
const MANIFEST = "manifest.json";
const productionPath = path.join(DEST, PRODUCTION);
const versionPath = path.join(versions, VERSION);
const prevManifestPath = path.join(productionPath, MANIFEST);
const currManifestPath = path.join(versionPath, MANIFEST);

const clientEntry = {
    path: path.join(process.cwd(), "./client/"),
    filename: "index.html",
};
const serverEntry = {
    path: process.cwd(),
    filename: "index.js",
};

function generateVersion() {
    return "" + Date.now();
}

function getManifest() {
    return readFile(prevManifestPath, {
        encoding: "utf8",
    }).then(contents => {
        const json = JSON.parse(contents);
        return {
            client: new Map(json.client),
            server: new Map(json.server),
        };
    }).catch(ex => {
        return {
            client: new Map(),
            server: new Map(),
        };
    });
}
function saveManifest(manifest) {
    const obj = {
        client: [...manifest.client.entries()],
        server: [...manifest.server.entries()],
    };
    return writeFile(currManifestPath, JSON.stringify(obj, null, "  "));
}

const prevManifest = getManifest();
const currManifest = {
    client: new Map(),
    server: new Map(),
};

function createVersionDirectory() {
    return mkdir(versionPath);
}
function removeVersionDirectory() {
    return exec(`rm -r "${versionPath}"`);
}

function linkToProduction() {
    return unlink(productionPath).catch(() => {})
        .then(() => {
            return symlink(
                path.relative(path.dirname(productionPath, versionPath), versionPath),
                productionPath,
                "dir"
            );
        });
}

function generatePackageJSON() {
    const _pkg = Object.assign({}, {
        name: pkg.name,
        main: path.join(PRODUCTION, serverEntry.filename),
        version: pkg.version,
        dependencies: pkg.dependencies,
    });
    const filePath = path.join(DEST, "package.json");
    return writeFile(filePath, JSON.stringify(_pkg, null, "  "));
}

function md5sum(buffer) {
    return new Promise((resolve, reject) => {
        try {
            const hash = crypto.createHash("md5");
            hash.update(buffer);
            resolve(hash.digest("hex"));
        } catch (ex) {
            reject(ex);
        }
    });
}

function posthtmlPlugin(options) {
    const basePath = path.dirname(options.filePath);
    return function replaceResouceName(tree) {
        return Promise.all([
            processCSSLink(tree, basePath),
            processScriptLink(tree, basePath),
        ]);
    };
    function processCSSLink(tree, basePath) {
        return new Promise((resolve, reject) => {
            const promises = [];
            tree.match({ tag: "link", attrs: { rel: "stylesheet" } }, node => {
                const promise = processResource(node.attrs.href, basePath).then(link => {
                    node.attrs.href = link;
                });
                promises.push(promise);
            });
            resolve(Promise.all(promises));
        });
    }
    function processScriptLink(tree, basePath) {
        return new Promise((resolve, reject) => {
            const promises = [];
            tree.match({ tag: "script", attrs: { src: /.+\.js$/ } }, node => {
                const promise = processResource(node.attrs.src, basePath).then(link => {
                    node.attrs.src = link;
                });
                promises.push(promise);
            });
            resolve(Promise.all(promises));
        });
    }
}

const postcssPlugin = postcss.plugin("replaceResouceName", function postcssPlugin(options) {
    const matches = [
        "src",
        "background",
        "background-image",
        "border",
        "border-image",
        "border-image-source",
        "list-style",
        "list-style-image",
        "cursor",
        "content",
        "symbols",
    ];
    function testURL(url) {
        if (/^(https?:)?\/\/.+$/.test(url)) {
            return false;
        }
        if (url[0] === "/") {
            return false;
        }
        return true;
    }
    const basePath = path.dirname(options.filePath);

    return function replaceResouceName(root) {
        const promises = [];

        root.walkAtRules(rule => {
            if (rule.name !== "import") {
                return;
            }
            const value = rule.params;
            const parsedValue = valueParser(value);
            for (const node of parsedValue.nodes) {
                if (node.type === "function" && node.value === "url") {
                    for (const valueNode of node.nodes) {
                        if (valueNode.type !== "word" && valueNode.type !== "string") {
                            continue;
                        }
                        if (testURL(valueNode.value)) {
                            promises.push(processResource(valueNode.value, basePath).then(newValue => {
                                valueNode.value = newValue;
                                rule.params = parsedValue.toString();
                            }));
                            return;
                        }
                    }
                } else if (node.type === "string") {
                    if (testURL(node.value)) {
                        promises.push(processResource(node.value, basePath).then(newValue => {
                            node.value = newValue;
                            rule.params = parsedValue.toString();
                        }));
                        return;
                    }
                }
            }
        });

        root.walkDecls(decl => {
            if (matches.some(val => decl.prop === val)) {
                const value = decl.value;
                if (!/url/.test(value)) {
                    return;
                }
                const parsedValue = valueParser(value);
                const processing = [];
                for (const node of parsedValue.nodes) {
                    if (node.type !== "function" || node.value !== "url") {
                        continue;
                    }
                    for (const valueNode of node.nodes) {
                        if (valueNode.type !== "word" && valueNode.type !== "string") {
                            continue;
                        }
                        if (testURL(valueNode.value)) {
                            processing.push(valueNode);
                        }
                    }
                }
                if (processing.length) {
                    promises.push(
                        Promise.all(
                            processing.map(node => {
                                return processResource(node.value, basePath).then(link => {
                                    node.value = link;
                                });
                            })
                        ).then(() => {
                            decl.value = parsedValue.toString();
                        })
                    );
                }
            }
        });

        return Promise.all(promises);
    };
});

function createNewPath(filePath, hashValue) {
    const localPath = trimPath(filePath);
    const basedir = path.dirname(localPath);
    const extname = path.extname(localPath);
    const filename = path.basename(localPath, extname);
    const remaning = filePath.replace(localPath, "");
    return path.join(basedir, `${filename}-${hashValue.slice(0, 10)}${extname}${remaning}`);
}

function trimPath(filePath) {
    return filePath.replace(/\?.*$/, "");
}

function processResource(filePath, basePath) {
    const localPath = path.resolve(clientEntry.path, basePath, trimPath(filePath));
    const normalizedPath = path.resolve("/", path.relative(clientEntry.path, localPath));
    if (currManifest.client.has(normalizedPath)) {
        const hashValue = currManifest.client.get(normalizedPath);
        if (hashValue instanceof Promise) {
            return hashValue.then(md5 => createNewPath(filePath, md5));
        } else {
            return Promise.resolve(hashValue[0]);
        }
    }
    const extname = path.extname(localPath).toLowerCase();
    let ret = null;
    switch (extname) {
        case ".html":
            ret = processHTML(localPath);
            break;
        case ".css":
            ret = processCSS(localPath);
            break;
        case ".js":
            ret = processJS(localPath);
            break;
        default:
            ret = processRawFile(localPath);
    }
    ret = ret.then(contents => {
        return trySave("client", normalizedPath, contents);
    });
    currManifest.client.set(normalizedPath, ret);
    return ret.then(md5 => {
        return createNewPath(filePath, md5);
    });
}

function processHTML(filePath) {
    return readFile(filePath, {
        encoding: "utf8",
    }).then(contents => {
        return posthtml([posthtmlPlugin({filePath})]).process(contents);
    }).then(result => result.html);
}

function processCSS(filePath) {
    return readFile(filePath, {
        encoding: "utf8",
    }).then(contents => {
        return postcss([postcssPlugin({filePath})]).process(contents);
    }).then(result => result.css);
}

function processRawFile(filePath) {
    return readFile(filePath);
}

function processJS(filePath) {
    return processRawFile(filePath);
}

function trySave(type, target, contents, keepName) {
    if (typeof contents === "string") {
        contents = Buffer.from(contents, "utf8");
    }
    const paths = {
        source: {
            client: path.join(productionPath, PUBLIC),
            server: productionPath,
        },
        target: {
            client: path.join(versionPath, PUBLIC),
            server: versionPath,
        },
    };
    return prevManifest.then(result => {
        const hashMap = result[type];
        return md5sum(contents).then(md5 => {
            const hashPath = keepName ? target : createNewPath(target, md5);
            const sourcePath = path.join(paths.source[type], hashPath);
            const targetPath = path.join(paths.target[type], hashPath);
            const dirname = path.dirname(targetPath);
            let ret = mkdir(dirname);
            if (hashMap.has(target) && md5 === hashMap.get(target)[1]) {
                ret = ret.then(() => linkFile(sourcePath, targetPath));
            } else {
                ret = ret.then(() => writeFile(targetPath, contents));
            }
            currManifest[type].set(target, [hashPath, md5]);
            return ret.then(() => md5);
        });
    });
}

function deployServer() {
    return readFile(path.join(serverEntry.path, serverEntry.filename)).then(contents => {
        const dest = path.join("/", serverEntry.filename);
        return trySave("server", dest, contents, true);
    });
}

function deployClient() {
    return processResource(clientEntry.filename, clientEntry.path);
}

function prepare() {
    return Promise.all([
        createVersionDirectory(),
        generatePackageJSON(),
    ]);
}

function finish() {
    return Promise.all([
        saveManifest(currManifest),
        linkToProduction(),
    ]);
}

function cleanup() {
    return removeVersionDirectory();
}


function deploy() {
    return prepare()
        .then(() => {
            return Promise.all([
                deployClient(),
                deployServer(),
            ]).then(() => {
                return finish();
            });
        }).catch(ex => {
            console.error(ex);
            return cleanup();
        });
}

deploy();
