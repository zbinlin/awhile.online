"use strict";

import {
    POST_MESSAGE_REQUEST,
    POST_MESSAGE_SUCCESS,
    POST_MESSAGE_FAILURE,
} from "../constants";

export default function message(state = {}, action) {
    switch (action.type) {
        case POST_MESSAGE_REQUEST:
            return Object.assign({}, state, {
                posting: true,
                id: null,
                errno: 0,
            });
        case POST_MESSAGE_SUCCESS:
            return Object.assign({}, state, {
                posting: false,
                id: action.payload,
            });
        case POST_MESSAGE_FAILURE:
            return Object.assign({}, state, {
                posting: false,
                errno: action.payload,
            });

        default:
            return state;
    }
}
