"use strict";

import {
    combineReducers,
} from "redux";

import auth from "./auth";
import message from "./message";
import register from "./register";
import userInfo from "./user-info";

function debug(fn) {
    return function (...args) {
        console.table(args);
        return fn(...args);
    };
}

export default debug(combineReducers({
    auth,
    message,
    register,
    userInfo,
}));
