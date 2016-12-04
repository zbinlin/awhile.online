"use strict";

export function isObjectEqual(v1, v2) {
    if (v1 == v2) {
        return true;
    }
    const keys1 = Object.getOwnPropertyNames(v1).sort();
    const keys2 = Object.getOwnPropertyNames(v2).sort();
    if (keys1.length !== keys2.length) {
        return false;
    }
    for (let i = 0, len = keys1.length; i < len; i++) {
        const key = keys1[i];
        if (keys2[i] !== key) {
            return false;
        }
        if (v1[key] != v2[key]) {
            return false;
        }
    }
    return true;
}
