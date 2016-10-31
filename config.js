"use strict";

import * as url from "url";

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

export {
    PG_CONFIG,
    REDIS_URL,
};
