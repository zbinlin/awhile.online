"use strict";

/* eslint-env jest */

jest.mock("redis");
import {
    redisClient,
} from "../db";
import {
    create,
    get,
    remove,
    addMessageIds,
    getAllMessageId,
    removeAllMessageId,
    removeMessageId,
    removeMessageIds,
    checkInvalidMessageIds,
    __RewireAPI__ as $privates,
} from "../store";

const MSG_PREFIX_KEY = $privates.__GetDependency__("MSG_PREFIX_KEY");
const MSG_KEY_CONTENT = $privates.__GetDependency__("MSG_KEY_CONTENT");
const MSG_KEY_PASSPHRASE = $privates.__GetDependency__("MSG_KEY_PASSPHRASE");
const MSG_KEY_INTERVAL = $privates.__GetDependency__("MSG_KEY_INTERVAL");
const MSG_KEY_OFFSET = $privates.__GetDependency__("MSG_KEY_OFFSET");
const MSG_KEY_ENABLED = $privates.__GetDependency__("MSG_KEY_ENABLED");

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

    describe("test #checkExists function", () => {
        const checkExists = $privates.__GetDependency__("checkExists");
        const key = "foobar";
        beforeEach(async () => {
            await redisClient.msetAsync([
                [MSG_PREFIX_KEY, key, MSG_KEY_CONTENT].join(":"), "123",
                [MSG_PREFIX_KEY, key, MSG_KEY_PASSPHRASE].join(":"), "123",
                [MSG_PREFIX_KEY, key, MSG_KEY_INTERVAL].join(":"), 123,
                [MSG_PREFIX_KEY, key, MSG_KEY_OFFSET].join(":"), 0,
                [MSG_PREFIX_KEY, key, MSG_KEY_ENABLED].join(":"), Number(true),
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
                [MSG_PREFIX_KEY, key, MSG_KEY_CONTENT].join(":"), "123",
                [MSG_PREFIX_KEY, key, MSG_KEY_PASSPHRASE].join(":"), "123",
                [MSG_PREFIX_KEY, key, MSG_KEY_INTERVAL].join(":"), 123,
                [MSG_PREFIX_KEY, key, MSG_KEY_OFFSET].join(":"), 0,
                [MSG_PREFIX_KEY, key, MSG_KEY_ENABLED].join(":"), Number(true),
            ]);
        });
        afterEach(async () => {
            await redisClient.flushdbAsync();
        });
        it("returns OK", async () => {
            expect(await updateFlag(key, Number(false))).toBe("OK");
            expect(await redisClient.getAsync([
                MSG_PREFIX_KEY, key, MSG_KEY_ENABLED,
            ].join(":"))).toBe(0);
        });
    });

    describe("test #read function", () => {
        const read = $privates.__GetDependency__("read");
        const key = "foobar";
        beforeEach(async () => {
            await redisClient.msetAsync([
                [MSG_PREFIX_KEY, key, MSG_KEY_CONTENT].join(":"), Buffer.from("123").toString("hex"),
                [MSG_PREFIX_KEY, key, MSG_KEY_PASSPHRASE].join(":"), Buffer.from("123").toString("hex"),
                [MSG_PREFIX_KEY, key, MSG_KEY_INTERVAL].join(":"), 123,
                [MSG_PREFIX_KEY, key, MSG_KEY_OFFSET].join(":"), 0,
                [MSG_PREFIX_KEY, key, MSG_KEY_ENABLED].join(":"), Number(true),
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

describe("test remove function", () => {
    const key = "foobar";
    beforeEach(async () => {
        await redisClient.msetAsync([
            [MSG_PREFIX_KEY, key, MSG_KEY_CONTENT].join(":"), "123",
            [MSG_PREFIX_KEY, key, MSG_KEY_PASSPHRASE].join(":"), "123",
            [MSG_PREFIX_KEY, key, MSG_KEY_INTERVAL].join(":"), 123,
            [MSG_PREFIX_KEY, key, MSG_KEY_OFFSET].join(":"), 0,
            [MSG_PREFIX_KEY, key, MSG_KEY_ENABLED].join(":"), Number(true),
        ]);
    });
    afterEach(async () => {
        await redisClient.flushdbAsync();
    });
    it("returns a Promise object and remove special key", async () => {
        const result = remove(key);
        expect(result).toBeInstanceOf(Promise);
        expect(await result).toBe(true);
        expect(await redisClient.mgetAsync([
            [MSG_PREFIX_KEY, key, MSG_KEY_CONTENT].join(":"),
            [MSG_PREFIX_KEY, key, MSG_KEY_PASSPHRASE].join(":"),
            [MSG_PREFIX_KEY, key, MSG_KEY_INTERVAL].join(":"),
            [MSG_PREFIX_KEY, key, MSG_KEY_OFFSET].join(":"),
            [MSG_PREFIX_KEY, key, MSG_KEY_ENABLED].join(":"),
        ])).toEqual([null, null, null, null, null]);
    });
});

describe("test addMessageIds function", () => {
    const userId = 0;
    const messageId = "hxhxhxhxhxhx";
    afterEach(async () => {
        await removeAllMessageId(userId);
    });
    it("should returns number of added message id", async () => {
        const result = await addMessageIds(userId, messageId);
        expect(result).toBe(1);
    });
    it("should returns 0 when the message id already exists", async () => {
        await addMessageIds(userId, messageId);
        const result = await addMessageIds(userId, messageId);
        expect(result).toBe(0);
    });
});

describe("test getAllMessageId function", () => {
    const userId = 0;
    const messageIds = ["hxhxhxhxhxhx", "xxxxxxxxxx"];
    beforeEach(async () => {
        await addMessageIds(userId, ...messageIds);
    });
    afterEach(async () => {
        await removeAllMessageId(userId);
    });
    it("should returns all exists message id", async () => {
        const result = await getAllMessageId(userId);
        expect(result.length).toBe(messageIds.length);
        expect(result).toEqual(messageIds);
    });
    it("should returns empty when the user id does not exists", async () => {
        const result = await getAllMessageId(1);
        expect(result.length).toBe(0);
    });
});

describe("test removeAllMessageId function", () => {
    const userId = 0;
    const messageIds = ["hxhxhxhxhxhx", "xxxxxxxxxx"];
    beforeEach(async () => {
        await addMessageIds(userId, ...messageIds);
    });
    afterEach(async () => {
        await removeAllMessageId(userId);
    });
    it("should remove all message id", async () => {
        const result = await removeAllMessageId(userId);
        expect(result).toBe(true);
    });
    it("should return false when the user id does not exists", async () => {
        const result = await removeAllMessageId(1);
        expect(result).toBe(false);
    });
});

describe("test removeMessageId function", () => {
    const userId = 0;
    const messageIds = ["hxhxhxhxhxhx", "xxxxxxxxxx"];
    beforeEach(async () => {
        await addMessageIds(userId, ...messageIds);
    });
    afterEach(async () => {
        await removeAllMessageId(userId);
    });
    it("should remove special message id", async () => {
        const result = await removeMessageId(userId, "hxhxhxhxhxhx");
        expect(result).toBe(1);
        expect(await getAllMessageId(userId)).toEqual(["xxxxxxxxxx"]);
    });
    it("should return 0 when remove a message id or user id that do not exists", async () => {
        const result = await removeMessageId(userId, "123");
        expect(result).toBe(0);
        const result1 = await removeMessageId(1, "hxhxhxhxhxhx");
        expect(result1).toBe(0);
    });
});

describe("test removeMessageIds function", () => {
    const userId = 0;
    const messageIds = ["hxhxhxhxhxhx", "xxxxxxxxxx"];
    beforeEach(async () => {
        await addMessageIds(userId, messageIds);
    });
    afterEach(async () => {
        await removeAllMessageId(userId);
    });
    it("should remove multiple message id", async () => {
        const result = await removeMessageIds(userId, "hxhxhxhxhxhx", "xxxxxxxxxx");
        expect(result).toBe(2);
    });
});

describe("test checkInvalidMessageIds function", () => {
    const contents = ["hxhxhxhxhxhx", "xxxxxxxxxx", "yyy"];
    const keys = [];
    beforeEach(async () => {
        for (const ct of contents) {
            keys.push(await create(ct, 60));
        }
    });
    afterEach(async () => {
        for (const id of keys) {
            await remove(id);
        }
    });
    it("", async () => {
        const [valid, invalid] = await checkInvalidMessageIds(
            ["123", keys[0], keys[2]],
        );
        expect(valid.length).toBe(2);
        expect(invalid.length).toBe(1);
        expect(valid).toEqual([keys[0], keys[2]]);
        expect(invalid).toEqual(["123"]);
    });
});
