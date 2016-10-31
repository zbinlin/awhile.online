"use strict";

import pg from "pg";
import redis from "redis";
import promisify from "promise-adapter";
import {
    PG_CONFIG,
    REDIS_URL,
} from "../config";

function promisifyAll(obj) {
    let keys = Object.keys(obj).filter(key => typeof obj[key] === "function");
    for (let key of keys) {
        if (!key.endsWith("Async")) {
            obj[`${key}Async`] = function () {
                return promisify(obj[key], this)(...[...arguments]);
            };
        }
    }
}
promisifyAll(redis.RedisClient.prototype);
promisifyAll(redis.Multi.prototype);

export const pgClient = new pg.Pool(PG_CONFIG);
export const redisClient = redis.createClient(REDIS_URL);
