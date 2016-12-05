"use strict";

import {
    ClientError,
    ServerError,
    FetchError,
    FetchParseBodyError,
    AuthError,
    UnknowError,
    LoginError,
    PostMessageError,
    RegisterError,
} from "./custom-error";
import {
    SESSION_KEY_USER_INFO,
    SESSION_KEY_MESSAGE_IDS,
    KEY_USER_TOKEN,
} from "../constants";

const MESSAGE_ENDPOINT = "/api/messages";
const USER_INFO_ENDPOINT = "/api/users";
const USER_AUTH_ENDPOINT = "/api/authentication";

function getToken() {
    if (sessionStorage.has(KEY_USER_TOKEN)) {
        return sessionStorage.getItem(KEY_USER_TOKEN);
    } else if (localStorage.has(KEY_USER_TOKEN)) {
        return localStorage.getItem(KEY_USER_TOKEN);
    } else {
        return null;
    }
}
function clearToekn() {
    if(sessionStorage.has(KEY_USER_TOKEN)) {
        sessionStorage.removeItem(KEY_USER_TOKEN);
    } else {
        localStorage.removeItem(KEY_USER_TOKEN);
    }
}
function clearUserInfo() {
    sessionStorage.removeItem(SESSION_KEY_USER_INFO);
    sessionStorage.removeItem(SESSION_KEY_MESSAGE_IDS);
}

function saveToken(token, isRemember) {
    if (isRemember) {
        localStorage.setItem(KEY_USER_TOKEN, token);
    } else {
        sessionStorage.setItem(KEY_USER_TOKEN, token);
    }
}

function getUserInfoFromLocal() {
    try {
        if (sessionStorage.has(SESSION_KEY_USER_INFO)) {
            return JSON.parse(sessionStorage.getItem(SESSION_KEY_USER_INFO));
        }
    } catch (ex) {
        // TODO logger
    }
}
//function setUserInfoToLocal(info) {
//    try {
//        sessionStorage.setItem(SESSION_KEY_USER_INFO, JSON.stringify(info));
//    } catch (ex) {
//        // empty
//    }
//}

function getMessageIdsFromLocal() {
    try {
        if (sessionStorage.has(SESSION_KEY_MESSAGE_IDS)) {
            return JSON.parse(sessionStorage.getItem(SESSION_KEY_MESSAGE_IDS));
        }
    } catch (ex) {
        // TODO logger
    }
}
function setMessageIdsToLocal(ids) {
    try {
        sessionStorage.setItem(SESSION_KEY_MESSAGE_IDS, JSON.stringify(ids));
    } catch (ex) {
        // empty
    }
}

function getMessageFromBody(body) {
    if (body && typeof body === "object") {
        if (body.message) {
            return body.message;
        } else {
            return JSON.stringify(body, null, "  ");
        }
    } else {
        return body;
    }
}

function getUsernameFromToken(token) {
    return JSON.parse(atob(token.split(".")[1])).aud;
}

/**
 * @param {string} token
 * @return {Object} - userInfo
 * @throws {AuthError} - 用户未登录或已登出
 * @throws {FetchError} - fetch 出错，一般是超时或无网络连接等
 * @throws {FetchParseBodyError} - parse response.body 时出错
 * @throws {ClientError} - 客户端错误
 * @throws {ServerError} - 服务端内部错误
 */
async function getUserInfoByToken(token) {
    let username;
    try {
        username = getUsernameFromToken(token);
    } catch (ex) {
        throw new AuthError;
    }
    let response;
    try {
        response = await fetch(`${USER_INFO_ENDPOINT}/${username}`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Accept": "application/json",
            },
        });
    } catch (ex) {
        throw new FetchError(ex.message);
    }
    let body;
    try {
        if (/\bjson\b/i.test(response.headers.get("Content-Type"))) {
            body = await response.json();
        } else {
            body = await response.text();
        }
    } catch (ex) {
        throw new FetchParseBodyError(ex.message);
    }

    if (response.ok) {
        return body;
    } else if (response.status === 401) {
        throw new AuthError(getMessageFromBody(body));
    } else if (response.status >= 400 && response.status < 500) {
        throw new ClientError(getMessageFromBody(body));
    } else if (response.status >= 500) {
        throw new ServerError(getMessageFromBody(body) || response.statusText);
    }
}

export async function updateUserInfo(info) {
    sessionStorage.setItem(SESSION_KEY_USER_INFO, JSON.stringify(info));
}

/**
 * @param {boolean} [ignoreCache = false]
 * @return {Object?}
 */
export async function getUserInfo(ignoreCache = false) {
    if (!ignoreCache) {
        const result = getUserInfoFromLocal();
        if (result) {
            return result;
        }
    }

    const token = getToken();
    if (!token) {
        return null;
    }

    let userInfo;
    try {
        userInfo = await getUserInfoByToken(token);
    } catch (ex) {
        if (ex instanceof AuthError) {
            clearToekn();
        }
        return null;
    }
    if (!userInfo) {
        return null;
    }

    try {
        sessionStorage.setItem(SESSION_KEY_USER_INFO, JSON.stringify(userInfo));
    } catch (ex) {
        // TODO logger
    }
    return userInfo;
}

export async function updatePassword(oldPassword, newPassword) {
    // TODO
}
export async function updateNickName(nickname) {
    // TODO
}
export async function updateEmail(email) {
    // TODO
}

/**
 * @param {string} content
 * @param {number} startTime
 * @param {number} ttl
 * @return {string} - link
 * @throws {FetchError} - fetch 出错，一般是超时或无网络连接等
 * @throws {FetchParseBodyError} - parse response.body 时出错
 * @throws {ServerError} - 服务端内部错误
 * @throws {Error} - 其他错误
 */
export async function postMessage(content, startTime, ttl) {
    const token = getToken();
    const headers = {
        "Accept": "application/json",
        "Content-Type": "application/json",
    };
    if (token) {
        headers["Authorization"] = `Bearer ${token}`;
    }
    let response;
    try {
        response = await fetch(`${MESSAGE_ENDPOINT}`, {
            method: "POST",
            headers,
            body: JSON.stringify({
                content,
                startTime,
                ttl,
            }),
        });
    } catch (ex) {
        throw new FetchError(ex.message);
    }
    if (response.ok) {
        try {
            const { id } = await response.json();
            return `https://awhile.online/${token ? "m" : "anonymous"}/${id}`;
        } catch (ex) {
            throw new FetchParseBodyError(ex.message);
        }
    }
    let body;
    try {
        body = await response.json();
    } catch (ex) {
        // TODO logger
    }
    if (response.status === 400 && body.detail) {
        throw new PostMessageError(body.message, body.detail);
    } else if (response.status >= 400 && response.status < 500) {
        throw new ClientError(getMessageFromBody(body));
    }
    if (response.status >= 500) {
        throw new ServerError(getMessageFromBody(body));
    }
    throw new Error(getMessageFromBody(body));
}

/**
 * @param {boolean} [ignoreCache = false]
 * @return {string[]} - ids
 * @throws {AuthError} - 用户未登录或已登出
 * @throws {FetchError} - fetch 出错，一般是超时或无网络连接等
 * @throws {FetchParseBodyError} - parse response.body 时出错
 * @throws {ServerError} - 服务端内部错误
 * @throws {UnknowError} - 其他错误
 */
export async function getMessageIds(ignoreCache = false) {
    if (!ignoreCache) {
        const result = getMessageIdsFromLocal();
        if (result) {
            return result;
        }
    }

    const token = getToken();
    if (!token) {
        throw new AuthError("用户已登出！");
    }
    let username;
    try {
        username = getUsernameFromToken(token);
    } catch (ex) {
        clearToekn();
        throw new AuthError("用户已登出！");
    }
    let response;
    try {
        response = await fetch(`${USER_INFO_ENDPOINT}/${username}/messages`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Accept": "application/json",
            },
        });
    } catch (ex) {
        throw new FetchError(ex.message);
    }
    if (response.ok) {
        let result;
        try {
            result = await response.json();
        } catch (ex) {
            throw new FetchParseBodyError(ex.message);
        }
        try {
            sessionStorage.setItem(
                SESSION_KEY_MESSAGE_IDS,
                JSON.stringify(result),
            );
        } catch (ex) {
            // TODO logger
        }
        return result;
    }
    let body;
    try {
        body = await response.json();
    } catch (ex) {
        // TODO logger
    }
    if (response.status >= 400 && response.status < 500) {
        clearToekn();
        throw new AuthError(getMessageFromBody(body));
    } else if (response.status >= 500) {
        throw new ServerError(getMessageFromBody(body));
    } else {
        throw new UnknowError(getMessageFromBody(body));
    }
}

/**
 * @param {string} id
 * @throws {AuthError} - 用户未登录或已登出
 * @throws {FetchError} - fetch 出错，一般是超时或无网络连接等
 * @throws {FetchParseBodyError} - parse response.body 时出错
 * @throws {ServerError} - 服务端内部错误
 * @throws {UnknowError} - 其他错误
 */
export async function removeMessage(id) {
    const token = getToken();
    if (!token) {
        throw new AuthError("用户已登出！");
    }
    let response;
    try {
        response = await fetch(`${MESSAGE_ENDPOINT}/${id}`, {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Accept": "javascript/json",
            },
        });
    } catch (ex) {
        throw new FetchError(ex.message);
    }
    if (response.ok) {
        const ids = getMessageIdsFromLocal();
        if (ids) {
            const idx = ids.indexOf(id);
            if (idx > -1) {
                ids.splice(idx, 1);
                setMessageIdsToLocal(idx);
            }
        }
        return id;
    }
    let body;
    try {
        body = await response.json();
    } catch (ex) {
        // TODO logger
    }
    if (response.status === 401) {
        throw new AuthError(getMessageFromBody(body));
    } else if (response.status >= 500) {
        throw new ServerError(getMessageFromBody(body));
    } else {
        throw new UnknowError(getMessageFromBody(body));
    }
}

/**
 * @param {string} username
 * @param {string} password
 * @param {email} [email]
 * @throws {FetchError} - fetch 出错，一般是超时或无网络连接等
 * @throws {ServerError} - 服务端内部错误
 * @throws {UnknowError} - 其他错误
 * @throws {RegisterError} - 注册出错
 */
export async function register(username, password, email) {
    let response;
    try {
        response = await fetch(USER_INFO_ENDPOINT, {
            method: "POST",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                username,
                password,
                email,
            }),
        });
    } catch (ex) {
        throw new FetchError(ex.message);
    }
    if (response.ok) {
        return;
    }
    let body;
    try {
        body = await response.json();
    } catch (ex) {
        // TODO logger
    }
    if (response.status === 400) {
        throw new RegisterError(body.message, body.detail);
    } else if (response.status >= 500) {
        throw new ServerError(getMessageFromBody(body));
    } else {
        throw new UnknowError(getMessageFromBody(body));
    }
}

/**
 * 如果登录失败，将抛出异常
 * @param {string} username
 * @param {string} password
 * @param {boolean} isRemember
 * @throws {FetchError} - fetch 出错，一般是超时或无网络连接等
 * @throws {LoginError} - 登录出错
 */
export async function login(username, password, isRemember) {
    let response;
    try {
        response = await fetch(USER_AUTH_ENDPOINT, {
            method: "POST",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                username,
                password,
                rememberMe: isRemember,
            }),
        });
    } catch (ex) {
        throw new FetchError(ex.message);
    }
    if (response.ok) {
        const { token } = await response.json();
        try {
            saveToken(token, isRemember);
        } catch (ex) {
            // TODO logger
        }
        return token;
    } else {
        const { message } = await response.json();
        throw new LoginError(message);
    }
}

/**
 * @throws {AuthError} - 用户未登录或已登出
 */
export async function logout() {
    const token = getToken();
    if (!token) {
        throw new AuthError("用户已登出！");
    }
    try {
        clearToekn();
        clearUserInfo();
    } catch (ex) {
        // empty
    }
    await fetch(USER_AUTH_ENDPOINT, {
        method: "DELETE",
        headers: {
            "Authorization": `Bearer ${token}`,
        },
    });
}
