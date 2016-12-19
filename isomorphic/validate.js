"use strict";

import validator from "validator";

/**
 * @typedef {Object} ValidityState
 * @property {boolean} valueMissing
 * @property {boolean} typeMismatch
 * @property {boolean} patternMismatch
 * @property {boolean} tooLong
 * @property {boolean} tooShort
 * @property {boolean} rangeUnderflow
 * @property {boolean} rangeOverflow
 * @property {boolean} stepMismatch
 * @property {boolean} badInput
 * @property {boolean} customError
 * @property {boolean} valid
 */


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

function checkUsername(username) {
    const validity = checkLength(username, 3, 32);
    if (!validity.valid) {
        return validity;
    } else if (/^[~!@#$%^&*()-+=]/.test(username) || /\s/.test(username)) {
        return {
            valid: false,
            patternMismatch: true,
        };
    } else {
        return validity;
    }
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
    validities.username = checkUsername(params.username);
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


/**
 * @param {ValidityState}
 * @param {Object} validationMessages - map validityState to error message
 * @param {string} [separator="; "]
 * @return {string}
 */
export function generateValidationMessage(validityState, validationMessage, separator = "; ") {
    if (validityState.valid) {
        return "";
    }
    if (validityState.customError) {
        return validityState.customErrorMessage;
    }
    const messages = [];
    for (const key of Object.keys(validityState)) {
        if (key === "valid" || key === "customError" || key === "customErrorMessage") {
            continue;
        }
        messages.push(validationMessage[key]);
    }
    return messages.join(separator);
}


export function mapValidityStatesToMessages(states, messages) {
    const keys = Object.keys(states);
    return keys.reduce((mapped, key) => {
        mapped[key] = generateValidationMessage(states[key], messages[key]);
        return mapped;
    }, {});
}
