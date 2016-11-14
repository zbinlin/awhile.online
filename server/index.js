"use strict";

/* eslint require-yield: [0] */

import koa from "koa";
import Router from "koa-router";
import coParse from "co-body";
import koaStatic from "koa-static";
import validator from "validator";
import { prepare, shutdown } from "./prepare";
import * as store from "./store";
import * as user from"./user";
import { verifyToken } from "./jwt";
import moment from "moment";
import {
    HOST,
    PORT,
    GUEST_NAME,
    ASSETS_PATH,
    GUEST_TTL_RANGE,
    MEMBER_TTL_RANGE,
} from "../config";

const app = koa();

function doThrow(ctx, reason) {
    const { request: req, response: res } = ctx;
    res.status = reason.statusCode || 500;
    const body = Object.assign({}, reason, {
        statusCode: reason.statusCode || 500,
        message: reason.message,
    });
    if (req.accepts("json")) {
        res.body = body;
    } else {
        res.body = JSON.stringify(body, null, " ".repeat(4));
    }
}

function parseAuthorizatioHeader(ctx) {
    const request = ctx.request;
    const authorization = request.headers["authorization"];
    if (!authorization) {
        return null;
    }
    const [ scheme, token ] = authorization.split(/\s+/);
    return {
        scheme: scheme.trim(),
        token: token.trim(),
    };
}
async function checkTokenInRevocationList(token) {
    return await user.tokenInRevocationList(token);
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
                    statusCode: 412,
                });
            }
        }
        const { scheme, token } = auth;
        if (scheme.toLowerCase() !== "bearer") {
            if (passThrough) {
                return yield next;
            } else {
                return doThrow(ctx, {
                    statusCode: 401,
                });
            }
        }
        if (yield checkTokenInRevocationList(token)) {
            if (passThrough) {
                return yield next;
            } else {
                return doThrow(ctx, {
                    statusCode: 401,
                    message: "用户已登出",
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
                    message: "登录已过期",
                });
            }
        }
        return yield next;
    };
}

function checkLength(str, min, max) {
    const validity = {
        valid: true,
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
function checkEmail(email, max) {
    const validity = {
        valid: true,
    };
    // NOTE: email is optional
    if (email == null) {
        return validity;
    }
    if (!validator.isEmail(email)) {
        validity.valid = false;
        validity.typeMismatch = true;
    }
    return validity;
}
function validate(params) {
    const validities = {};
    validities.username = checkLength(params.username, 2, 32);
    validities.password = checkLength(params.password, 6, 128);
    validities.email = checkEmail(params.email, 128);
    if (validities.username.valid &&
        validities.password.valid &&
        validities.email.valid) {
        return true;
    } else {
        return validities;
    }
}

// mount /assets/
app.use(koaStatic(ASSETS_PATH));

// mount /v/{hash}
// mount /{GUEST_NAME}/{hash}
const messageRouter = new Router();
messageRouter.get([
    "/m/:id",
    `/${GUEST_NAME}/:id`,
], function* () {
    const { response: res } = this;
    const { id } = this.params;
    try {
        const content = yield store.get(id);
        res.status = 200;
        res.body = {
            content,
        };
    } catch (ex) {
        res.status = 404;
        res.body = {
        };
    }
});
app.use(messageRouter.routes()).use(messageRouter.allowedMethods());

// mount /api/
const apiRouter = new Router({
    prefix: "/api",
});
apiRouter.get("/", function* () {
    const apis = {
        "authentication": "/authentication",
        "users": "/users",
        "user": "/users/{:username}",
        "message": "/messages/{:id}",
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
        const expiresIn = (
            rememberMe ? moment.duration(1, "months")
                       : moment.duration(1, "days")
        ).asSeconds();
        const token = yield user.login(username, password, expiresIn);
        res.status = 200;
        res.body = {
            token,
        };
    } catch (ex) {
        // TODO
        // logger ex
        ex.statusCode = 400;
        ex.message = "用户名不存在或密码错误";
        doThrow(this, ex);
    }
});
apiRouter.delete("/authentication", authorize(), function* () {
    const { response: res } = this;
    const token = this.state.token;
    if (!token) {
        doThrow(this, {
            statusCode: 400,
            message: "用户未登录！",
        });
        return;
    }
    try {
        const result = user.logout(token);
        if (result) {
            res.status = 200;
        } else {
            doThrow(this, {
                statusCode: 400,
                message: "登录已过期！",
            });
        }
    } catch (ex) {
        // TODO logger ex
        console.log(ex);
        doThrow(this, {
            statusCode: 500,
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
    const result = validate(params);
    if (result !== true) {
        doThrow(this, {
            statusCode: 400,
            detail: result,
        });
        return;
    }
    try {
        const { username, password, email } = params;
        const exists = yield user.checkUsernameExists(username);
        if (exists) {
            doThrow(this, {
                statusCode: 400,
                detail: {
                    username: {
                        valid: false,
                        customError: true,
                        customErrorMessage: "the username is exists",
                    },
                },
            });
            return;
        }
        yield user.register(username, password, email);
        res.status = 201;
    } catch (ex) {
        console.log(ex);
        // TODO
        // logger ex
        doThrow(this, {
            statusCode: 500,
        });
    }
});
apiRouter.get("/users/:username", authorize(), function* () {
    const { response: res } = this;
    const { username } = this.params;
    let info;
    try {
        info = yield user.getUserInfo(username);
    } catch (ex) {
        // TODO
        // logger ex
        doThrow(this, {
            statusCode: 500,
        });
        return;
    }
    if (info) {
        res.status = 200;
        res.body = info;
    } else {
        doThrow(this, {
            statusCode: 404,
            message: "用户不存在！",
        });
    }
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
    const isGuest = !this.state.credentials;
    let startTime, expiresIn;
    const { content, ttl, startTime: _startTime } = params;
    if (isGuest) {
        startTime = new Date();
        expiresIn = isNaN(ttl) ? GUEST_TTL_RANGE.min
            : Math.max(GUEST_TTL_RANGE.min, Math.min(parseInt(ttl, 10), GUEST_TTL_RANGE.max));
    } else {
        let start = moment(_startTime);
        if (!start.isValid()) {
            start = moment();
        }
        startTime = moment.min(start, moment().add(1, "months")).toDate();
        expiresIn = isNaN(ttl) ? MEMBER_TTL_RANGE.min
            : Math.max(MEMBER_TTL_RANGE.min, Math.min(parseInt(ttl, 10), MEMBER_TTL_RANGE.max));
    }
    try {
        const id = store.create(content, expiresIn, startTime);
        res.status = 201;
        res.body = {
            id,
        };
    } catch (ex) {
        // TODO
        // logger ex
        doThrow(this, {
            statusCode: 500,
        });
    }
});
apiRouter.delete("/messages/:id", authorize(), function* () {
    const { response: res } = this;
    const { id } = this.params;
    try {
        const userId = yield user.getUserIdByUsername(this.state.credentials.aud);
        yield store.removeMessage(userId, id);
        yield store.remove(id);
        res.status = 200;
    } catch (ex) {
        // TODO
        // logger ex
        doThrow(this, {
            statusCode: 500,
        });
    }
});
app.use(apiRouter.routes()).use(apiRouter.allowedMethods());


export default app;
if (!module.parent) {
    prepare().then(() => {
        app.listen(PORT, HOST, function () {
            console.log(this.address());
            // started
        });
    }, async err => {
        console.error(err);
        await shutdown();
        process.exit(1);
    });
}
