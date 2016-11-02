"use strict";

import * as crypto from "crypto";
import jwt from "jsonwebtoken";
import {
    pgClient,
    redisClient,
} from "../db";
import {
    JWT_SECRET,
    PG_TN_USERS,
} from "../config";

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

/**
 * @param {string} username
 * @returns {number}
 */
export async function getUserIdByUsername(username) {
    const conn = await pgClient.connect();
    try {
        const result = conn.query(
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
        const result = conn.query(
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
 * @param {string} token
 * @returns {Object?}
 */
export async function getUserInfoByToken(token) {
    let decoded;
    try {
        decoded = await verifyToken(token);
    } catch (ex) {
        return null;
    }
    const username = decoded.adu;
    if (!username) {
        return null;
    }
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
        return null;
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
            `INSERT INTO ${PG_TN_USERS}(username, nickname, email, password, salt) VALUES($1, $2, $3, $4)`,
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

/**
 * @param {string} username
 * @param {string} password
 * @param {number} expiration
 * @returns {string?}
 */
export async function login(username, password, expiresIn) {
    username = username.toLowerCase();
    const conn = await pgClient.connect();
    let originPw, salt;
    try {
        const result = await conn.query(
            `SELECT password, salt FROM ${PG_TN_USERS} WHERE username = $1`,
            [username],
        );
        if (result.rows.length === 0) {
            return null;
        }
        ({ password: originPw, salt } = result.rows[0]);
    } catch (ex) {
        return null;
    } finally {
        conn.release();
    }
    const pw = toStr(encryptPassword(password, salt));
    if (pw !== originPw) {
        return null;
    }
    try {
        return signToken({
            aud: username,
        }, {
            expiresIn,
        });
    } catch (ex) {
        return null;
    }
}

/**
 * @param {string} token
 */
export async function logout(token) {
    let decoded;
    try {
        decoded = await verifyToken(token);
    } catch (ex) {
        return;
    }
    const expiresIn = decoded.exp - Math.floor(Date.now() / 1000);
    try {
        await redisClient.setAsync(
            [REDIS_JWT_PREFIX_KEY, token].join(":"), "", "EX", expiresIn,
        );
    } catch (ex) {
        return;
    }
}
