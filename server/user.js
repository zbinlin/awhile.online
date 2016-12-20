"use strict";

import * as crypto from "crypto";
import {
    signToken,
    verifyToken,
} from "./jwt";
import {
    pgClient,
    redisClient,
} from "./db";
import {
    PG_TN_USERS,
    PASSWORD_MAX_RETRY_TIMES,
    PASSWORD_LIMIT_RETRY_DURATION,
} from "../config";

const REDIS_PASSWORD_RETRY = "password:retry";
const REDIS_JWT_SECRET_KEY = "jwt:secret";
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
export async function getUserIdByUsername(username) {
    const conn = await pgClient.connect();
    try {
        const result = await conn.query(
            `SELECT id FROM ${PG_TN_USERS} WHERE username = $1`,
            [username],
        );
        if (result.rows.length > 0) {
            return result.rows[0].id;
        } else {
            throw new Error(`username ${username} is not exists`);
        }
    } catch (ex) {
        throw ex;
    } finally {
        conn.release();
    }
}

/**
 * @param {number} userId
 * @returns {string}
 */
export async function getUsernameByUserId(userId) {
    const conn = await pgClient.connect();
    try {
        const result = await conn.query(
            `SELECT username FROM ${PG_TN_USERS} WHERE id = $1`,
            [userId],
        );
        if (result.rows.length > 0) {
            return result.rows[0].username;
        } else {
            throw new Error(`userId ${userId} is not exists`);
        }
    } catch (ex) {
        throw ex;
    } finally {
        conn.release();
    }
}

/**
 * @param {string} username
 * @returns {Object?}
 */
export async function getUserInfo(username) {
    const conn = await pgClient.connect();
    try {
        const result = await conn.query(
            `SELECT id, username, nickname, email FROM ${PG_TN_USERS} WHERE username = $1`,
            [username.toLowerCase()],
        );
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
}

/**
 * @param {string} username
 * @returns {boolean}
 */
export async function checkUsernameExists(username) {
    const conn = await pgClient.connect();
    try {
        const result = await conn.query(
            `SELECT username FROM ${PG_TN_USERS} WHERE username = $1`,
            [username.toLowerCase()],
        );
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
}

/**
 * @param {string} username
 * @param {string} password
 * @param {string} [email]
 * @returns {boolean}
 */
export async function register(username, password, email = null) {
    const conn = await pgClient.connect();
    const salt = await generateSalt();
    const encryptedPw = await encryptPassword(password, salt);
    try {
        const result = await conn.query(
            `INSERT INTO ${PG_TN_USERS}(username, nickname, email, password, salt) VALUES($1, $2, $3, $4, $5)`,
            [username.toLowerCase(), username, email, toStr(encryptedPw), toStr(salt)],
        );
        return result.rowCount === 1;
    } catch (ex) {
        throw ex;
    } finally {
        conn.release();
    }
}

/**
 * @param {number} userId
 * @returns {boolean}
 */
export async function cancel(userId) {
    const conn = await pgClient.connect();
    try {
        /*
         * 如果 userId 存在，并删除成功，返回 rowCount === 1，
         * 如果 userId 不存在，返回 rowCount === 0
         */
        const result = await conn.query(
            `DELETE FROM ${PG_TN_USERS} WHERE id = $1`,
            [userId],
        );
        return result.rowCount === 1;
    } catch (ex) {
        throw ex;
    } finally {
        conn.release();
    }
}

/**
 * @param {number} userId
 * @returns {boolean}
 */
export async function changePassword(userId, password) {
    const conn = await pgClient.connect();
    const salt = await generateSalt();
    const encryptedPw = await encryptPassword(password, salt);
    try {
        const result = await conn.query(
            `UPDATE ${PG_TN_USERS} SET password = $2, salt = $3 WHERE id = $1`,
            [userId, toStr(encryptedPw), toStr(salt)],
        );
        return result.rowCount === 1;
    } catch (ex) {
        throw ex;
    } finally {
        conn.release();
    }
}

/**
 * @param {number} userId
 * @param {string} email
 * @returns {boolean}
 */
export async function changeEmail(userId, email) {
    const conn = await pgClient.connect();
    try {
        const result = await conn.query(
            `UPDATE ${PG_TN_USERS} SET email = $2 WHERE id = $1`,
            [userId, email],
        );
        return result.rowCount === 1;
    } catch (ex) {
        throw ex;
    } finally {
        conn.release();
    }
}

/**
 * @param {number} userId
 * @param {string} nickname
 * @returns {boolean}
 */
export async function changeNickname(userId, nickname) {
    const conn = await pgClient.connect();
    try {
        const result = await conn.query(
            `UPDATE ${PG_TN_USERS} SET nickname = $2 WHERE id = $1`,
            [userId, nickname],
        );
        return result.rowCount === 1;
    } catch (ex) {
        throw ex;
    } finally {
        conn.release();
    }
}

function getRedisPRKey(username) {
    return [REDIS_PASSWORD_RETRY, username].join(":");
}

/**
 * @private
 * @param {string} username
 * @return {number}
 */
async function getPasswordRetryByUsername(username) {
    const key = getRedisPRKey(username);
    const result = Number(await redisClient.getAsync(key));
    if (Number.isNaN(result)) {
        return 0;
    } else {
        return result;
    }
}

/**
 * @private
 * @param {string} username
 */
async function countPasswordRetryByUsername(username) {
    const key = getRedisPRKey(username);
    try {
        return await redisClient.multi()
            .incr(key)
            .expire(key, PASSWORD_LIMIT_RETRY_DURATION)
            .execAsync();
    } catch (ex) {
        console.error(ex);
        return await redisClient.setAsync(key, 0, PASSWORD_LIMIT_RETRY_DURATION);
    }
}

/**
 * @private
 * @param {string} username
 */
async function clearPasswordRetryByUsername(username) {
    const key = getRedisPRKey(username);
    return await redisClient.delAsync(key);
}

/**
 * @param {string} username
 * @param {string} password
 * @param {number} expiration
 * @returns {string}
 */
export async function login(username, password, expiresIn) {
    username = username.toLowerCase();
    const retry =  await getPasswordRetryByUsername(username);
    if (retry >= PASSWORD_MAX_RETRY_TIMES) {
        throw new Error("You enter the wrong password too many times");
    }
    const conn = await pgClient.connect();
    let originPw, salt;
    try {
        const result = await conn.query(
            `SELECT password, salt FROM ${PG_TN_USERS} WHERE username = $1`,
            [username],
        );
        if (result.rows.length === 0) {
            throw new Error("username is not exists!");
        }
        ({ password: originPw, salt } = result.rows[0]);
    } catch (ex) {
        throw ex;
    } finally {
        conn.release();
    }
    const pw = toStr(await encryptPassword(password, salt));
    if (pw !== originPw) {
        await countPasswordRetryByUsername(username);
        throw new Error("password incorrect!");
    } else {
        await clearPasswordRetryByUsername(username);
    }
    try {
        const jti = await generateJTIKey();
        const secret = await generateJTIValue();
        await saveSecretByJTI(jti, secret, expiresIn);
        return await signToken({
            aud: username,
            jti: jti,
        }, secret, {
            expiresIn,
        });
    } catch (ex) {
        throw ex;
    }
}

/**
 * @param {string} token
 */
export async function logout(token) {
    if (!token) {
        return;
    }
    try {
        const secret = await getSecretByToken(token);
        await verifyToken(token, secret);
    } catch (ex) {
        return;
    }
    return await removeSecretByToken(token);
}


/**
 * @deprecated
 * @param {string} token
 */
export async function tokenInRevocationList(token) {
    return await redisClient.existsAsync(
        [REDIS_JWT_PREFIX_KEY, token].join(":"),
    );
}

/**
 * @return {string}
 */
async function generateJTIKey() {
    return new Promise(resolve => {
        crypto.randomBytes(16, (err, buf) => {
            if (err) {
                const buf = Buffer.alloc(16);
                let cursor = 0;
                cursor = buf.write(
                    ("000000000000" + Date.now().toString(16)).slice(-12),
                    "hex",
                );
                cursor = buf.writeUInt32BE(
                    Math.floor(Math.random() * Math.pow(2, 32)),
                    cursor,
                );
                cursor = buf.writeUInt32BE(
                    Math.floor(Math.random() * Math.pow(2, 32)),
                    cursor,
                );
                buf.writeUInt16BE(
                    Math.floor(Math.random() * Math.pow(2, 16)),
                    cursor,
                );
                resolve(buf.toString("hex"));
            } else {
                resolve(buf.toString("hex"));
            }
        });
    });
}

/**
 * @private
 * @return {Buffer}
 */
async function generateJTIValue() {
    return new Promise(resolve => {
        const length = 64;
        crypto.randomBytes(length, (err, buf) => {
            if (err) {
                const buf = Buffer.alloc(length);
                let cursor = 0;
                const MAX = Math.pow(2, 32);
                while ((cursor = buf.writeUInt32BE(
                    Math.floor(Math.random() * MAX), cursor)) < length);
                resolve(buf);
            } else {
                resolve(buf);
            }
        });
    });
}

function getRedisJTIKey(jti) {
    return [REDIS_JWT_SECRET_KEY, jti].join(":");
}

async function getSecretByJTI(jti) {
    const result = await redisClient.getAsync(getRedisJTIKey(jti));
    if (result) {
        return Buffer.from(result, "hex");
    }
}
/**
 * @param {string} jti
 * @param {Buffer} secret
 * @param {number} expiresIn
 */
async function saveSecretByJTI(jti, secret, expiresIn) {
    if (Buffer.isBuffer(secret)) {
        secret = secret.toString("hex");
    }
    return await redisClient.setAsync(
        getRedisJTIKey(jti), secret, "EX", expiresIn,
    );
}
async function removeSecretByJTI(jti) {
    return await redisClient.delAsync(getRedisJTIKey(jti));
}

/**
 * @private
 * @param {string} token
 * @return {string} jti
 */
function getJTIFromToken(token) {
    try {
        const payload = token.split(".")[1];
        if (payload === undefined) {
            return;
        }
        const json = JSON.parse(Buffer.from(payload, "base64").toString());
        return json.jti;
    } catch (ex) {
        // empty
    }
}

/**
 * 根据 token 中的 jti 获取 redis 里的 jwt secret
 * @public
 * @param {string} token
 * @return {Buffer}
 * @throw
 */
export async function getSecretByToken(token) {
    const jti = getJTIFromToken(token);
    if (!jti) {
        throw new Error("invalid token");
    }
    const secret = await getSecretByJTI(jti);
    if (!secret) {
        throw new Error("jwt secret is not exists");
    } else {
        return secret;
    }
}

/**
 * 根据 token 中的 jti 移除 redis 里的 jwt secret
 * @public
 * @param {string} token
 */
export async function removeSecretByToken(token) {
    const jti = getJTIFromToken(token);
    if (!jti) {
        return;
    }
    try {
        return await removeSecretByJTI(jti);
    } catch (ex) {
        // empty
    }
}
