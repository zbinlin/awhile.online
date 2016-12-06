"use strict";

const HTML_ESCAPED_CHARS = {
    "<" : "&lt;",
    ">" : "&gt;",
    "\"": "&quot;",
    "&" : "&amp;",
    "'" : "&#39;",
    "/" : "&#47;",
    "`" : "&#96;",
};
const HTML_UNSAFE_CHARS_REGEXP = /[<>"\\&'\/`]/g;

const JS_ESCAPED_CHARS = {
    "<"     : "\\u003C",
    ">"     : "\\u003E",
    "/"     : "\\u002F",
    "\u2028": "\\u2028",
    "\u2029": "\\u2029",
};
const JS_UNSAFE_CHARS_REGEXP = /[<>\/\u2028\u2029]/g;

export function outputToHTML(str) {
    return str.replace(HTML_UNSAFE_CHARS_REGEXP, ch => HTML_ESCAPED_CHARS[ch]);
}

export function outputToJS(str) {
    return JSON.stringify(str)
        .replace(JS_UNSAFE_CHARS_REGEXP, ch => JS_ESCAPED_CHARS[ch]);
}
