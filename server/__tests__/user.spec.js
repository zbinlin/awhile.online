"use strict";

/* eslint-env jest */

jest.mock("redis");
import {
    redisClient,
} from "../db";

import {
    getSecretByToken,
    removeSecretByToken,
    __RewireAPI__ as $privates,
} from "../user";

const REDIS_JWT_SECRET_KEY = $privates.__GetDependency__("REDIS_JWT_SECRET_KEY");

describe("test private method about jti", () => {
    describe("test getRedisJTIKey function", () => {
        const getRedisJTIKey = $privates.__GetDependency__("getRedisJTIKey");
        it("equal", () => {
            const jti = "2d796fbd16e06fdd519924c8cbd2242f";
            expect(getRedisJTIKey(jti)).toBe([
                REDIS_JWT_SECRET_KEY, jti,
            ].join(":"));
        });
    });

    describe("test getSecretByJTI function", () => {
        const getSecretByJTI = $privates.__GetDependency__("getSecretByJTI");
        const jti = "2d796fbd16e06fdd519924c8cbd2242f";
        const expected = Buffer.from("ac94e67f95cdd87788042f00797ee5622371867b96b9abf8ed06ddafcc0bd8207b51ddedeea3bd9777f004ee4dde370dfdadce62fec7cc6f32789bce4c3b789a", "hex");
        beforeAll(() => {
            redisClient.set(
                `${REDIS_JWT_SECRET_KEY}:${jti}`,
                expected.toString("hex"),
            );
        });
        afterAll(() => {
            redisClient.del(`${REDIS_JWT_SECRET_KEY}:${jti}`);
        });
        it("returns secret buffer", async () => {
            const result = await getSecretByJTI(jti);
            expect(result).toEqual(expected);
        });
        it("returns undefined when not exists secret", async () => {
            const result = await getSecretByJTI("123");
            expect(result).toBeUndefined();
        });
    });

    describe("test saveSecretByJTI function", () => {
        const saveSecretByJTI = $privates.__GetDependency__("saveSecretByJTI");
        it("returns OK", async () => {
            const result = await saveSecretByJTI("2d796fbd16e06fdd519924c8cbd2242f", "123", 80);
            expect(result).toBe("OK");
        });
    });

    describe("test removeSecretByJTI function", () => {
        const removeSecretByJTI = $privates.__GetDependency__("removeSecretByJTI");
        beforeAll(() => {
            redisClient.set(`${REDIS_JWT_SECRET_KEY}:123`, "456");
        });
        it("returns 1", async () => {
            expect(await removeSecretByJTI("123")).toBe(1);
        });
    });

    describe("test getJTIFromToken function", () => {
        const getJTIFromToken = $privates.__GetDependency__("getJTIFromToken");
        it("returns jti string", () => {
            const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiJhZG1pbiIsImp0aSI6ImY2ZWZmM2MyMWEyYzI0ZGVkNmE0ZTcwNDJkMWNhZTNlIiwiaWF0IjoxNDgyMTM2NTU0LCJleHAiOjE0ODIyMjI5NTR9.YP4QzcLkZefoPOPrGMJsoOqV2FYkGJMWXHCcftm6GSQ";
            expect(getJTIFromToken(token)).toBe("f6eff3c21a2c24ded6a4e7042d1cae3e");
        });

        it("returns undefined when token is invalid", () => {
            expect(getJTIFromToken()).toBeUndefined();
            expect(getJTIFromToken("123.456")).toBeUndefined();
        });
    });
});

describe("test getSecretByToken function", () => {
    const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiJhZG1pbiIsImp0aSI6ImY2ZWZmM2MyMWEyYzI0ZGVkNmE0ZTcwNDJkMWNhZTNlIiwiaWF0IjoxNDgyMTM2NTU0LCJleHAiOjE0ODIyMjI5NTR9.YP4QzcLkZefoPOPrGMJsoOqV2FYkGJMWXHCcftm6GSQ";
    const secret = Buffer.from("7ab0e76207237a2a86eac52b3cc4b21c3659d0c3f529b3874e6f117e5f4814e7d98abc51982e754708e8304ec43b9e18ee8c3846a457e87125cecdccc13ef0fc", "hex");
    beforeAll(() => {
        redisClient.set(
            `${REDIS_JWT_SECRET_KEY}:f6eff3c21a2c24ded6a4e7042d1cae3e`,
            secret.toString("hex"),
        );
    });
    afterAll(() => {
        redisClient.del(
            `${REDIS_JWT_SECRET_KEY}:f6eff3c21a2c24ded6a4e7042d1cae3e"`,
        );
    });
    it("returns secret", async () => {
        expect(await getSecretByToken(token)).toEqual(secret);
    });
    it("throw Error when token is invalid", async () => {
        try {
            await getSecretByToken("jjjj");
        } catch (ex) {
            expect(ex).toBeInstanceOf(Error);
        }
    });
});

describe("test removeSecretByToken function", () => {
    const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiJhZG1pbiIsImp0aSI6ImY2ZWZmM2MyMWEyYzI0ZGVkNmE0ZTcwNDJkMWNhZTNlIiwiaWF0IjoxNDgyMTM2NTU0LCJleHAiOjE0ODIyMjI5NTR9.YP4QzcLkZefoPOPrGMJsoOqV2FYkGJMWXHCcftm6GSQ";
    const secret = Buffer.from("7ab0e76207237a2a86eac52b3cc4b21c3659d0c3f529b3874e6f117e5f4814e7d98abc51982e754708e8304ec43b9e18ee8c3846a457e87125cecdccc13ef0fc", "hex");
    beforeAll(() => {
        redisClient.set(
            `${REDIS_JWT_SECRET_KEY}:f6eff3c21a2c24ded6a4e7042d1cae3e`,
            secret.toString("hex"),
        );
    });
    afterAll(() => {
        redisClient.del(
            `${REDIS_JWT_SECRET_KEY}:f6eff3c21a2c24ded6a4e7042d1cae3e"`,
        );
    });
    it("returns 1", async () => {
        expect(await removeSecretByToken(token)).toBe(1);
    });
});


describe("test private function about limit enter wrong password too many times", () => {
    const PREFIX_KEY = $privates.__GetDependency__("REDIS_PASSWORD_RETRY");
    const getRedisPRKey = $privates.__GetDependency__("getRedisPRKey");
    const getPasswordRetryByUsername = $privates.__GetDependency__("getPasswordRetryByUsername");
    const countPasswordRetryByUsername = $privates.__GetDependency__("countPasswordRetryByUsername");
    const clearPasswordRetryByUsername = $privates.__GetDependency__("clearPasswordRetryByUsername");

    describe("test getRedisPRKey function", () => {
        it("ok", () => {
            expect(getRedisPRKey("admin")).toBe([
                PREFIX_KEY, "admin",
            ].join(":"));
        });
    });

    describe("test getPasswordRetryByUsername function", () => {
        afterAll(async () => {
            redisClient.delAsync(`${PREFIX_KEY}:admin`);
        });
        it("should returns zero", async () => {
            expect(await getPasswordRetryByUsername("admin")).toBe(0);
        });
        it("should returns 1", async () => {
            await redisClient.incrAsync(`${PREFIX_KEY}:admin`);
            expect(await getPasswordRetryByUsername("admin")).toBe(1);
        });
    });

    describe("test countPasswordRetryByUsername function", () => {
        afterAll(async () => {
            redisClient.delAsync(`${PREFIX_KEY}:admin`);
        });
        it("should returns count", async () => {
            await countPasswordRetryByUsername("admin");
            expect(await getPasswordRetryByUsername("admin")).toBe(1);
            await countPasswordRetryByUsername("admin");
            expect(await getPasswordRetryByUsername("admin")).toBe(2);
        });
    });

    describe("test clearPasswordRetryByUsername function", () => {
        afterAll(async () => {
            redisClient.delAsync(`${PREFIX_KEY}:admin`);
        });
        it("should clear count", async () => {
            await countPasswordRetryByUsername("admin");
            await countPasswordRetryByUsername("admin");
            clearPasswordRetryByUsername("admin");
            expect(await getPasswordRetryByUsername("admin")).toBe(0);
        });
    });
});
