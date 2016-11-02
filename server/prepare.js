"use strict";

import * as assert from "assert";
import {
    pgClient,
    redisClient,
} from "./db";
import {
    PG_TN_USERS,
} from "../config";

async function checkRedis() {
    const key = String(Math.random());
    assert.equal(await redisClient.setAsync(key, key), "OK");
    assert.equal(await redisClient.getAsync(key), key);
    assert.equal(await redisClient.delAsync(key), 1);
}

async function checkUsersTable() {
    const conn = await pgClient.connect();
    try {
        const result = await conn.query(`
            SELECT column_name, data_type, character_maximum_length
            FROM INFORMATION_SCHEMA.COLUMNS
            WHERE table_name = '${PG_TN_USERS}'
        `);
        if (result.rows.length === 0) {
            throw new Error(`table ${PG_TN_USERS} is not exists`);
        }
    } catch (ex) {
        throw ex;
    } finally {
        conn.release();
    }
}

async function checkDb() {
    await checkUsersTable();
}

async function prepare() {
    await checkRedis();
    await checkDb();
}

async function shutdown() {
    await redisClient.quitAsync();
    await pgClient.end();
}

export {
    prepare,
    shutdown,
};
