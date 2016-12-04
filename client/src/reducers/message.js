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
                link: null,
                errno: null,
            });
        case POST_MESSAGE_SUCCESS:
            return Object.assign({}, state, {
                posting: false,
                link: action.payload,
            });
        case POST_MESSAGE_FAILURE:
            return Object.assign({}, state, {
                posting: false,
                error: action.payload,
            });

        default:
            return state;
    }
}
