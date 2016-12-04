"use strict";

let errno = 1024;
const wrap = (src) => {
    const dst = Object.create(null);
    Object.assign(dst, src, {
        errno: errno++,
    });
    return Object.freeze(dst);
};

export const NETWORK_NO_CONNECTION = wrap({
    code: "NETWORK_NO_CONNECTION",
    message: "无网络连接",
});

export const SERVER_ERROR = wrap({
    code: "SERVER_ERROR",
    message: "服务器内部发生错误",
});

export const USERNAME_OR_PASSWORD_INCORRECT = wrap({
    code: "USERNAME_OR_PASSWORD_INCORRECT",
    message: "用户名或密码错误",
});

export const USERNAME_AND_TOKEN_NOT_MATCH = wrap({
    code: "USERNAME_AND_TOKEN_NOT_MATCH",
    message: "用户名和 Token 不一致",
});

export const USERNAME_IS_EXISTS = wrap({
    code: "USERNAME_IS_EXISTS",
    message: "用户名已存在",
});

export const USER_IS_NOT_EXISTS = wrap({
    code: "USERNAME_IS_EXISTS",
    message: "用户不存在",
});

export const USER_TOKEN_HAS_EXPIRED = wrap({
    code: "USER_TOKEN_HAS_EXPIRED",
    message: "用户的 Token 已过期",
});

export const USER_NOT_LOGGED_IN = wrap({
    code: "USER_NOT_LOGGED_IN",
    message: "用户未登录",
});

export const USER_LOGGED_OUT = wrap({
    code: "USER_LOGGED_OUT",
    message: "用户已登出",
});
