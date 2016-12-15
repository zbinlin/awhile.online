'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var koa = _interopDefault(require('koa'));
var koaStatic = _interopDefault(require('koa-static'));
var assert = require('assert');
var pg = _interopDefault(require('pg'));
var redis = _interopDefault(require('redis'));
var promisify = _interopDefault(require('promise-adapter'));
var path = require('path');
var url = require('url');
var moment = _interopDefault(require('moment'));
var Router = _interopDefault(require('koa-router'));
var crypto = require('crypto');
var muyun = require('muyun');
var fs = require('fs');
var coParse = _interopDefault(require('co-body'));
var validator = _interopDefault(require('validator'));
var jwt = require('jsonwebtoken');

const env = process.env;
const isProduction = env.NODE_ENV === "production";

const PG_CONFIG = {};
if (env.hasOwnProperty("DATABASE_URL")) {
    const obj = url.parse(env.DATABASE_URL);
    if (obj.hostname) {
        PG_CONFIG.host = obj.hostname;
    }
    if (obj.port) {
        PG_CONFIG.port = obj.port;
    }
    if (obj.auth) {
        const [user, password] = obj.auth.split(":");
        if (user) {
            PG_CONFIG.user = user;
        }
        if (password) {
            PG_CONFIG.password = password;
        }
    }
    if (obj.pathname) {
        PG_CONFIG.database = obj.pathname.split("/")[1];
    }
} else {
    if (env.hasOwnProperty("PGHOSTADDR")) {
        PG_CONFIG.host = env.PGHOSTADDR;
    } else {
        PG_CONFIG.host = env.PGHOST;
    }
    PG_CONFIG.port = env.PGPORT;
    PG_CONFIG.user = env.PGUSER;
    PG_CONFIG.password = env.PGPASSWORD;
    PG_CONFIG.database = env.PGDATABASE;
}

const REDIS_URL = env.REDIS_URL;
if (isProduction && !REDIS_URL) {
    throw new Error("environment variable `REDIS_URL` is not set");
}

const JWT_SECRET = env.JWT_SECRET;
if (isProduction && !JWT_SECRET) {
    throw new Error("environment variable `JWT_SECRET` is not set");
}

const PORT = env.PORT || 8000;

const HOST = env.HOST || "localhost";

const PG_TN_USERS = "awhile_users"; // users table

const GUEST_NAME = "anonymous";

const ASSETS_PATH = env.NODE_ASSETS_PATH || path.join(process.cwd(), "client/");

const MANIFEST_PATH = env.NODE_ASSETS_PATH ? "./manifest.json" : null;

const GUEST_TTL_RANGE = {
    min: moment.duration(10, "minutes").asSeconds(),
    max: moment.duration(5, "days").asSeconds()
};
const MEMBER_TTL_RANGE = {
    min: moment.duration(1, "minutes").asSeconds(),
    max: moment.duration(1, "months").asSeconds()
};

function promisifyAll(obj) {
    let keys = Object.keys(obj).filter(key => typeof obj[key] === "function");
    for (let key of keys) {
        if (!key.endsWith("Async")) {
            obj[`${ key }Async`] = function () {
                return promisify(obj[key], this)(...[...arguments]);
            };
        }
    }
}
promisifyAll(redis.RedisClient.prototype);
promisifyAll(redis.Multi.prototype);

const pgClient = new pg.Pool(PG_CONFIG);
const redisClient = redis.createClient(REDIS_URL);

var asyncToGenerator = function (fn) {
  return function () {
    var gen = fn.apply(this, arguments);
    return new Promise(function (resolve, reject) {
      function step(key, arg) {
        try {
          var info = gen[key](arg);
          var value = info.value;
        } catch (error) {
          reject(error);
          return;
        }

        if (info.done) {
          resolve(value);
        } else {
          return Promise.resolve(value).then(function (value) {
            step("next", value);
          }, function (err) {
            step("throw", err);
          });
        }
      }

      return step("next");
    });
  };
};











var get = function get(object, property, receiver) {
  if (object === null) object = Function.prototype;
  var desc = Object.getOwnPropertyDescriptor(object, property);

  if (desc === undefined) {
    var parent = Object.getPrototypeOf(object);

    if (parent === null) {
      return undefined;
    } else {
      return get(parent, property, receiver);
    }
  } else if ("value" in desc) {
    return desc.value;
  } else {
    var getter = desc.get;

    if (getter === undefined) {
      return undefined;
    }

    return getter.call(receiver);
  }
};

















var set = function set(object, property, value, receiver) {
  var desc = Object.getOwnPropertyDescriptor(object, property);

  if (desc === undefined) {
    var parent = Object.getPrototypeOf(object);

    if (parent !== null) {
      set(parent, property, value, receiver);
    }
  } else if ("value" in desc && desc.writable) {
    desc.value = value;
  } else {
    var setter = desc.set;

    if (setter !== undefined) {
      setter.call(receiver, value);
    }
  }

  return value;
};

let checkRedis = (() => {
    var _ref = asyncToGenerator(function* () {
        const key = String(Math.random());
        assert.equal((yield redisClient.setAsync(key, key)), "OK");
        assert.equal((yield redisClient.getAsync(key)), key);
        assert.equal((yield redisClient.delAsync(key)), 1);
    });

    return function checkRedis() {
        return _ref.apply(this, arguments);
    };
})();

let checkUsersTable = (() => {
    var _ref2 = asyncToGenerator(function* () {
        const conn = yield pgClient.connect();
        try {
            const result = yield conn.query(`
            SELECT column_name, data_type, character_maximum_length
            FROM INFORMATION_SCHEMA.COLUMNS
            WHERE table_name = '${ PG_TN_USERS }'
        `);
            if (result.rows.length === 0) {
                throw new Error(`table ${ PG_TN_USERS } is not exists`);
            }
        } catch (ex) {
            throw ex;
        } finally {
            conn.release();
        }
    });

    return function checkUsersTable() {
        return _ref2.apply(this, arguments);
    };
})();

let checkDb = (() => {
    var _ref3 = asyncToGenerator(function* () {
        yield checkUsersTable();
    });

    return function checkDb() {
        return _ref3.apply(this, arguments);
    };
})();

let prepare = (() => {
    var _ref4 = asyncToGenerator(function* () {
        yield checkRedis();
        yield checkDb();
    });

    return function prepare() {
        return _ref4.apply(this, arguments);
    };
})();

let shutdown = (() => {
    var _ref5 = asyncToGenerator(function* () {
        yield redisClient.quitAsync();
        yield pgClient.end();
    });

    return function shutdown() {
        return _ref5.apply(this, arguments);
    };
})();

let write = (() => {
    var _ref = asyncToGenerator(function* (content, passphrase, interval, offset, enabled = false) {
        const key = (yield generateHash(content)).slice(0, 11);
        const val = [[MSG_KEY_CONTENT, content], [MSG_KEY_PASSPHRASE, passphrase], [MSG_KEY_INTERVAL, interval], [MSG_KEY_OFFSET, offset], [MSG_KEY_ENABLED, enabled]].map(function ([k, v]) {
            return [generateStoreKey(key, k), serialize(k, v)];
        });
        yield redisClient.msetAsync([].concat(...val));
        return key;
    });

    return function write(_x, _x2, _x3, _x4, _x5) {
        return _ref.apply(this, arguments);
    };
})();

let read = (() => {
    var _ref4 = asyncToGenerator(function* (key) {
        const keys = [MSG_KEY_CONTENT, MSG_KEY_PASSPHRASE, MSG_KEY_INTERVAL, MSG_KEY_OFFSET, MSG_KEY_ENABLED];
        const result = yield redisClient.mgetAsync(keys.map(function (suffix) {
            return generateStoreKey(key, suffix);
        }));
        return result.reduce(function (obj, val, idx) {
            const key = keys[idx];
            obj[key] = deserialize(key, val);
            return obj;
        }, {});
    });

    return function read(_x10) {
        return _ref4.apply(this, arguments);
    };
})();

/**
 * @param {string} key
 * @return {Buffer}
 */


const MSG_PREFIX_KEY = "awhile.online:messages";
const MSG_KEY_CONTENT = "content";
const MSG_KEY_PASSPHRASE = "passphrase";
const MSG_KEY_INTERVAL = "interval";
const MSG_KEY_OFFSET = "offset";
const MSG_KEY_ENABLED = "enabled";

const USER_MSG_PREFIX_KEY = "awhile.online:user";
const USER_MES_SUFFIX_KEY = "messages";

const numberType = {
    serialize(val) {
        return String(val);
    },
    deserialize(val) {
        return Number(val);
    }
};
const booleanType = {
    serialize(val) {
        return String(Number(val));
    },
    deserialize(val) {
        return Boolean(Number(val));
    }
};
const bufferType = {
    serialize(val) {
        return val.toString("hex");
    },
    deserialize(val) {
        return Buffer.from(val, "hex");
    }
};
const types = {
    [MSG_KEY_CONTENT]: bufferType,
    [MSG_KEY_PASSPHRASE]: bufferType,
    [MSG_KEY_INTERVAL]: numberType,
    [MSG_KEY_OFFSET]: numberType,
    [MSG_KEY_ENABLED]: booleanType
};

function serialize(name, value) {
    return types[name].serialize(value);
}
function deserialize(name, value) {
    return types[name].deserialize(value);
}

function generateRedisKey(prefix, key, suffix) {
    return [prefix, key, suffix].join(":");
}

const generateStoreKey = generateRedisKey.bind(null, MSG_PREFIX_KEY);

function generatePassphrase(size = 128) {
    return new Promise((resolve, reject) => {
        crypto.randomBytes(size, (err, buf) => {
            if (err) return reject(err);
            resolve(buf);
        });
    });
}

function generateHash(content) {
    return new Promise((resolve, reject) => {
        const hash = crypto.createHash("md5");
        hash.on("data", function (data) {
            resolve(data.toString("hex"));
        });
        hash.on("error", reject);
        hash.end(content);
    });
}

function normalizeTime(t) {
    if (t instanceof Date) {
        return Math.floor(t.getTime() / 1000);
    }
    return t;
}

/**
 * @param {string|Buffer} content
 * @param {number} interval
 * @param {number|Date} [start=new Date()]
 * @return {string} - hash key
 */
let create = (() => {
    var _ref2 = asyncToGenerator(function* (content, interval, start = new Date()) {
        start = normalizeTime(start);
        const now = normalizeTime(new Date());
        const passphrase = yield generatePassphrase();
        const offset = muyun.getTimeOffsetBy(interval, start);
        const salt = muyun.getSameValueFromTimeInterval(start, interval, offset);
        const crypted = yield muyun.encrypt(content, passphrase, salt);
        return yield write(crypted, passphrase, interval, offset, now >= start);
    });

    return function create(_x6, _x7, _x8) {
        return _ref2.apply(this, arguments);
    };
})();

/**
 * @param {string} key
 * @return {boolean}
 */
let remove = (() => {
    var _ref3 = asyncToGenerator(function* (key) {
        const result = yield redisClient.delAsync([generateStoreKey(key, MSG_KEY_CONTENT), generateStoreKey(key, MSG_KEY_PASSPHRASE), generateStoreKey(key, MSG_KEY_INTERVAL), generateStoreKey(key, MSG_KEY_OFFSET), generateStoreKey(key, MSG_KEY_ENABLED)]);
        return result === 5;
    });

    return function remove(_x9) {
        return _ref3.apply(this, arguments);
    };
})();

function checkExists(key) {
    return redisClient.existsAsync(generateStoreKey(key, MSG_KEY_CONTENT));
}

function updateFlag(key, enabled) {
    return redisClient.setAsync(generateStoreKey(key, MSG_KEY_ENABLED), serialize(MSG_KEY_ENABLED, enabled));
}

let get$1 = (() => {
    var _ref5 = asyncToGenerator(function* (key) {
        const exists = yield checkExists(key);
        if (!exists) throw new Error(`${ key } is not exists`);
        const {
            content: crypted,
            passphrase,
            interval,
            offset,
            enabled
        } = yield read(key);

        const salt = muyun.getSameValueFromTimeInterval(new Date(), interval, offset);
        let content;
        try {
            content = yield muyun.decrypt(crypted, passphrase, salt);
        } catch (ex) {
            if (enabled) {
                yield remove(key);
                throw new Error(`${ key } is expried`);
            }
            return null;
        }
        if (!enabled) {
            yield updateFlag(key, !enabled);
        }
        return content;
    });

    return function get$1(_x11) {
        return _ref5.apply(this, arguments);
    };
})();

function genKeyByUserId(userId) {
    return [USER_MSG_PREFIX_KEY, userId, USER_MES_SUFFIX_KEY].join(":");
}

/**
 * @param {number} userId
 * @param {string} messageId
 * @param {...string} messageIds
 */
let addMessageIds = (() => {
    var _ref6 = asyncToGenerator(function* (userId, messageId, ...messageIds) {
        return yield redisClient.saddAsync(genKeyByUserId(userId), messageId, ...messageIds);
    });

    return function addMessageIds(_x12, _x13, _x14) {
        return _ref6.apply(this, arguments);
    };
})();

/**
 * @param {number} userId
 * @returns {string[]}
 */
let getAllMessageId = (() => {
    var _ref7 = asyncToGenerator(function* (userId) {
        return yield redisClient.smembersAsync(genKeyByUserId(userId));
    });

    return function getAllMessageId(_x15) {
        return _ref7.apply(this, arguments);
    };
})();

/**
 * @param {number} userId
 */


/**
 * @param {number} userId
 * @param {string} messageId
 */
let removeMessageId = (() => {
    var _ref9 = asyncToGenerator(function* (userId, messageId) {
        return yield removeMessageIds(userId, messageId);
    });

    return function removeMessageId(_x17, _x18) {
        return _ref9.apply(this, arguments);
    };
})();

/**
 * @param {number} userId
 * @param {string} messageId
 * @param {...string} messageIds
 * @return {number} - number of removed message ids
 */
let removeMessageIds = (() => {
    var _ref10 = asyncToGenerator(function* (userId, messageId, ...messageIds) {
        const result = yield redisClient.sremAsync(genKeyByUserId(userId), messageId, ...messageIds);
        return result;
    });

    return function removeMessageIds(_x19, _x20, _x21) {
        return _ref10.apply(this, arguments);
    };
})();

/**
 * @param {string[]} messageIds
 */
let checkInvalidMessageIds = (() => {
    var _ref11 = asyncToGenerator(function* (messageIds) {
        const valid = [];
        const invalid = [];
        for (const id of messageIds) {
            if (yield checkExists(id)) {
                valid.push(id);
            } else {
                invalid.push(id);
            }
        }
        return [valid, invalid];
    });

    return function checkInvalidMessageIds(_x22) {
        return _ref11.apply(this, arguments);
    };
})();

const HTML_ESCAPED_CHARS = {
    "<": "&lt;",
    ">": "&gt;",
    "\"": "&quot;",
    "&": "&amp;",
    "'": "&#39;",
    "/": "&#47;",
    "`": "&#96;"
};
const HTML_UNSAFE_CHARS_REGEXP = /[<>"\\&'\/`]/g;

const JS_ESCAPED_CHARS = {
    "<": "\\u003C",
    ">": "\\u003E",
    "/": "\\u002F",
    "\u2028": "\\u2028",
    "\u2029": "\\u2029"
};
const JS_UNSAFE_CHARS_REGEXP = /[<>\/\u2028\u2029]/g;

function outputToHTML(str) {
    return str.replace(HTML_UNSAFE_CHARS_REGEXP, ch => HTML_ESCAPED_CHARS[ch]);
}

function outputToJS(str) {
    return JSON.stringify(str).replace(JS_UNSAFE_CHARS_REGEXP, ch => JS_ESCAPED_CHARS[ch]);
}

function getManifest() {
    if (MANIFEST_PATH) {
        const data = fs.readFileSync(MANIFEST_PATH, {
            encoding: "utf8"
        });
        return new Map(JSON.parse(data).client);
    }
}
let manifest = getManifest();
const assets = new Proxy({}, {
    get(target, name, receive) {
        if (MANIFEST_PATH) {
            return (manifest.get(name) || [])[0];
        } else {
            return name;
        }
    }
});

process.on("SIGUSR2", function handleUpdateManifest() {
    console.log("reload manifest.json");
    manifest = getManifest();
});

const hash = ([key]) => assets[key];

const layoutRouter = new Router();

// mount /
// mount /index.html
// mount /publish.html
// mount /login.html
// mount /register.html
layoutRouter.get(["/", "/index.html", "/publish.html", "/login.html", "/register.html"], function* () {
    const { response: res } = this;
    res.status = 200;
    res.body = `\
<!DOCTYPE html>
<html lang="zh-Hans">
    <head>
        <meta charset="UTF-8">
        <title>Awhile.Online</title>
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <link href="${ hash`/stylesheets/normalize.css` }" rel="stylesheet">
        <link href="${ hash`/stylesheets/layout.css` }" rel="stylesheet">
        <script src="${ hash`/javascripts/vendor.bundle.js` }"></script>
        <script src="${ hash`/javascripts/bundle.js` }"></script>
    </head>
    <body>
        <div class="jumbotron">
            <div class="mid">
                <div class="logo">
                    <span class="name">Awhile</span><span class="dot">.</span><span class="domain">Online</span>
                </div>
            </div>
        </div>
    </body>
</html>`;
});

// mount /v/{hash}
// mount /{GUEST_NAME}/{hash}
const middleware = function* messageMiddleware() {
    const { response: res } = this;
    const { id } = this.params;
    let content;
    try {
        content = yield get$1(id);
        res.status = 200;
    } catch (ex) {
        // TODO logger
        res.status = 404;
    }
    let fragment = "";
    if (content) {
        fragment = `\
            <div class="message-content">${ outputToHTML(content) }</div>
            <div class="message-content-warning">
                <p><i class="fa-warning">&#61553;</i>该消息内容由用户产生，如果内容涉及儿童色情、侵权、诈骗等，可以<a href="mailto:awhile.online@yandex.com?subject=举报&body="><b>发送邮件</b></a>举报！</p>
            </div>
        `;
    } else {
        fragment = `
            <div className="message-content-not-found">
                <span className="num">404</span>
                <span className="desc">Not Found</span>
            </div>
        `;
    }
    res.body = `\
<!DOCTYPE html>
<html lang="zh-Hans">
    <head>
        <meta charset="UTF-8">
        <title>Awhile.Online</title>
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta name="robots" content="noindex">
        <link href="${ hash`/stylesheets/normalize.css` }" rel="stylesheet">
        <link href="${ hash`/stylesheets/layout.css` }" rel="stylesheet">
        <script>
            window.messageContent = ${ content && outputToJS(content) };
        </script>
        <script src="${ hash`/javascripts/vendor.bundle.js` }"></script>
        <script src="${ hash`/javascripts/bundle.js` }"></script>
    </head>
    <body>
        <div class="jumbotron">
            <div class="mid">
                <div class="logo">
                    <span class="name">Awhile</span><span class="dot">.</span><span class="domain">Online</span>
                </div>
            </div>
        </div>
        <div class="mid">
            <div class="main">
                <div class="nav">
                    <a href="/">首页</a>
                    <span>消息</span>
                </div>
                <div class="view-message-container">${ fragment }</div>
            </div>
        </div>
    </body>
</html>`;
};
layoutRouter.get("/m/:id", middleware);
layoutRouter.get(`/${ GUEST_NAME }/:id`, middleware);

function layout() {
    const a = layoutRouter.routes();
    const b = layoutRouter.allowedMethods();
    return function* (next) {
        return yield* a.call(this, b.call(this, next));
    };
}

/**
 * @typedef {Object} ValidityState
 * @property {boolean} valueMissing
 * @property {boolean} typeMismatch
 * @property {boolean} patternMismatch
 * @property {boolean} tooLong
 * @property {boolean} tooShort
 * @property {boolean} rangeUnderflow
 * @property {boolean} rangeOverflow
 * @property {boolean} stepMismatch
 * @property {boolean} badInput
 * @property {boolean} customError
 * @property {boolean} valid
 */

function checkLength(str, min, max) {
    const validity = {
        valid: true
    };
    if (str == null || validator.isEmpty(str)) {
        validity.valid = false;
        validity.valueMissing = true;
    } else if (!validator.isLength(str, { min })) {
        validity.valid = false;
        validity.tooShort = true;
    } else if (!validator.isLength(str, { max })) {
        validity.valid = false;
        validity.tooLong = true;
    }
    return validity;
}
function checkEmail(email) {
    const validity = {
        valid: true
    };
    // NOTE: email is optional
    if (email == null || email == "") {
        return validity;
    }
    if (!validator.isEmail(email)) {
        validity.valid = false;
        validity.typeMismatch = true;
    }
    return validity;
}

function validateRegister(params) {
    const validities = {};
    validities.username = checkLength(params.username, 3, 32);
    validities.password = checkLength(params.password, 6, 128);
    validities.email = checkEmail(params.email);
    if (validities.username.valid && validities.password.valid && validities.email.valid) {
        return true;
    } else {
        return validities;
    }
}

function validateMessage({ content }) {
    const validities = {};
    if (typeof content !== "string") {
        validities.content = {
            valid: false,
            typeMismatch: true
        };
    } else if (content.length === 0) {
        validities.content = {
            valid: false,
            tooShort: true
        };
    } else if (content.length > 1024) {
        validities.content = {
            valid: false,
            tooLong: true
        };
    }
    if (Object.keys(validities).length === 0) {
        return true;
    } else {
        return validities;
    }
}

/**
 * @param {ValidityState}
 * @param {Object} validationMessages - map validityState to error message
 * @param {string} [separator="; "]
 * @return {string}
 */
function generateValidationMessage(validityState, validationMessage, separator = "; ") {
    if (validityState.valid) {
        return "";
    }
    if (validityState.customError) {
        return validityState.customErrorMessage;
    }
    const messages = [];
    for (const key of Object.keys(validityState)) {
        if (key === "valid" || key === "customError" || key === "customErrorMessage") {
            continue;
        }
        messages.push(validationMessage[key]);
    }
    return messages.join(separator);
}

function signToken(payload, options) {
    return new Promise((resolve, reject) => {
        jwt.sign(payload, JWT_SECRET, options, (err, token) => {
            if (err) {
                reject(err);
            } else {
                resolve(token);
            }
        });
    });
}

function verifyToken(token, options) {
    return new Promise((resolve, reject) => {
        jwt.verify(token, JWT_SECRET, options, (err, decoded) => {
            if (err) {
                reject(err);
            } else {
                resolve(decoded);
            }
        });
    });
}

const REDIS_JWT_PREFIX_KEY = "jwt:revocationlist";

function toBuf(str, encoding = "hex") {
    if (typeof str === "string") {
        return Buffer.from(str, encoding);
    } else {
        return str;
    }
}
function toStr(buf, encoding = "hex") {
    if (Buffer.isBuffer(buf)) {
        return buf.toString(encoding);
    } else {
        return buf;
    }
}

function generateSalt() {
    const SIZE = 128;
    return new Promise((resolve, reject) => {
        crypto.randomBytes(SIZE, (err, buf) => {
            if (err) {
                reject(err);
            } else {
                resolve(buf);
            }
        });
    });
}

function encryptPassword(password, salt) {
    const COUNT = 128;
    const SIZE = 512;
    const METHOD = "sha512";
    return new Promise((resolve, reject) => {
        salt = toBuf(salt);
        crypto.pbkdf2(password, salt, COUNT, SIZE, METHOD, (err, buf) => {
            if (err) {
                resolve(err);
            } else {
                resolve(buf);
            }
        });
    });
}

/**
 * @param {string} username
 * @returns {number}
 */
let getUserIdByUsername = (() => {
    var _ref = asyncToGenerator(function* (username) {
        const conn = yield pgClient.connect();
        try {
            const result = yield conn.query(`SELECT id FROM ${ PG_TN_USERS } WHERE username = $1`, [username]);
            if (result.rows.length > 0) {
                return result.rows[0].id;
            } else {
                throw new Error(`username ${ username } is not exists`);
            }
        } catch (ex) {
            throw ex;
        } finally {
            conn.release();
        }
    });

    return function getUserIdByUsername(_x) {
        return _ref.apply(this, arguments);
    };
})();

/**
 * @param {number} userId
 * @returns {string}
 */


/**
 * @param {string} username
 * @returns {Object?}
 */
let getUserInfo = (() => {
    var _ref3 = asyncToGenerator(function* (username) {
        const conn = yield pgClient.connect();
        try {
            const result = yield conn.query(`SELECT id, username, nickname, email FROM ${ PG_TN_USERS } WHERE username = $1`, [username.toLowerCase()]);
            if (result.rows.length > 0) {
                return Object.assign({}, result.rows[0]);
            } else {
                return null;
            }
        } catch (ex) {
            throw ex;
        } finally {
            conn.release();
        }
    });

    return function getUserInfo(_x3) {
        return _ref3.apply(this, arguments);
    };
})();

/**
 * @param {string} username
 * @returns {boolean}
 */
let checkUsernameExists = (() => {
    var _ref4 = asyncToGenerator(function* (username) {
        const conn = yield pgClient.connect();
        try {
            const result = yield conn.query(`SELECT username FROM ${ PG_TN_USERS } WHERE username = $1`, [username.toLowerCase()]);
            if (result.rows.length > 0) {
                return true;
            } else {
                return false;
            }
        } catch (ex) {
            throw ex;
        } finally {
            conn.release();
        }
    });

    return function checkUsernameExists(_x4) {
        return _ref4.apply(this, arguments);
    };
})();

/**
 * @param {string} username
 * @param {string} password
 * @param {string} [email]
 * @returns {boolean}
 */
let register = (() => {
    var _ref5 = asyncToGenerator(function* (username, password, email = null) {
        const conn = yield pgClient.connect();
        const salt = yield generateSalt();
        const encryptedPw = yield encryptPassword(password, salt);
        try {
            const result = yield conn.query(`INSERT INTO ${ PG_TN_USERS }(username, nickname, email, password, salt) VALUES($1, $2, $3, $4, $5)`, [username.toLowerCase(), username, email, toStr(encryptedPw), toStr(salt)]);
            return result.rowCount === 1;
        } catch (ex) {
            throw ex;
        } finally {
            conn.release();
        }
    });

    return function register(_x5, _x6, _x7) {
        return _ref5.apply(this, arguments);
    };
})();

/**
 * @param {number} userId
 * @returns {boolean}
 */


/**
 * @param {number} userId
 * @returns {boolean}
 */


/**
 * @param {number} userId
 * @param {string} email
 * @returns {boolean}
 */


/**
 * @param {number} userId
 * @param {string} nickname
 * @returns {boolean}
 */


/**
 * @param {string} username
 * @param {string} password
 * @param {number} expiration
 * @returns {string}
 */
let login = (() => {
    var _ref10 = asyncToGenerator(function* (username, password, expiresIn) {
        username = username.toLowerCase();
        const conn = yield pgClient.connect();
        let originPw, salt;
        try {
            const result = yield conn.query(`SELECT password, salt FROM ${ PG_TN_USERS } WHERE username = $1`, [username]);
            if (result.rows.length === 0) {
                throw new Error("username is not exists!");
            }
            ({ password: originPw, salt } = result.rows[0]);
        } catch (ex) {
            throw ex;
        } finally {
            conn.release();
        }
        const pw = toStr((yield encryptPassword(password, salt)));
        if (pw !== originPw) {
            throw new Error("password incorrect!");
        }
        try {
            return yield signToken({
                aud: username,
                // NOTE: 保证在同一秒内的 token 不一样
                rnd: Math.random()
            }, {
                expiresIn
            });
        } catch (ex) {
            throw ex;
        }
    });

    return function login(_x15, _x16, _x17) {
        return _ref10.apply(this, arguments);
    };
})();

/**
 * @param {string} token
 */
let logout = (() => {
    var _ref11 = asyncToGenerator(function* (token) {
        let decoded;
        try {
            decoded = yield verifyToken(token);
        } catch (ex) {
            return;
        }
        const expiresIn = decoded.exp - Math.floor(Date.now() / 1000);
        const result = yield redisClient.setAsync([REDIS_JWT_PREFIX_KEY, token].join(":"), "", "EX", expiresIn);
        return result === "OK";
    });

    return function logout(_x18) {
        return _ref11.apply(this, arguments);
    };
})();

/**
 * @param {string} token
 */
let tokenInRevocationList = (() => {
    var _ref12 = asyncToGenerator(function* (token) {
        return yield redisClient.existsAsync([REDIS_JWT_PREFIX_KEY, token].join(":"));
    });

    return function tokenInRevocationList(_x19) {
        return _ref12.apply(this, arguments);
    };
})();

let errno = 1024;
const wrap = src => {
    const dst = Object.create(null);
    Object.assign(dst, src, {
        errno: errno++
    });
    return Object.freeze(dst);
};

const NETWORK_NO_CONNECTION = wrap({
    code: "NETWORK_NO_CONNECTION",
    message: "无网络连接"
});

const SERVER_ERROR = wrap({
    code: "SERVER_ERROR",
    message: "服务器内部发生错误"
});

const USERNAME_OR_PASSWORD_INCORRECT = wrap({
    code: "USERNAME_OR_PASSWORD_INCORRECT",
    message: "用户名或密码错误"
});

const USERNAME_AND_TOKEN_NOT_MATCH = wrap({
    code: "USERNAME_AND_TOKEN_NOT_MATCH",
    message: "用户名和 Token 不一致"
});

const USERNAME_IS_EXISTS = wrap({
    code: "USERNAME_IS_EXISTS",
    message: "用户名已存在"
});

const USER_IS_NOT_EXISTS = wrap({
    code: "USERNAME_IS_EXISTS",
    message: "用户不存在"
});

const USER_TOKEN_HAS_EXPIRED = wrap({
    code: "USER_TOKEN_HAS_EXPIRED",
    message: "用户的 Token 已过期"
});

const USER_NOT_LOGGED_IN = wrap({
    code: "USER_NOT_LOGGED_IN",
    message: "用户未登录"
});

const USER_LOGGED_OUT = wrap({
    code: "USER_LOGGED_OUT",
    message: "用户已登出"
});

let checkTokenInRevocationList = (() => {
    var _ref = asyncToGenerator(function* (token) {
        return yield tokenInRevocationList(token);
    });

    return function checkTokenInRevocationList(_x) {
        return _ref.apply(this, arguments);
    };
})();

function doThrow(ctx, reason) {
    const { request: req, response: res } = ctx;
    res.status = reason.statusCode || 500;
    const body = Object.assign({}, reason, {
        statusCode: reason.statusCode || 500,
        message: reason.message
    });
    if (req.accepts("json")) {
        res.body = body;
    } else {
        res.body = JSON.stringify(body, null, " ".repeat(4));
    }
}

function abortIfUsernameInvalid(ctx, username) {
    if (!ctx.state.credentials || ctx.state.credentials.aud !== username) {
        doThrow(ctx, {
            statusCode: 400,
            message: USERNAME_AND_TOKEN_NOT_MATCH.message
        });
        return true;
    }
}

function parseAuthorizatioHeader(ctx) {
    const request = ctx.request;
    const authorization = request.headers["authorization"];
    if (!authorization) {
        return null;
    }
    const [scheme, token] = authorization.split(/\s+/);
    return {
        scheme: scheme.trim(),
        token: token.trim()
    };
}

function authorize(passThrough = false) {
    return function* (next) {
        const ctx = this;
        const auth = parseAuthorizatioHeader(ctx);
        if (!auth) {
            if (passThrough) {
                return yield next;
            } else {
                return doThrow(ctx, {
                    statusCode: 412
                });
            }
        }
        const { scheme, token } = auth;
        if (scheme.toLowerCase() !== "bearer") {
            if (passThrough) {
                return yield next;
            } else {
                return doThrow(ctx, {
                    statusCode: 401
                });
            }
        }
        if (yield checkTokenInRevocationList(token)) {
            if (passThrough) {
                return yield next;
            } else {
                return doThrow(ctx, {
                    statusCode: 401,
                    message: USER_LOGGED_OUT.message
                });
            }
        }
        try {
            ctx.state.credentials = yield verifyToken(token);
            ctx.state.token = token;
        } catch (ex) {
            if (!passThrough) {
                return doThrow(ctx, {
                    statusCode: 401,
                    message: USER_TOKEN_HAS_EXPIRED.message
                });
            }
        }
        return yield next;
    };
}

const apiRouter = new Router({
    prefix: "/api"
});

apiRouter.get("/", function* () {
    const apis = {
        "authentication": "/authentication",
        "users": "/users",
        "user": "/users/{:username}",
        "message": "/messages/{:id}"
    };
    this.response.status = 200;
    this.response.body = apis;
});
apiRouter.post("/authentication", function* () {
    const { response: res } = this;
    let params;
    try {
        params = yield coParse(this);
    } catch (ex) {
        ex.statusCode = 400;
        doThrow(this, ex);
        return;
    }
    try {
        const { username, password, rememberMe } = params;
        const expiresIn = (rememberMe ? moment.duration(1, "months") : moment.duration(1, "days")).asSeconds();
        const token = yield login(username, password, expiresIn);
        res.status = 200;
        res.body = {
            token
        };
    } catch (ex) {
        // TODO
        // logger ex
        ex.statusCode = 400;
        ex.message = USERNAME_OR_PASSWORD_INCORRECT.message;
        doThrow(this, ex);
    }
});
apiRouter.delete("/authentication", authorize(), function* () {
    const { response: res } = this;
    const token = this.state.token;
    if (!token) {
        doThrow(this, {
            statusCode: 401,
            message: USER_NOT_LOGGED_IN.message
        });
        return;
    }
    try {
        const result = logout(token);
        if (result) {
            res.status = 200;
        } else {
            doThrow(this, {
                statusCode: 401,
                message: USER_LOGGED_OUT.message
            });
        }
    } catch (ex) {
        // TODO logger ex
        console.log(ex);
        doThrow(this, {
            statusCode: 500,
            message: SERVER_ERROR.message
        });
        return;
    }
});
apiRouter.post("/users", function* () {
    const { response: res } = this;
    let params;
    try {
        params = yield coParse(this);
    } catch (ex) {
        ex.statusCode = 400;
        doThrow(this, ex);
        return;
    }
    const result = validateRegister(params);
    if (result !== true) {
        doThrow(this, {
            statusCode: 400,
            detail: result
        });
        return;
    }
    try {
        const { username, password, email } = params;
        const exists = yield checkUsernameExists(username);
        if (exists) {
            doThrow(this, {
                statusCode: 400,
                detail: {
                    username: {
                        valid: false,
                        customError: true,
                        customErrorMessage: "the username is exists"
                    }
                }
            });
            return;
        }
        yield register(username, password, email);
        res.status = 201;
    } catch (ex) {
        // TODO
        // logger ex
        doThrow(this, {
            statusCode: 500,
            message: SERVER_ERROR.message
        });
    }
});
apiRouter.get("/users/:username", authorize(), function* () {
    const { response: res } = this;
    const { username } = this.params;
    if (username !== this.state.credentials.aud) {
        doThrow(this, {
            statusCode: 400,
            message: USERNAME_AND_TOKEN_NOT_MATCH.message
        });
        return;
    }
    let info;
    try {
        info = yield getUserInfo(username);
    } catch (ex) {
        // TODO
        // logger ex
        doThrow(this, {
            statusCode: 500,
            message: SERVER_ERROR.message
        });
        return;
    }
    if (info) {
        res.status = 200;
        res.body = {
            username,
            nickname: info.nickname,
            email: info.email
        };
    } else {
        doThrow(this, {
            statusCode: 404,
            message: USER_IS_NOT_EXISTS.message
        });
    }
});
apiRouter.get("/users/:username/messages", authorize(), function* () {
    const { response: res } = this;
    const { username } = this.params;
    if (abortIfUsernameInvalid(this, username)) {
        return;
    }
    let id;
    try {
        id = yield getUserIdByUsername(username);
    } catch (ex) {
        if (ex.message.includes("is not exists")) {
            doThrow(this, {
                statusCode: 404,
                message: USER_IS_NOT_EXISTS.message
            });
        } else {
            // TODO logger
            doThrow(this, {
                statusCode: 500,
                message: SERVER_ERROR.message
            });
        }
        return;
    }
    const messageIds = yield getAllMessageId(id);
    const [valid, invalid] = yield checkInvalidMessageIds(messageIds);
    if (invalid.length) {
        yield removeMessageIds(id, ...invalid);
    }
    res.status = 200;
    res.body = valid;
});
apiRouter.put("/users/:username/password", authorize(), function* () {
    // TODO
});
apiRouter.put("/users/:username/email", authorize(), function* () {
    // TODO
});
apiRouter.put("/users/:username/nickname", authorize(), function* () {
    // TODO
});
apiRouter.delete("/users/:username", authorize(), function* () {
    // TODO
});
apiRouter.post("/messages", authorize(true), function* () {
    const { response: res } = this;
    let params;
    try {
        params = yield coParse(this);
    } catch (ex) {
        ex.statusCode = 400;
        doThrow(this, ex);
        return;
    }

    const result = validateMessage(params);
    if (result !== true) {
        doThrow(this, {
            statusCode: 400,
            detail: result
        });
        return;
    }

    const { content, ttl, startTime: _startTime } = params;
    const isGuest = !this.state.credentials;
    let startTime, expiresIn;

    if (isGuest) {
        startTime = new Date();
        expiresIn = isNaN(ttl) ? GUEST_TTL_RANGE.min : Math.max(GUEST_TTL_RANGE.min, Math.min(parseInt(ttl, 10), GUEST_TTL_RANGE.max));
    } else {
        let start = moment.unix(_startTime);
        if (!start.isValid()) {
            start = moment();
        }
        startTime = moment.min(start, moment().add(1, "months")).toDate();
        expiresIn = isNaN(ttl) ? MEMBER_TTL_RANGE.min : Math.max(MEMBER_TTL_RANGE.min, Math.min(parseInt(ttl, 10), MEMBER_TTL_RANGE.max));
    }
    try {
        const id = yield create(content, expiresIn, startTime);
        if (!isGuest) {
            const userId = yield getUserIdByUsername(this.state.credentials.aud);
            yield addMessageIds(userId, id);
        }
        res.status = 201;
        res.body = {
            id
        };
    } catch (ex) {
        // TODO
        // logger ex
        doThrow(this, {
            statusCode: 500,
            message: SERVER_ERROR.message
        });
    }
});
apiRouter.delete("/messages/:id", authorize(), function* () {
    const { response: res } = this;
    const { id } = this.params;
    try {
        const userId = yield getUserIdByUsername(this.state.credentials.aud);
        yield removeMessageId(userId, id);
        yield remove(id);
        res.status = 200;
    } catch (ex) {
        // TODO
        // logger ex
        doThrow(this, {
            statusCode: 500,
            message: SERVER_ERROR.message
        });
    }
});

function api() {
    const a = apiRouter.routes();
    const b = apiRouter.allowedMethods();
    return function* (next) {
        return yield* a.call(this, b.call(this, next));
    };
}

const app = koa();

// mount /assets/
app.use(koaStatic(ASSETS_PATH));

// mount /v/{hash}
// mount /{GUEST_NAME}/{hash}
app.use(layout());

// mount /api/
app.use(api());

if (!module.parent) {
    prepare().then(() => {
        app.listen(PORT, HOST, function () {
            console.log(this.address());
            // started
        });
    }, (() => {
        var _ref = asyncToGenerator(function* (err) {
            console.error(err);
            yield shutdown();
            process.exit(1);
        });

        return function (_x) {
            return _ref.apply(this, arguments);
        };
    })());
}

module.exports = app;
