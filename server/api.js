"use strict";

import moment from "moment";
import coParse from "co-body";
import Router from "koa-router";
import { validateRegister, validateMessage } from "../isomorphic/validate";
import * as store from "./store";
import * as user from"./user";
import { verifyToken } from "./jwt";
import * as ERROR from "../isomorphic/error";
import {
    GUEST_TTL_RANGE,
    MEMBER_TTL_RANGE,
} from "../config";

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

function abortIfUsernameInvalid(ctx, username) {
    if (!ctx.state.credentials || ctx.state.credentials.aud !== username) {
        doThrow(ctx, {
            statusCode: 400,
            message: ERROR.USERNAME_AND_TOKEN_NOT_MATCH.message,
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
    const [ scheme, token ] = authorization.split(/\s+/);
    return {
        scheme: scheme.trim(),
        token: token.trim(),
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
        try {
            const secret = yield user.getSecretByToken(token);
            ctx.state.credentials = yield verifyToken(token, secret);
            ctx.state.token = token;
        } catch (ex) {
            if (!passThrough) {
                return doThrow(ctx, {
                    statusCode: 401,
                    message: ERROR.USER_TOKEN_HAS_EXPIRED.message,
                });
            }
            console.log(token, ex);
        }
        return yield next;
    };
}

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
        ex.message = ERROR.USERNAME_OR_PASSWORD_INCORRECT.message;
        doThrow(this, ex);
    }
});
apiRouter.delete("/authentication", authorize(), function* () {
    const { response: res } = this;
    const token = this.state.token;
    if (!token) {
        doThrow(this, {
            statusCode: 401,
            message: ERROR.USER_NOT_LOGGED_IN.message,
        });
        return;
    }
    try {
        const result = yield user.logout(token);
        if (result) {
            res.status = 200;
        } else {
            doThrow(this, {
                statusCode: 401,
                message: ERROR.USER_LOGGED_OUT.message,
            });
        }
    } catch (ex) {
        // TODO logger ex
        console.log(ex);
        doThrow(this, {
            statusCode: 500,
            message: ERROR.SERVER_ERROR.message,
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
                        customErrorMessage: ERROR.USERNAME_IS_EXISTS.message,
                    },
                },
            });
            return;
        }
        yield user.register(username, password, email);
        res.status = 201;
    } catch (ex) {
        // TODO
        // logger ex
        doThrow(this, {
            statusCode: 500,
            message: ERROR.SERVER_ERROR.message,
        });
    }
});
apiRouter.get("/users/:username", authorize(), function* () {
    const { response: res } = this;
    const { username } = this.params;
    if (username !== this.state.credentials.aud) {
        doThrow(this, {
            statusCode: 400,
            message: ERROR.USERNAME_AND_TOKEN_NOT_MATCH.message,
        });
        return;
    }
    let info;
    try {
        info = yield user.getUserInfo(username);
    } catch (ex) {
        // TODO
        // logger ex
        doThrow(this, {
            statusCode: 500,
            message: ERROR.SERVER_ERROR.message,
        });
        return;
    }
    if (info) {
        res.status = 200;
        res.body = {
            username,
            nickname: info.nickname,
            email: info.email,
        };
    } else {
        doThrow(this, {
            statusCode: 404,
            message: ERROR.USER_IS_NOT_EXISTS.message,
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
        id = yield user.getUserIdByUsername(username);
    } catch (ex) {
        if (ex.message.includes("is not exists")) {
            doThrow(this, {
                statusCode: 404,
                message: ERROR.USER_IS_NOT_EXISTS.message,
            });
        } else {
            // TODO logger
            doThrow(this, {
                statusCode: 500,
                message: ERROR.SERVER_ERROR.message,
            });
        }
        return;
    }
    const messageIds = yield store.getAllMessageId(id);
    const [valid, invalid] = yield store.checkInvalidMessageIds(messageIds);
    if (invalid.length) {
        yield store.removeMessageIds(id, ...invalid);
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
            detail: result,
        });
        return;
    }

    const { content, ttl, startTime: _startTime } = params;
    const isGuest = !this.state.credentials;
    let startTime, expiresIn;

    if (isGuest) {
        startTime = new Date();
        expiresIn = isNaN(ttl) ? GUEST_TTL_RANGE.min
            : Math.max(GUEST_TTL_RANGE.min, Math.min(parseInt(ttl, 10), GUEST_TTL_RANGE.max));
    } else {
        let start = moment.unix(_startTime);
        if (!start.isValid()) {
            start = moment();
        }
        startTime = moment.min(start, moment().add(1, "months")).toDate();
        expiresIn = isNaN(ttl) ? MEMBER_TTL_RANGE.min
            : Math.max(MEMBER_TTL_RANGE.min, Math.min(parseInt(ttl, 10), MEMBER_TTL_RANGE.max));
    }
    try {
        const id = yield store.create(content, expiresIn, startTime);
        if (!isGuest) {
            const userId = yield user.getUserIdByUsername(this.state.credentials.aud);
            yield store.addMessageIds(userId, id);
        }
        res.status = 201;
        res.body = {
            id,
        };
    } catch (ex) {
        // TODO
        // logger ex
        doThrow(this, {
            statusCode: 500,
            message: ERROR.SERVER_ERROR.message,
        });
    }
});
apiRouter.delete("/messages/:id", authorize(), function* () {
    const { response: res } = this;
    const { id } = this.params;
    try {
        const userId = yield user.getUserIdByUsername(this.state.credentials.aud);
        yield store.removeMessageId(userId, id);
        yield store.remove(id);
        res.status = 200;
    } catch (ex) {
        // TODO
        // logger ex
        doThrow(this, {
            statusCode: 500,
            message: ERROR.SERVER_ERROR.message,
        });
    }
});

export default function api() {
    const a = apiRouter.routes();
    const b = apiRouter.allowedMethods();
    return function* (next) {
        return yield* a.call(this, b.call(this, next));
    };
}
