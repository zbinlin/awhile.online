"use strict";

import {
    GET_USER_INFO_REQUEST,
    GET_USER_INFO_SUCCESS,

    GET_MESSAGE_IDS_REQUEST,
    GET_MESSAGE_IDS_SUCCESS,
    GET_MESSAGE_IDS_FAILURE,
} from "../constants";

export default function userInfo(state = {}, action) {
    switch (action.type) {
        case GET_USER_INFO_REQUEST:
            return state;
        case GET_USER_INFO_SUCCESS:
            return Object.assign({}, state, {
                userInfo: action.payload,
            });

        case GET_MESSAGE_IDS_REQUEST:
            return Object.assign({}, state, {
                messageIdsLoading: true,
                messageIdsLoadingErrno: 0,
            });
        case GET_MESSAGE_IDS_SUCCESS:
            return Object.assign({}, state, {
                messageIdsLoading: false,
                messageIds: action.payload,
            });
        case GET_MESSAGE_IDS_FAILURE:
            return Object.assign({}, state, {
                messageIdsLoading: false,
                messageIdsLoadingErrno: action.payload,
            });

        default:
            return state;
    }
}
