"use strict";

import {
    GET_USER_INFO_REQUEST,
    GET_USER_INFO_SUCCESS,

    GET_MESSAGE_IDS_REQUEST,
    GET_MESSAGE_IDS_SUCCESS,
    GET_MESSAGE_IDS_FAILURE,

    REMOVE_MESSAGE_REQUEST,
    REMOVE_MESSAGE_SUCCESS,
    REMOVE_MESSAGE_FAILURE,

    LOGOUT_REQUEST,
    LOGOUT_SUCCESS,

    RESET_MESSAGE_IDS,
} from "../constants";


function messageIds(state = {}, action) {
    switch (action.type) {
        case GET_MESSAGE_IDS_REQUEST:
            return Object.assign({}, state, {
                loading: true,
                content: null,
                error: null,
            });
        case GET_MESSAGE_IDS_SUCCESS:
            return Object.assign({}, state, {
                loading: false,
                content: action.payload.map(id => ({
                    id,
                    deleting: false,
                    errno: null,
                })),
            });
        case GET_MESSAGE_IDS_FAILURE:
            return Object.assign({}, state, {
                loading: false,
                error: action.payload,
            });

        case REMOVE_MESSAGE_REQUEST:
            return Object.assign({}, state, {
                content: state.content.map(val => {
                    if (val.id === action.payload) {
                        return Object.assign({}, val, {
                            deleting: true,
                        });
                    } else {
                        return val;
                    }
                }),
            });
        case REMOVE_MESSAGE_FAILURE:
            return Object.assign({}, state, {
                content: state.content.map(val => {
                    if (val.id === action.payload.id) {
                        return Object.assign({}, val, {
                            deleting: false,
                            error: action.payload,
                        });
                    } else {
                        return val;
                    }
                }),
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
                baseInfo: action.payload,
            });

        case RESET_MESSAGE_IDS:
            return Object.assign({}, state, {
                messageIds: null,
            });

        case GET_MESSAGE_IDS_REQUEST:
        case GET_MESSAGE_IDS_SUCCESS:
        case GET_MESSAGE_IDS_FAILURE:
        case REMOVE_MESSAGE_REQUEST:
        case REMOVE_MESSAGE_SUCCESS:
        case REMOVE_MESSAGE_FAILURE:
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
