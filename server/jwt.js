"use strict";

import * as jwt from "jsonwebtoken";

import {
	JWT_SECRET,
} from "../config";

export function signToken(payload, options) {
    return new Promise((resolve, reject) => {
        jwt.sign(payload, JWT_SECRET, options, (err, token) => {
            if (err) {
                reject(err);
            } else {
                resolve(token);
            }
        });
    });
}

export function verifyToken(token, options) {
    return new Promise((resolve, reject) => {
        jwt.verify(token, JWT_SECRET, options, (err, decoded) => {
            if (err) {
                reject(err);
            } else {
                resolve(decoded);
            }
        });
    });
}

export default jwt;
