"use strict";

import {
    GET_USER_INFO_REQUEST,
    GET_USER_INFO_SUCCESS,

    GET_MESSAGE_IDS_REQUEST,
    GET_MESSAGE_IDS_SUCCESS,
    GET_MESSAGE_IDS_FAILURE,

    LOGOUT_REQUEST,
    LOGOUT_SUCCESS,
} from "../constants";


function messageIds(state = {}, action) {
    switch (action.type) {
        case GET_MESSAGE_IDS_REQUEST:
            return Object.assign({}, state, {
                loading: true,
                ids: null,
                errno: 0,
            });
        case GET_MESSAGE_IDS_SUCCESS:
            return Object.assign({}, state, {
                loading: false,
                ids: action.payload,
            });
        case GET_MESSAGE_IDS_FAILURE:
            return Object.assign({}, state, {
                loading: false,
                errno: action.payload,
            });

        default:
            return state;
    }
}


export default function userInfo(state = {}, action) {
    switch (action.type) {
        case GET_USER_INFO_REQUEST:
            return state;
        case GET_USER_INFO_SUCCESS:
            return Object.assign({}, state, {
                userInfo: action.payload,
            });

        case GET_MESSAGE_IDS_REQUEST:
        case GET_MESSAGE_IDS_SUCCESS:
        case GET_MESSAGE_IDS_FAILURE:
            return Object.assign({}, state, {
                messageIds: messageIds(state.messageIds, action),
            });

        case LOGOUT_REQUEST:
            return state;
        case LOGOUT_SUCCESS:
            return {};

        default:
            return state;
    }
}
