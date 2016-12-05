"use strict";

import {
    GET_USER_INFO_REQUEST,   GET_USER_INFO_SUCCESS,
    POST_MESSAGE_REQUEST,    POST_MESSAGE_SUCCESS,    POST_MESSAGE_FAILURE,
    GET_MESSAGE_IDS_REQUEST, GET_MESSAGE_IDS_SUCCESS, GET_MESSAGE_IDS_FAILURE,
    REMOVE_MESSAGE_REQUEST,  REMOVE_MESSAGE_SUCCESS,  REMOVE_MESSAGE_FAILURE,
    REGISTER_USER_REQUEST,   REGISTER_USER_SUCCESS,   REGISTER_USER_FAILURE,
    LOGIN_REQUEST,           LOGIN_SUCCESS,           LOGIN_FAILURE,
    LOGOUT_REQUEST,          LOGOUT_SUCCESS,
} from "../constants";

import * as utils from "../utils";

export function getUserInfo(ignoreCache) {
    return async dispatch => {
        await dispatch({
            type: GET_USER_INFO_REQUEST,
        });
        const result = await utils.getUserInfo(ignoreCache);
        return await dispatch({
            type: GET_USER_INFO_SUCCESS,
            payload: result,
        });
    };
}

export function postMessage(content, startTime, ttl) {
    return async dispatch => {
        await dispatch({
            type: POST_MESSAGE_REQUEST,
        });
        try {
            const link = await utils.postMessage(content, startTime, ttl);
            return await dispatch({
                type: POST_MESSAGE_SUCCESS,
                payload: link,
            });
        } catch (ex) {
            return await dispatch({
                type: POST_MESSAGE_FAILURE,
                payload: {
                    errno: ex.errno,
                    message: ex.message,
                    detail: ex.detail,
                },
                error: true,
            });
        }
    };
}

export function getMessageIds(ignoreCache) {
    return async dispatch => {
        await dispatch({
            type: GET_MESSAGE_IDS_REQUEST,
        });
        try {
            const ids = await utils.getMessageIds(ignoreCache);
            return await dispatch({
                type: GET_MESSAGE_IDS_SUCCESS,
                payload: ids,
            });
        } catch (ex) {
            return await dispatch({
                type: GET_MESSAGE_IDS_FAILURE,
                payload: {
                    errno: ex.errno,
                    message: ex.message,
                },
                error: true,
            });
        }
    };
}

export function removeMessage(id) {
    return async dispatch => {
        await dispatch({
            type: REMOVE_MESSAGE_REQUEST,
            payload: id,
        });
        try {
            await utils.removeMessage(id);
            return await dispatch({
                type: REMOVE_MESSAGE_SUCCESS,
                payload: id,
            });
        } catch (ex) {
            return await dispatch({
                type: REMOVE_MESSAGE_FAILURE,
                payload: {
                    id,
                    errno: ex.errno,
                    message: ex.message,
                },
                error: true,
            });
        }
    };
}

export function register(username, password, email) {
    return async dispatch => {
        await dispatch({
            type: REGISTER_USER_REQUEST,
        });
        try {
            await utils.register(username, password, email);
            return await dispatch({
                type: REGISTER_USER_SUCCESS,
            });
        } catch (ex) {
            return await dispatch({
                type: REGISTER_USER_FAILURE,
                payload: {
                    errno: ex.message,
                    message: ex.message,
                    detail: ex.detail,
                },
                error: true,
            });
        }
    };
}

export function login(username, password, isRemember = false) {
    return async dispatch => {
        await dispatch({
            type: LOGIN_REQUEST,
        });
        try {
            await utils.login(username, password, isRemember);
            return await dispatch({
                type: LOGIN_SUCCESS,
            });
        } catch (ex) {
            return await dispatch({
                type: LOGIN_FAILURE,
                payload: {
                    errno: ex.message,
                    message: ex.message,
                },
                error: true,
            });
        }
    };
}

export function logout() {
    return async dispatch => {
        await dispatch({
            type: LOGOUT_REQUEST,
        });
        try {
            await utils.logout();
        } catch (ex) {
            // empty
        }
        return await dispatch({
            type: LOGOUT_SUCCESS,
        });
    };
}
