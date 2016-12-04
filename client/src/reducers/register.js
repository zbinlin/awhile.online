"use strict";

import {
    REGISTER_USER_REQUEST,
    REGISTER_USER_SUCCESS,
    REGISTER_USER_FAILURE,
} from "../constants";

export default function register(state = {}, action) {
    switch (action.type) {
        case REGISTER_USER_REQUEST:
            return Object.assign({}, state, {
                processing: true,
                success: false,
                reason: null,
            });
        case REGISTER_USER_SUCCESS:
            return Object.assign({}, state, {
                processing: false,
                success: true,
            });
        case REGISTER_USER_FAILURE:
            return Object.assign({}, state, {
                processing: false,
                reason: action.payload,
            });

        default:
            return state;
    }
}
