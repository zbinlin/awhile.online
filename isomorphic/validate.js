"use strict";

import validator from "validator";

function checkLength(str, min, max) {
    const validity = {
        valid: true,
    };
    if (str == null || validator.isEmpty(str)) {
        validity.valid = false;
        validity.valueMissing = true;
    } else if (!validator.isLength(str, { min })) {
        validity.valid = false;
        validity.tooShort = true;
    } else if (!validator.isLength(str, { max })) {
        validity.valid = false;
        validity.tooLong = true;
    }
    return validity;
}
function checkEmail(email) {
    const validity = {
        valid: true,
    };
    // NOTE: email is optional
    if (email == null || email == "") {
        return validity;
    }
    if (!validator.isEmail(email)) {
        validity.valid = false;
        validity.typeMismatch = true;
    }
    return validity;
}

export function validateRegister(params) {
    const validities = {};
    validities.username = checkLength(params.username, 3, 32);
    validities.password = checkLength(params.password, 6, 128);
    validities.email = checkEmail(params.email);
    if (validities.username.valid &&
        validities.password.valid &&
        validities.email.valid) {
        return true;
    } else {
        return validities;
    }
}

export function validateMessage({ content }) {
    const validities = {};
    if (typeof content !== "string") {
        validities.content = {
            valid: false,
            typeMismatch: true,
        };
    } else if (content.length === 0) {
        validities.content = {
            valid: false,
            tooShort: true,
        };
    } else if (content.length > 1024) {
        validities.content = {
            valid: false,
            tooLong: true,
        };
    }
    if (Object.keys(validities).length === 0) {
        return true;
    } else {
        return validities;
    }
}
