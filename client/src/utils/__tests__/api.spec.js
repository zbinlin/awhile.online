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

describe("test updateUserInfo api", () => {
    beforeAll(() => {
        const sessionStorage = {
            getItem: jest.fn(),
            setItem: jest.fn(),
            removeItem: jest.fn(),
        };
        Object.defineProperty(window, "sessionStorage", {
            get() {
                return sessionStorage;
            },
            configurable: true,
        });
    });
    afterAll(() => {
        delete window.sessionStorage;
    });
    beforeEach(() => {
        sessionStorage.getItem.mockReset();
        sessionStorage.setItem.mockReset();
        sessionStorage.removeItem.mockReset();
    });
    afterEach(() => {
        sessionStorage.getItem.mockReset();
        sessionStorage.setItem.mockReset();
        sessionStorage.removeItem.mockReset();
    });
    it("should save to session storage", () => {
        const userInfo = {
            username: "admin",
            messageIds: [],
        };
        updateUserInfo(userInfo);
        expect(sessionStorage.setItem.mock.calls.length).toBe(1);
    });
});

describe("test getUserInfo api", () => {
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
    beforeEach(() => {
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
        const result = Object.create({
            response: {
                status: 200,
                ok: true,
                headers: new Map([["Content-Type", "application/json"]]),
                async json() {
                    return {
                        username: "admin",
                    };
                },
            },
        });
        beforeEach(() => {
            window.sessionStorage.setItem(KEY, token);
            Object.defineProperty(window, "fetch", {
                value: jest.fn(async (...args) => result.response),
                writable: true,
                configurable: true,
            });
        });
        afterEach(() => {
            window.sessionStorage.removeItem(KEY);
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
        });
        it("should returns null that the fetch api returns 401 (user is logout)", async () => {
            result.response = Object.assign(result.response, {
                ok: false,
                status: 401,
            });
            expect(await getUserInfo()).toBeNull();
        });
        it("should returns null that the fetch api returns 500", async () => {
            result.response = Object.assign(result.response, {
                ok: false,
                status: 500,
            });
            expect(await getUserInfo()).toBeNull();
        });
    });
});

describe("test postMessage api", () => {
    it();
});

describe("test getMesssageIds api", () => {
    it();
});

describe("test removeMessage api", () => {
    it();
});

describe("test register api", () => {
    it();
});

describe("test login api", () => {
    it();
});

describe("test logout api", () => {
    it();
});
