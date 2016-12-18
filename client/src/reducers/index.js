"use strict";

import {
    combineReducers,
} from "redux";

import auth from "./auth";
import message from "./message";
import register from "./register";
import userInfo from "./user-info";

const debug = (() => {
    if (process.env.NODE_ENV === "production") {
        return func => func;
    } else {
        return func => (...args) => {
            console.table(args);
            return func(...args);
        };
    }
})();

export default debug(combineReducers({
    auth,
    message,
    register,
    userInfo,
}));
