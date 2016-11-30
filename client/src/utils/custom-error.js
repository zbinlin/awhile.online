"use strict";

import {
    CLIENT_ERROR,
    SERVER_ERROR,
    FETCH_ERROR,
    FETCH_PARSE_BODY_ERROR,
    TIMEOUT_ERROR,
    AUTH_ERROR,
    LOGIN_ERROR,
    REGISTER_ERROR,
    UNKNOW_ERROR,
} from "../constants";

export class ClientError extends Error {
    constructor(msg) {
        super(msg);
        this.errno = CLIENT_ERROR;
    }
}

export class ServerError extends Error {
    constructor(msg) {
        super(msg);
        this.errno = SERVER_ERROR;
    }
}

export class FetchError extends Error {
    constructor(msg) {
        super(msg);
        this.errno = FETCH_ERROR;
    }
}

export class FetchParseBodyError extends Error {
    constructor(msg) {
        super(msg);
        this.errno = FETCH_PARSE_BODY_ERROR;
    }
}

export class TimeoutError extends Error {
    constructor(msg) {
        super(msg);
        this.errno = TIMEOUT_ERROR;
    }
}

export class AuthError extends Error {
    constructor(msg) {
        super(msg);
        this.errno = AUTH_ERROR;
    }
}

export class LoginError extends Error {
    constructor(msg) {
        super(msg);
        this.errno = LOGIN_ERROR;
    }
}

export class RegisterError extends Error {
    constructor(msg, detail) {
        super(msg);
        this.errno = REGISTER_ERROR;
        this.detail = detail;
    }
}

export class UnknowError extends Error {
    constructor(msg) {
        super(msg);
        this.errno = UNKNOW_ERROR;
    }
}
