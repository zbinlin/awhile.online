"use strict";

import {
    LOGIN_REQUEST,
    LOGIN_SUCCESS,
    LOGIN_FAILURE,
} from "../constants";

export default function auth(state = {}, action) {
    switch (action.type) {
        case LOGIN_REQUEST:
            return Object.assign({}, state, {
                processing: true,
            });
        case LOGIN_SUCCESS:
            return Object.assign({}, state, {
                success: true,
                processing: false,
                error: null,
            });
        case LOGIN_FAILURE:
            return Object.assign({}, state, {
                success: false,
                processing: false,
                error: action.payload,
            });

        default:
            return state;
    }
}
