"use strict";

/* eslint-env jest */

jest.mock("redis");
import {
    redisClient,
} from "../db";
import {
    create,
    get,
    __RewireAPI__ as $privates,
} from "../store";

const PREFIX_KEY = $privates.__GetDependency__("PREFIX_KEY");
const REDIS_KEY_CONTENT = $privates.__GetDependency__("REDIS_KEY_CONTENT");
const REDIS_KEY_PASSPHRASE = $privates.__GetDependency__("REDIS_KEY_PASSPHRASE");
const REDIS_KEY_INTERVAL = $privates.__GetDependency__("REDIS_KEY_INTERVAL");
const REDIS_KEY_OFFSET = $privates.__GetDependency__("REDIS_KEY_OFFSET");
const REDIS_KEY_ENABLED = $privates.__GetDependency__("REDIS_KEY_ENABLED");

describe("test @private functions", () => {
    describe("test #generatePassphrase function", () => {
        const generatePassphrase = $privates.__GetDependency__("generatePassphrase");
        it("returns a Promise object", async () => {
            const result = generatePassphrase();
            expect(result).toBeInstanceOf(Promise);
            await result;
        });
        it("returns a Buffer in the Promise", async () => {
            const buf = await generatePassphrase();
            expect(buf).toBeInstanceOf(Buffer);
            expect(buf.length).toBe(128);
        });
    });

    describe("test #generateHash function", () => {
        const generateHash = $privates.__GetDependency__("generateHash");
        it("returns a Promise object", async () => {
            const result = generateHash();
            expect(result).toBeInstanceOf(Promise);
            await result;
        });
        it("returns a hash string in the Promise", async () => {
            const str = "123456";
            const expectedHash = "e10adc3949ba59abbe56e057f20f883e";
            expect(await generateHash(str)).toBe(expectedHash);
        });
    });

    describe("test #write function", () => {
        const write = $privates.__GetDependency__("write");
        afterEach(async () => {
            await redisClient.flushdbAsync();
        });
        it("is an async function and returns a Promise object", async () => {
            const result = write("", "123456", 10, 0);
            expect(result).toBeInstanceOf(Promise);
            await result;
        });
    });

    describe("test #remove function", () => {
        const remove = $privates.__GetDependency__("remove");
        const key = "foobar";
        beforeEach(async () => {
            await redisClient.msetAsync([
                [PREFIX_KEY, key, REDIS_KEY_CONTENT].join(":"), "123",
                [PREFIX_KEY, key, REDIS_KEY_PASSPHRASE].join(":"), "123",
                [PREFIX_KEY, key, REDIS_KEY_INTERVAL].join(":"), 123,
                [PREFIX_KEY, key, REDIS_KEY_OFFSET].join(":"), 0,
                [PREFIX_KEY, key, REDIS_KEY_ENABLED].join(":"), Number(true),
            ]);
        });
        afterEach(async () => {
            await redisClient.flushdbAsync();
        });
        it("returns a Promise object and remove special key", async () => {
            const result = remove(key);
            expect(result).toBeInstanceOf(Promise);
            expect(await result).toBe(5);
            expect(await redisClient.mgetAsync([
                [PREFIX_KEY, key, REDIS_KEY_CONTENT].join(":"),
                [PREFIX_KEY, key, REDIS_KEY_PASSPHRASE].join(":"),
                [PREFIX_KEY, key, REDIS_KEY_INTERVAL].join(":"),
                [PREFIX_KEY, key, REDIS_KEY_OFFSET].join(":"),
                [PREFIX_KEY, key, REDIS_KEY_ENABLED].join(":"),
            ])).toEqual([null, null, null, null, null]);
        });
    });

    describe("test #checkExists function", () => {
        const checkExists = $privates.__GetDependency__("checkExists");
        const key = "foobar";
        beforeEach(async () => {
            await redisClient.msetAsync([
                [PREFIX_KEY, key, REDIS_KEY_CONTENT].join(":"), "123",
                [PREFIX_KEY, key, REDIS_KEY_PASSPHRASE].join(":"), "123",
                [PREFIX_KEY, key, REDIS_KEY_INTERVAL].join(":"), 123,
                [PREFIX_KEY, key, REDIS_KEY_OFFSET].join(":"), 0,
                [PREFIX_KEY, key, REDIS_KEY_ENABLED].join(":"), Number(true),
            ]);
        });
        afterEach(async () => {
            await redisClient.flushdbAsync();
        });
        it("returns true if the key exists", async () => {
            expect(await checkExists(key)).toBeTruthy();
        });
        it("returns false if the key doesn't exists", async () => {
            expect(await checkExists("123456")).toBeFalsy();
        });
    });

    describe("test #updateFlag function", () => {
        const updateFlag = $privates.__GetDependency__("updateFlag");
        const key = "foobar";
        beforeEach(async () => {
            await redisClient.msetAsync([
                [PREFIX_KEY, key, REDIS_KEY_CONTENT].join(":"), "123",
                [PREFIX_KEY, key, REDIS_KEY_PASSPHRASE].join(":"), "123",
                [PREFIX_KEY, key, REDIS_KEY_INTERVAL].join(":"), 123,
                [PREFIX_KEY, key, REDIS_KEY_OFFSET].join(":"), 0,
                [PREFIX_KEY, key, REDIS_KEY_ENABLED].join(":"), Number(true),
            ]);
        });
        afterEach(async () => {
            await redisClient.flushdbAsync();
        });
        it("returns OK", async () => {
            expect(await updateFlag(key, Number(false))).toBe("OK");
            expect(await redisClient.getAsync([
                PREFIX_KEY, key, REDIS_KEY_ENABLED,
            ].join(":"))).toBe(0);
        });
    });

    describe("test #read function", () => {
        const read = $privates.__GetDependency__("read");
        const key = "foobar";
        beforeEach(async () => {
            await redisClient.msetAsync([
                [PREFIX_KEY, key, REDIS_KEY_CONTENT].join(":"), Buffer.from("123").toString("hex"),
                [PREFIX_KEY, key, REDIS_KEY_PASSPHRASE].join(":"), Buffer.from("123").toString("hex"),
                [PREFIX_KEY, key, REDIS_KEY_INTERVAL].join(":"), 123,
                [PREFIX_KEY, key, REDIS_KEY_OFFSET].join(":"), 0,
                [PREFIX_KEY, key, REDIS_KEY_ENABLED].join(":"), Number(true),
            ]);
        });
        afterEach(async () => {
            await redisClient.flushdbAsync();
        });
        it("returns an object by a key", async () => {
            const result = read(key);
            expect(result).toBeInstanceOf(Promise);
            expect(await result).toEqual({
                content: Buffer.from("123"),
                passphrase: Buffer.from("123"),
                interval: 123,
                offset: 0,
                enabled: true,
            });
        });
    });
});

describe("test create function", () => {
    it("returns a hash key", async () => {
        const content = "123";
        const interval = 10;
        expect((await create(content, interval)).length).toBe(11);
    });
});

describe("test get function", () => {
    const remove = $privates.__GetDependency__("remove");
    it("returns content by key", async () => {
        const key = await create("123", 30);
        const result = await get(key);
        expect(result).toBe("123");
        await remove(key);
    });
    it("throws a Error when the key is not exists", async () => {
        try {
            await get("12345678901");
        } catch (ex) {
            expect(ex).toBeInstanceOf(Error);
            return;
        }
        throw new Error();
    });
    it("throws a Error when the key is expried", async () => {
        const key = await create("123", 1);
        await new Promise((resolve, reject) => {
            setTimeout(resolve, 2000);
        });
        try {
            await get(key);
        } catch (ex) {
            expect(ex).toBeInstanceOf(Error);
            return;
        } finally {
            remove(key);
        }
        throw new Error();
    });
    it("returns null when the key is not yet come into effect", async () => {
        const key = await create("123", 10, Math.floor((Date.now() + 10000) / 1000));
        expect(await get(key)).toBe(null);
        await remove(key);
    });
});
