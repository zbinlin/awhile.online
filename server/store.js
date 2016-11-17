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
    },
};
const booleanType = {
    serialize(val) {
        return String(Number(val));
    },
    deserialize(val) {
        return Boolean(Number(val));
    },
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
    [MSG_KEY_CONTENT]: bufferType,
    [MSG_KEY_PASSPHRASE]: bufferType,
    [MSG_KEY_INTERVAL]: numberType,
    [MSG_KEY_OFFSET]: numberType,
    [MSG_KEY_ENABLED]: booleanType,
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

async function write(content, passphrase, interval, offset, enabled = false) {
    const key = (await generateHash(content)).slice(0, 11);
    const val = [
        [MSG_KEY_CONTENT, content],
        [MSG_KEY_PASSPHRASE, passphrase],
        [MSG_KEY_INTERVAL, interval],
        [MSG_KEY_OFFSET, offset],
        [MSG_KEY_ENABLED, enabled],
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

/**
 * @param {string} key
 * @return {boolean}
 */
export async function remove(key) {
    const result = await redisClient.delAsync([
        generateStoreKey(key, MSG_KEY_CONTENT),
        generateStoreKey(key, MSG_KEY_PASSPHRASE),
        generateStoreKey(key, MSG_KEY_INTERVAL),
        generateStoreKey(key, MSG_KEY_OFFSET),
        generateStoreKey(key, MSG_KEY_ENABLED),
    ]);
    return result === 5;
}

function checkExists(key) {
    return redisClient.existsAsync(generateStoreKey(key, MSG_KEY_CONTENT));
}

function updateFlag(key, enabled) {
    return redisClient.setAsync(
        generateStoreKey(key, MSG_KEY_ENABLED),
        serialize(MSG_KEY_ENABLED, enabled),
    );
}

async function read(key) {
    const keys = [
        MSG_KEY_CONTENT,
        MSG_KEY_PASSPHRASE,
        MSG_KEY_INTERVAL,
        MSG_KEY_OFFSET,
        MSG_KEY_ENABLED,
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


function genKeyByUserId(userId) {
    return [USER_MSG_PREFIX_KEY, userId, USER_MES_SUFFIX_KEY].join(":");
}

/**
 * @param {number} userId
 * @param {string} messageId
 * @param {...string} messageIds
 */
export async function addMessageIds(userId, messageId, ...messageIds) {
    return await redisClient.saddAsync(
        genKeyByUserId(userId),
        messageId,
        ...messageIds,
    );
}

/**
 * @param {number} userId
 * @returns {string[]}
 */
export async function getAllMessageId(userId) {
    return await redisClient.smembersAsync(genKeyByUserId(userId));
}

/**
 * @param {number} userId
 */
export async function removeAllMessageId(userId) {
    const result = await redisClient.delAsync(genKeyByUserId(userId));
    return result === 1;
}

/**
 * @param {number} userId
 * @param {string} messageId
 */
export async function removeMessageId(userId, messageId) {
    return await removeMessageIds(userId, messageId);
}

/**
 * @param {number} userId
 * @param {string} messageId
 * @param {...string} messageIds
 * @return {number} - number of removed message ids
 */
export async function removeMessageIds(userId, messageId, ...messageIds) {
    const result = await redisClient.sremAsync(
        genKeyByUserId(userId),
        messageId,
        ...messageIds,
    );
    return result;
}

/**
 * @param {string[]} messageIds
 */
export async function checkInvalidMessageIds(messageIds) {
    const valid = [];
    const invalid = [];
    for (const id of messageIds) {
        if (await checkExists(id)) {
            valid.push(id);
        } else {
            invalid.push(id);
        }
    }
    return [valid, invalid];
}
