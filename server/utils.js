"use strict";

export function outputToHTML(str) {
    return str.replace(/<>\//g, $0 => {
        switch ($0) {
            case "<":
                return "&lt;";
            case ">":
                return "&gt;";
            default:
                return `&#${$0.charCodeAt(0)};`;
        }
    });
}

export function outputToJS(str) {
    return JSON.stringify(str);
}
