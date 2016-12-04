"use strict";

/* eslint-env jest */

import { isObjectEqual } from "../helper";


describe("test isObjectEqual function", () => {
    describe("equal on", () => {
        it("same object", () => {
            const obj = {};
            expect(isObjectEqual(obj, obj)).toBeTruthy();
        });
        it("different ordering", () => {
            const obj1 = {
                "foo": 1,
                "bar": 2,
            };
            const obj2 = {
                "bar": 2,
                "foo": 1,
            };
            expect(isObjectEqual(obj1, obj2)).toBeTruthy();
        });
        it("non-enumerable", () => {
            const obj1 = Object.create(null, {
                "foo": {
                    value: 1,
                },
            });
            const obj2 = Object.create(null, {
                "foo": {
                    value: 1,
                },
            });
            expect(isObjectEqual(obj1, obj2)).toBeTruthy();
        });
    });
    describe("not equal on", () => {
        it("proptype", () => {
            const obj1 = {
                foo: "1",
            };
            const obj2 = Object.create({
                foo: "1",
            });
            expect(isObjectEqual(obj1, obj2)).toBeFalsy();
        });
    });
});
