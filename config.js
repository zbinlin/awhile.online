"use strict";

import * as path from "path";
import * as url from "url";
import moment from "moment";

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
    max: moment.duration(5, "days").asSeconds(),
};
const MEMBER_TTL_RANGE = {
    min: moment.duration(1, "minutes").asSeconds(),
    max: moment.duration(1, "months").asSeconds(),
};

export {
    PG_CONFIG,
    REDIS_URL,
    JWT_SECRET,
    PG_TN_USERS,
    PORT,
    HOST,
    GUEST_NAME,
    ASSETS_PATH,
    GUEST_TTL_RANGE,
    MEMBER_TTL_RANGE,
    MANIFEST_PATH,
};
