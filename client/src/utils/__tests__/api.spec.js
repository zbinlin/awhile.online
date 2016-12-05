"use strict";

/* eslint-env jest */

import {
    updateUserInfo,
    getUserInfo,
    postMessage,
    getMessageIds,
    removeMessage,
    register,
    login,
    logout,
} from "../api";
import * as customError from "../custom-error";
import "whatwg-fetch";
import {
    SESSION_KEY_USER_INFO,
    SESSION_KEY_MESSAGE_IDS,
    KEY_USER_TOKEN,
} from "../../constants";

const TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiJhZG1pbiJ9.zXc0vYXrxf5ee4hPHoewiMIO317dE1eJB2FAvN2Fges";

class Storage extends Map {
    getItem(key) {
        return this.get(key);
    }
    setItem(key, value) {
        return this.set(key, value);
    }
    removeItem(key) {
        return this.delete(key);
    }
    length() {
        return this.size;
    }
    key(idx) {
        return this.get([...this.keys()][idx]);
    }
}

beforeAll(() => {
    Object.defineProperty(window, "sessionStorage", {
        value: new Storage(),
        configurable: true,
    });
    Object.defineProperty(window, "localStorage", {
        value: new Storage(),
        configurable: true,
    });
});
afterAll(() => {
    delete window.sessionStorage;
    delete window.localStorage;
});

describe("test updateUserInfo api", () => {
    beforeEach(() => {
        window.sessionStorage.clear();
    });
    afterEach(() => {
        window.sessionStorage.clear();
    });
    it("should save to session storage", () => {
        const userInfo = {
            username: "admin",
        };
        updateUserInfo(userInfo);
        expect(window.sessionStorage.getItem(
            SESSION_KEY_USER_INFO,
        )).toBe(JSON.stringify(userInfo));
    });
});

describe("test getUserInfo api", () => {
    beforeEach(() => {
        window.sessionStorage.clear();
        window.localStorage.clear();
    });
    afterEach(() => {
        window.sessionStorage.clear();
        window.localStorage.clear();
    });
    it("should returns null that the user is not login", async () => {
        expect(await getUserInfo()).toBe(null);
    });
    it("should returns cached user information", async () => {
        const data = {
            username: "admin",
        };
        window.sessionStorage.setItem(SESSION_KEY_USER_INFO, JSON.stringify(data));
        expect(await getUserInfo()).toEqual(data);
    });
    describe("fetch remote data", () => {
        function createResponse(body = JSON.stringify({
            username: "admin",
        }), init) {
            const defaultOpt = {
                status: 200,
                headers: {
                    "Content-Type": "application/json",
                },
            };
            return new Response(body, Object.assign({}, defaultOpt, init));
        }
        var result = {};
        beforeEach(() => {
            result.response = createResponse();
            window.sessionStorage.setItem(KEY_USER_TOKEN, TOKEN);
            Object.defineProperty(window, "fetch", {
                value: jest.fn(async (...args) => result.response),
                writable: true,
                configurable: true,
            });
        });
        afterEach(() => {
            window.sessionStorage.clear();
            delete window.fetch;
            delete result.response;
        });
        it("should ignore cached", async () => {
            const data = {
                username: "tom",
            };
            const expected = {
                username: "admin",
            };
            window.sessionStorage.setItem(SESSION_KEY_USER_INFO, JSON.stringify(data));
            expect(await getUserInfo(true)).toEqual(expected);
            expect(JSON.parse(window.sessionStorage.getItem(SESSION_KEY_USER_INFO))).toEqual(expected);
        });
        it("should returns null that the token is invalid", async () => {
            window.sessionStorage.setItem(KEY_USER_TOKEN, "123");
            expect(await getUserInfo()).toBe(null);
        });
        it("should returns null that the fetch api throws FetchError", async () => {
            window.fetch = () => Promise.reject();
            expect(await getUserInfo()).toBe(null);
        });
        it("should returns user information", async () => {
            expect(await getUserInfo()).toEqual({
                username: "admin",
            });
            expect(window.sessionStorage.getItem(SESSION_KEY_USER_INFO)).toBe(JSON.stringify({
                username: "admin",
            }));
        });
        it("should returns null that the fetch api returns 401 (user is logout)", async () => {
            result.response = createResponse(null, {
                status: 401,
            });
            expect(await getUserInfo()).toBeNull();
        });
        it("should returns null that the fetch api returns 500", async () => {
            result.response = createResponse(null, {
                status: 500,
            });
            expect(await getUserInfo()).toBeNull();
        });
    });
});

describe("test postMessage api", () => {
    function createResponse(body = JSON.stringify({
        id: "1234567890",
    }), init) {
        const defaultOpt = {
            status: 200,
            headers: {
                "Content-Type": "application/json",
            },
        };
        return new Response(body, Object.assign({}, defaultOpt, init));
    }
    var result = {};
    beforeEach(() => {
        result.response = createResponse();
        Object.defineProperty(window, "fetch", {
            value: jest.fn(async (...args) => result.response),
            writable: true,
            configurable: true,
        });
    });
    afterEach(() => {
        delete window.fetch;
        delete result.response;
    });
    describe("post a message by anonymous", () => {
        it("should post success", async () => {
            const content = "test message";
            const startTime = Math.floor(Date.now() / 1000);
            const ttl = 30;
            const result = await postMessage(content, startTime, ttl);
            expect(window.fetch.mock.calls.length).toBe(1);
            expect(window.fetch.mock.calls[0][1].body).toBe(JSON.stringify({
                content,
                startTime,
                ttl,
            }));
            expect(result).toContain("/anonymous/1234567890");
        });
        it("should throws FetchError that fetch error", async () => {
            const content = "test message";
            const startTime = Math.floor(Date.now() / 1000);
            const ttl = 30;
            result.response = Promise.reject(new Error("error"));
            try {
                expect(await postMessage(content, startTime, ttl)).toBeUndefined();
            } catch (ex) {
                expect(ex).toBeInstanceOf(customError.FetchError);
            }
        });
        it("should throws ServerError that response status Code >= 500", async () => {
            const content = "test message";
            const startTime = Math.floor(Date.now() / 1000);
            const ttl = 30;
            result.response = createResponse(null, {
                status: 500,
            });
            try {
                expect(await postMessage(content, startTime, ttl)).toBeUndefined();
            } catch (ex) {
                expect(ex).toBeInstanceOf(customError.ServerError);
            }
        });
    });
    describe("post a message by logged in user", () => {
        beforeEach(() => {
            window.sessionStorage.setItem(KEY_USER_TOKEN, TOKEN);
        });
        afterEach(() => {
            window.sessionStorage.clear();
        });
        it("should post success", async () => {
            const content = "test message";
            const startTime = Math.floor(Date.now() / 1000);
            const ttl = 30;
            const result = await postMessage(content, startTime, ttl);
            expect(window.fetch.mock.calls.length).toBe(1);
            expect(window.fetch.mock.calls[0][1].headers["Authorization"]).toBe(`Bearer ${TOKEN}`);
            expect(window.fetch.mock.calls[0][1].body).toBe(JSON.stringify({
                content,
                startTime,
                ttl,
            }));
            expect(result).toContain("/m/1234567890");
        });
        it("should throws FetchError that fetch error", async () => {
            const content = "test message";
            const startTime = Math.floor(Date.now() / 1000);
            const ttl = 30;
            result.response = Promise.reject(new Error("error"));
            try {
                expect(await postMessage(content, startTime, ttl)).toBeUndefined();
            } catch (ex) {
                expect(ex).toBeInstanceOf(customError.FetchError);
            }
        });
        it("should throws ServerError that response status Code >= 500", async () => {
            const content = "test message";
            const startTime = Math.floor(Date.now() / 1000);
            const ttl = 30;
            result.response = createResponse(null, {
                status: 500,
            });
            try {
                expect(await postMessage(content, startTime, ttl)).toBeUndefined();
            } catch (ex) {
                expect(ex).toBeInstanceOf(customError.ServerError);
            }
        });
    });
});

describe("test getMessageIds api", () => {
    const defaultData = ["1234567890", "0123456789"];
    function createResponse(body = JSON.stringify(defaultData), init) {
        const defaultOpt = {
            status: 200,
            headers: {
                "Content-Type": "application/json",
            },
        };
        return new Response(body, Object.assign({}, defaultOpt, init));
    }
    var result = {};
    beforeEach(() => {
        result.response = createResponse();
        Object.defineProperty(window, "fetch", {
            value: jest.fn(async (...args) => result.response),
            writable: true,
            configurable: true,
        });
        window.sessionStorage.setItem(KEY_USER_TOKEN, TOKEN);
    });
    afterEach(() => {
        window.sessionStorage.clear();
        delete window.fetch;
        delete result.response;
    });
    it("should returns from cached", async () => {
        const data = ["123"];
        window.sessionStorage.setItem(SESSION_KEY_MESSAGE_IDS, JSON.stringify(data));
        expect(await getMessageIds()).toEqual(data);
    });
    it("should throws AuthError that the user is not login", async () => {
        window.sessionStorage.clear();
        try {
            await getMessageIds();
        } catch (ex) {
            expect(ex).toBeInstanceOf(customError.AuthError);
            return;
        }
        throw new Error("unexpect error");
    });
    it("should throws AuthError that the token is invalid", async () => {
        window.sessionStorage.setItem(KEY_USER_TOKEN, "ooo");
        try {
            await getMessageIds();
        } catch (ex) {
            expect(ex).toBeInstanceOf(customError.AuthError);
            return;
        }
        throw new Error("unexpect error");
    });
    it("should throws FetchError that fetch error", async () => {
        result.response = Promise.reject(new Error("error"));
        try {
            await getMessageIds();
        } catch (ex) {
            expect(ex).toBeInstanceOf(customError.FetchError);
            expect(ex.message).toBe("error");
            return;
        }
        throw new Error("unexpect error");
    });
    it("should returns message ids", async () => {
        const result = await getMessageIds();
        expect(window.fetch.mock.calls.length).toBe(1);
        expect(window.fetch.mock.calls[0][1].headers["Authorization"]).toContain(TOKEN);
        expect(result).toEqual(defaultData);
        expect(window.sessionStorage.getItem(SESSION_KEY_MESSAGE_IDS))
            .toBe(JSON.stringify(defaultData));
    });
    it("should ignore cached", async () => {
        const data = ["123"];
        window.sessionStorage.setItem(SESSION_KEY_MESSAGE_IDS, JSON.stringify(data));
        expect(await getMessageIds(true)).toEqual(defaultData);
        expect(JSON.parse(window.sessionStorage.getItem(SESSION_KEY_MESSAGE_IDS))).toEqual(defaultData);
    });
    it("should should AuthError that the token has been expired(statusCode = 401)", async () => {
        result.response = createResponse(null, {
            status: 401,
        });
        try {
            await getMessageIds();
        } catch (ex) {
            expect(ex).toBeInstanceOf(customError.AuthError);
            return;
        }
        throw new Error("unexpect error");
    });
    it("should should ServerError that response status >= 500", async () => {
        result.response = createResponse(null, {
            status: 500,
        });
        try {
            await getMessageIds();
        } catch (ex) {
            expect(ex).toBeInstanceOf(customError.ServerError);
            return;
        }
        throw new Error("unexpect error");
    });
});

describe("test removeMessage api", () => {
    function createResponse(body = null, init) {
        const defaultOpt = {
            status: 200,
        };
        return new Response(body, Object.assign({}, defaultOpt, init));
    }
    var result = {};
    const TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiJhZG1pbiJ9.zXc0vYXrxf5ee4hPHoewiMIO317dE1eJB2FAvN2Fges";
    beforeEach(() => {
        result.response = createResponse();
        Object.defineProperty(window, "fetch", {
            value: jest.fn(async (...args) => result.response),
            writable: true,
            configurable: true,
        });
        window.sessionStorage.setItem(KEY_USER_TOKEN, TOKEN);
        window.sessionStorage.setItem(SESSION_KEY_MESSAGE_IDS, "");
    });
    afterEach(() => {
        window.sessionStorage.clear();
        delete window.fetch;
        delete result.response;
    });
    it("should throws AuthError that the user is not login", async () => {
        window.sessionStorage.clear();
        try {
            await removeMessage("1234567890");
        } catch (ex) {
            expect(ex).toBeInstanceOf(customError.AuthError);
            return;
        }
        throw new Error("unexpect error");
    });
    it("should throws FetchError that fetch error", async () => {
        result.response = Promise.reject(new Error("error"));
        try {
            await removeMessage("1234567890");
        } catch (ex) {
            expect(ex).toBeInstanceOf(customError.FetchError);
            expect(ex.message).toBe("error");
            return;
        }
        throw new Error("unexpect error");
    });
    it("should delete message id success", async () => {
        const result = await removeMessage("1234567890");
        expect(window.fetch.mock.calls.length).toBe(1);
        expect(window.fetch.mock.calls[0][1].headers["Authorization"]).toContain(TOKEN);
        expect(result).toBe("1234567890");
    });
    it("should should AuthError that the token has been expired(statusCode = 401)", async () => {
        result.response = createResponse(null, {
            status: 401,
        });
        try {
            await removeMessage("1234567890");
        } catch (ex) {
            expect(ex).toBeInstanceOf(customError.AuthError);
            return;
        }
        throw new Error("unexpect error");
    });
    it("should should ServerError that response status >= 500", async () => {
        result.response = createResponse(null, {
            status: 500,
        });
        try {
            await removeMessage("0123456789");
        } catch (ex) {
            expect(ex).toBeInstanceOf(customError.ServerError);
            return;
        }
        throw new Error("unexpect error");
    });
});

describe("test register api", () => {
    function createResponse(body = null, init) {
        const defaultOpt = {
            status: 200,
        };
        return new Response(body, Object.assign({}, defaultOpt, init));
    }
    var result = {};
    beforeEach(() => {
        result.response = createResponse();
        Object.defineProperty(window, "fetch", {
            value: jest.fn(async (...args) => result.response),
            writable: true,
            configurable: true,
        });
    });
    afterEach(() => {
        delete window.fetch;
        delete result.response;
    });
    it("should throws FetchError that fetch error", async () => {
        result.response = Promise.reject(new Error("error"));
        try {
            await register("admin", "123456");
        } catch (ex) {
            expect(ex).toBeInstanceOf(customError.FetchError);
            expect(ex.message).toBe("error");
            return;
        }
        throw new Error("unexpect error");
    });
    it("should register success", async () => {
        await register("admin", "123456");
        expect(window.fetch.mock.calls.length).toBe(1);
        expect(window.fetch.mock.calls[0][1].body).toBe(JSON.stringify({
            username: "admin",
            password: "123456",
        }));
    });
    it("should throws RegisterError that the register information invalid", async () => {
        result.response = createResponse(JSON.stringify({
            message: "invalid",
            detail: {
                password: {
                    valueMissing: true,
                },
            },
        }), {
            status: 400,
        });
        try {
            await register("admin");
        } catch (ex) {
            expect(ex).toBeInstanceOf(customError.RegisterError);
            expect(ex.message).toBe("invalid");
            expect(ex.detail).toEqual({
                password: {
                    valueMissing: true,
                },
            });
            return;
        }
        throw new Error("unexpect error");
    });
});

describe("test login api", () => {
    function createResponse(body = JSON.stringify({
        token: TOKEN,
    }), init) {
        const defaultOpt = {
            status: 200,
        };
        return new Response(body, Object.assign({}, defaultOpt, init));
    }
    var result = {};
    beforeEach(() => {
        window.sessionStorage.clear();
        window.localStorage.clear();
        result.response = createResponse();
        Object.defineProperty(window, "fetch", {
            value: jest.fn(async (...args) => result.response),
            writable: true,
            configurable: true,
        });
    });
    afterEach(() => {
        window.sessionStorage.clear();
        window.localStorage.clear();
        delete window.fetch;
        delete result.response;
    });
    it("should throws FetchError that fetch error", async () => {
        result.response = Promise.reject(new Error("error"));
        try {
            await login("admin", "123456");
        } catch (ex) {
            expect(ex).toBeInstanceOf(customError.FetchError);
            expect(ex.message).toBe("error");
            return;
        }
        throw new Error("unexpect error");
    });
    it("should login success without remember login status", async () => {
        const result = await login("admin", "123456");
        expect(result).toBe(TOKEN);
        expect(window.sessionStorage.getItem(KEY_USER_TOKEN)).toBe(TOKEN);
        expect(window.localStorage.getItem(KEY_USER_TOKEN)).toBeUndefined();
    });
    it("should login success with remember login status", async () => {
        const result = await login("admin", "123456", true);
        expect(result).toBe(TOKEN);
        expect(window.sessionStorage.getItem(KEY_USER_TOKEN)).toBeUndefined();
        expect(window.localStorage.getItem(KEY_USER_TOKEN)).toBe(TOKEN);
    });
});

describe("test logout api", () => {
    function createResponse(body = JSON.stringify({
        TOKEN,
    }), init) {
        const defaultOpt = {
            status: 200,
        };
        return new Response(body, Object.assign({}, defaultOpt, init));
    }
    var result = {};
    beforeEach(() => {
        window.sessionStorage.clear();
        window.localStorage.clear();
        result.response = createResponse();
        Object.defineProperty(window, "fetch", {
            value: jest.fn(async (...args) => result.response),
            writable: true,
            configurable: true,
        });
        window.sessionStorage.setItem(KEY_USER_TOKEN, TOKEN);
        window.localStorage.setItem(KEY_USER_TOKEN, TOKEN);
    });
    afterEach(() => {
        window.sessionStorage.clear();
        window.localStorage.clear();
        delete window.fetch;
        delete result.response;
    });
    it("should throws AuthError that the user is not login", async () => {
        window.sessionStorage.clear();
        window.localStorage.clear();
        try {
            await logout();
        } catch (ex) {
            expect(ex).toBeInstanceOf(customError.AuthError);
            return;
        }
        throw new Error("unexpect error");
    });
    it("should logout success", async () => {
        await logout();
        expect(window.fetch.mock.calls.length).toBe(1);
        expect(window.fetch.mock.calls[0][1].headers["Authorization"]).toContain(TOKEN);
    });
});
