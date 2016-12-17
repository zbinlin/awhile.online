"use strict";

const path = require("path");
const fs = require("fs");
const pkg = require("./package.json");
const mkdir = require("mkdir-promise");
const crypto = require("crypto");
const promisify = require("promise-adapter");
const posthtml = require("posthtml");
const postcss = require("postcss");
const valueParser = require("postcss-value-parser");

const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);
const linkFile = promisify(fs.link);
const unlink = promisify(fs.unlink);
const noop = () => {};

const CWD = process.cwd();
const DEST = process.env.DEPLOY_DEST || path.join(CWD, "./dist");
const PUBLIC = "public";
const SERVER = "server";
const MANIFEST = "manifest.json";
const publicPath = path.join(DEST, PUBLIC);
const serverPath = path.join(DEST, SERVER);
const manifestPath = path.join(DEST, MANIFEST);

const clientEntry = {
    path: path.join(CWD, "./client/"),
    filename: "index.html",
};
const serverEntry = {
    path: CWD,
    filename: "index.js",
};

const writedFiles = [];
const write = (...args) => {
    return writeFile(...args).then(ret => {
        writedFiles.push(args[0]);
        return ret;
    });
};

function getCurrentVersionFromManifest(manifest) {
    return parseVersion(manifest.versions[manifest.currentIndex]);
}
function parseVersion(ver = {}) {
    const { client, server } = ver;
    return Object.assign({}, ver, {
        client: new Map(client),
        server: new Map(server),
    });
}
function serializeVersion(ver) {
    const { client, server } = ver;
    return Object.assign({}, ver, {
        client: [...client],
        server: [...server],
    });
}
function getManifest() {
    return readFile(manifestPath, {
        encoding: "utf8",
    }).then(contents => {
        return JSON.parse(contents);
    }).catch(ex => {
        return {
            current: null,
            currentIndex: -1,
            versions: [],
        };
    });
}
function saveManifest(manifest) {
    return writeFile(manifestPath, JSON.stringify(manifest, null, "  "));
}
function updateManifest(latestVersion) {
    return manifestPromise.then(manifest => {
        const currentIndex = (manifest.currentIndex || 0) + 1;
        const newVersions = manifest.versions.slice(0, currentIndex);
        const newVersion = serializeVersion(latestVersion);
        newVersions.push(newVersion);
        return {
            currentIndex,
            current: newVersion.id,
            versions: newVersions,
        };
    }).then(saveManifest);
}

const manifestPromise = getManifest();
const lastVersionPromise = manifestPromise.then(getCurrentVersionFromManifest);
const newVersion = parseVersion();
newVersion.id = new Date().toISOString();

function generatePackageJSON() {
    const _pkg = Object.assign({}, {
        name: pkg.name,
        main: serverEntry.filename,
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
    if (newVersion.client.has(normalizedPath)) {
        const hashValue = newVersion.client.get(normalizedPath);
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
    newVersion.client.set(normalizedPath, ret);
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
        client: publicPath,
        server: serverPath,
    };
    return lastVersionPromise.then(result => {
        const hashMap = result[type];
        return md5sum(contents).then(md5 => {
            const hashPath = keepName ? target : createNewPath(target, md5);
            const targetPath = path.join(paths[type], hashPath);
            const dirname = path.dirname(targetPath);
            let ret = mkdir(dirname);
            if (hashMap.has(target) && md5 === hashMap.get(target)[1]) {
                // nothing
            } else {
                ret = ret.then(() => write(targetPath, contents));
            }
            newVersion[type].set(target, [hashPath, md5]);
            return ret.then(() => md5);
        });
    });
}

function deployServer() {
    const dest = path.join("/", serverEntry.filename);
    return readFile(path.join(serverEntry.path, serverEntry.filename)).then(contents => {
        return trySave("server", dest, contents);
    }).then(() => {
        const index = path.join(DEST, serverEntry.filename);
        return unlink(index).catch(noop).then(() => {
            return linkFile(
                path.join(serverPath, newVersion.server.get(dest)[0]),
                index
            );
        });
    });
}

function deployClient() {
    return processResource(clientEntry.filename, clientEntry.path);
}

function prepare() {
    return mkdir(DEST);
}

function finish() {
    return updateManifest(newVersion);
}

function cleanup() {
    return Promise.all(writedFiles.map(filePath => unlink(filePath)));
}


function deploy() {
    return prepare()
        .then(() => {
            return Promise.all([
                generatePackageJSON(),
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
