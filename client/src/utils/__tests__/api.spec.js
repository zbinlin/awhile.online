"use strict";

/* eslint-env jest */

import {
    updateUserInfo,
    getUserInfo,
    postMessage,
    getMesssageIds,
    removeMessage,
    register,
    login,
    logout,
    __RewireAPI__,
} from "../api";
import * as customError from "../custom-error";
import "whatwg-fetch";


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
            messageIds: [],
        };
        updateUserInfo(userInfo);
        expect(window.sessionStorage.getItem(
            __RewireAPI__.__GetDependency__("SESSION_KEY_USER_INFO")
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
        window.sessionStorage.setItem(
            __RewireAPI__.__GetDependency__("SESSION_KEY_USER_INFO"),
            JSON.stringify(data),
        );
        expect(await getUserInfo()).toEqual(data);
    });
    describe("fetch remote data", () => {
        const KEY = __RewireAPI__.__GetDependency__("USER_TOKEN_KEY");
        const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiJhZG1pbiJ9.zXc0vYXrxf5ee4hPHoewiMIO317dE1eJB2FAvN2Fges";
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
            window.sessionStorage.setItem(KEY, token);
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
        it("should returns null that the token is invalid", async () => {
            window.sessionStorage.setItem(KEY, "123");
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
            expect(window.sessionStorage.getItem(__RewireAPI__.__GetDependency__(
                "SESSION_KEY_USER_INFO"
            ))).toBe(JSON.stringify({
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
            expect(result).toBe("1234567890");
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
        const KEY = __RewireAPI__.__GetDependency__("USER_TOKEN_KEY");
        const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiJhZG1pbiJ9.zXc0vYXrxf5ee4hPHoewiMIO317dE1eJB2FAvN2Fges";
        beforeEach(() => {
            window.sessionStorage.setItem(KEY, token);
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
            expect(window.fetch.mock.calls[0][1].headers["Authorization"]).toBe(`Bearer ${token}`);
            expect(window.fetch.mock.calls[0][1].body).toBe(JSON.stringify({
                content,
                startTime,
                ttl,
            }));
            expect(result).toBe("1234567890");
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

describe("test getMesssageIds api", () => {
    function createResponse(body = JSON.stringify([
        "1234567890", "0123456789",
    ]), init) {
        const defaultOpt = {
            status: 200,
            headers: {
                "Content-Type": "application/json",
            },
        };
        return new Response(body, Object.assign({}, defaultOpt, init));
    }
    var result = {};
    const KEY = __RewireAPI__.__GetDependency__("USER_TOKEN_KEY");
    const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiJhZG1pbiJ9.zXc0vYXrxf5ee4hPHoewiMIO317dE1eJB2FAvN2Fges";
    beforeEach(() => {
        result.response = createResponse();
        Object.defineProperty(window, "fetch", {
            value: jest.fn(async (...args) => result.response),
            writable: true,
            configurable: true,
        });
        window.sessionStorage.setItem(KEY, token);
    });
    afterEach(() => {
        window.sessionStorage.clear();
        delete window.fetch;
        delete result.response;
    });
    it("should throws AuthError that the user is not login", async () => {
        window.sessionStorage.clear();
        try {
            await getMesssageIds();
        } catch (ex) {
            expect(ex).toBeInstanceOf(customError.AuthError);
            return;
        }
        throw new Error("unexpect error");
    });
    it("should throws AuthError that the token is invalid", async () => {
        window.sessionStorage.setItem(KEY, "ooo");
        try {
            await getMesssageIds();
        } catch (ex) {
            expect(ex).toBeInstanceOf(customError.AuthError);
            return;
        }
        throw new Error("unexpect error");
    });
    it("should throws FetchError that fetch error", async () => {
        result.response = Promise.reject(new Error("error"));
        try {
            await getMesssageIds();
        } catch (ex) {
            expect(ex).toBeInstanceOf(customError.FetchError);
            expect(ex.message).toBe("error");
            return;
        }
        throw new Error("unexpect error");
    });
    it("should returns message ids", async () => {
        const result = await getMesssageIds();
        expect(window.fetch.mock.calls.length).toBe(1);
        expect(window.fetch.mock.calls[0][1].headers["Authorization"]).toContain(token);
        expect(result).toEqual(["1234567890", "0123456789"]);
    });
    it("should should AuthError that the token has been expired(statusCode = 401)", async () => {
        result.response = createResponse(null, {
            status: 401,
        });
        try {
            await getMesssageIds();
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
            await getMesssageIds();
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
    const KEY = __RewireAPI__.__GetDependency__("USER_TOKEN_KEY");
    const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiJhZG1pbiJ9.zXc0vYXrxf5ee4hPHoewiMIO317dE1eJB2FAvN2Fges";
    beforeEach(() => {
        result.response = createResponse();
        Object.defineProperty(window, "fetch", {
            value: jest.fn(async (...args) => result.response),
            writable: true,
            configurable: true,
        });
        window.sessionStorage.setItem(KEY, token);
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
        const result = await removeMessage();
        expect(window.fetch.mock.calls.length).toBe(1);
        expect(window.fetch.mock.calls[0][1].headers["Authorization"]).toContain(token);
        expect(result).toBeUndefined();
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
    const KEY = __RewireAPI__.__GetDependency__("USER_TOKEN_KEY");
    const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiJhZG1pbiJ9.zXc0vYXrxf5ee4hPHoewiMIO317dE1eJB2FAvN2Fges";
    function createResponse(body = JSON.stringify({
        token,
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
        expect(result).toBe(token);
        expect(window.sessionStorage.getItem(KEY)).toBe(token);
        expect(window.localStorage.getItem(KEY)).toBeUndefined();
    });
    it("should login success with remember login status", async () => {
        const result = await login("admin", "123456", true);
        expect(result).toBe(token);
        expect(window.sessionStorage.getItem(KEY)).toBeUndefined();
        expect(window.localStorage.getItem(KEY)).toBe(token);
    });
});

describe("test logout api", () => {
    const KEY = __RewireAPI__.__GetDependency__("USER_TOKEN_KEY");
    const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiJhZG1pbiJ9.zXc0vYXrxf5ee4hPHoewiMIO317dE1eJB2FAvN2Fges";
    function createResponse(body = JSON.stringify({
        token,
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
        window.sessionStorage.setItem(KEY, token);
        window.localStorage.setItem(KEY, token);
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
        expect(window.fetch.mock.calls[0][1].headers["Authorization"]).toContain(token);
    });
});
