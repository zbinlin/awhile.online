"use strict";

import {
    combineReducers,
} from "redux";

import auth from "./auth";
import message from "./message";
import register from "./register";
import userInfo from "./user-info";

export default combineReducers({
    auth,
    message,
    register,
    userInfo,
});
