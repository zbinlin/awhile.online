"use strict";

import * as crypto from "crypto";
import {
    getTimeOffsetBy,
    getSameValueFromTimeInterval,
    encrypt,
    decrypt,
} from "muyun";
import {
    redisClient,
} from "./db";

const PREFIX_KEY = "awhile.online";
const REDIS_KEY_CONTENT = "content";
const REDIS_KEY_PASSPHRASE = "passphrase";
const REDIS_KEY_INTERVAL = "interval";
const REDIS_KEY_OFFSET = "offset";
const REDIS_KEY_ENABLED = "enabled";

const stringType = {
    serialize(val) {
        return val;
    },
    deserialize(val) {
        return val;
    },
};
const numberType = {
    serialize(val) {
        return String(val);
    },
    deserialize(val) {
        return Number(val);
    },
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
    },
};
const types = {
    [REDIS_KEY_CONTENT]: bufferType,
    [REDIS_KEY_PASSPHRASE]: bufferType,
    [REDIS_KEY_INTERVAL]: numberType,
    [REDIS_KEY_OFFSET]: numberType,
    [REDIS_KEY_ENABLED]: booleanType,
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

const generateStoreKey = generateRedisKey.bind(null, PREFIX_KEY);

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

async function write(content, passphrase, interval, offset, enabled = false) {
    const key = (await generateHash(content)).slice(0, 11);
    const val = [
        [REDIS_KEY_CONTENT, content],
        [REDIS_KEY_PASSPHRASE, passphrase],
        [REDIS_KEY_INTERVAL, interval],
        [REDIS_KEY_OFFSET, offset],
        [REDIS_KEY_ENABLED, enabled],
    ].map(([k, v]) => [generateStoreKey(key, k), serialize(k, v)]);
    await redisClient.msetAsync([].concat(...val));
    return key;
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
export async function create(content, interval, start = new Date()) {
    start = normalizeTime(start);
    const now = normalizeTime(new Date());
    const passphrase = await generatePassphrase();
    const offset = getTimeOffsetBy(interval, start);
    const salt = getSameValueFromTimeInterval(start, interval, offset);
    const crypted = await encrypt(content, passphrase, salt);
    return await write(crypted, passphrase, interval, offset, now >= start);
}

function remove(key) {
    return redisClient.delAsync([
        generateStoreKey(key, REDIS_KEY_CONTENT),
        generateStoreKey(key, REDIS_KEY_PASSPHRASE),
        generateStoreKey(key, REDIS_KEY_INTERVAL),
        generateStoreKey(key, REDIS_KEY_OFFSET),
        generateStoreKey(key, REDIS_KEY_ENABLED),
    ]);
}

function checkExists(key) {
    return redisClient.existsAsync(generateStoreKey(key, REDIS_KEY_CONTENT));
}

function updateFlag(key, enabled) {
    return redisClient.setAsync(
        generateStoreKey(key, REDIS_KEY_ENABLED),
        serialize(REDIS_KEY_ENABLED, enabled),
    );
}

async function read(key) {
    const keys = [
        REDIS_KEY_CONTENT,
        REDIS_KEY_PASSPHRASE,
        REDIS_KEY_INTERVAL,
        REDIS_KEY_OFFSET,
        REDIS_KEY_ENABLED,
    ];
    const result = await redisClient.mgetAsync(
        keys.map(suffix => generateStoreKey(key, suffix)),
    );
    return result.reduce((obj, val, idx) => {
        const key = keys[idx];
        obj[key] = deserialize(key, val);
        return obj;
    }, {});
}

/**
 * @param {string} key
 * @return {Buffer}
 */
export async function get(key) {
    const exists = await checkExists(key);
    if (!exists) throw new Error(`${key} is not exists`);
    const {
        content: crypted,
        passphrase,
        interval,
        offset,
        enabled,
    } = await read(key);

    const salt = getSameValueFromTimeInterval(new Date(), interval, offset);
    let content;
    try {
        content = await decrypt(crypted, passphrase, salt);
    } catch (ex) {
        if (enabled) {
            await remove(key);
            throw new Error(`${key} is expried`);
        }
        return null;
    }
    if (!enabled) {
        await updateFlag(key, !enabled);
    }
    return content;
}
