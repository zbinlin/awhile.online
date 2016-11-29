"use strict";

export class ClientError extends Error {}

export class ServerError extends Error {}

export class FetchError extends Error {}

export class FetchParseBodyError extends Error {}

export class TimeoutError extends Error {}

export class AuthError extends Error {}

export class UnknowError extends Error {}

export class LoginError extends Error {}

export class RegisterError extends Error {
    constructor(msg, detail) {
        super(msg);
        this.detail = detail;
    }
}
