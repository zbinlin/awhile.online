"use strict";

import Router from "koa-router";
import {
    GUEST_NAME,
} from "../config";
import * as store from "./store";
import {
    outputToHTML,
    outputToJS,
} from "./utils";

import assets from "./assets-manifest";

const hash = ([key]) => assets[key];

const layoutRouter = new Router();

// mount /
// mount /index.html
// mount /publish.html
// mount /login.html
// mount /register.html
layoutRouter.get([
    "/",
    "/index.html",
    "/publish.html",
    "/login.html",
    "/register.html",
], function *() {
    const { response: res } = this;
    res.status = 200;
    res.body = `\
<!DOCTYPE html>
<html lang="zh-Hans">
    <head>
        <meta charset="UTF-8">
        <title>Awhile.Online - Beta</title>
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <link href="${hash`/stylesheets/normalize.css`}" rel="stylesheet">
        <link href="${hash`/stylesheets/layout.css`}" rel="stylesheet">
        <script src="${hash`/javascripts/vendor.bundle.js`}"></script>
        <script src="${hash`/javascripts/bundle.js`}"></script>
    </head>
    <body>
        <div class="jumbotron">
            <div class="mid">
                <div class="logo">
                    <span class="name">Awhile</span><span class="dot">.</span><span class="domain">Online</span>
                </div>
            </div>
        </div>
    </body>
</html>`;
});

// mount /v/{hash}
// mount /{GUEST_NAME}/{hash}
const middleware = function* messageMiddleware() {
    const { response: res } = this;
    const { id } = this.params;
    let content;
    try {
        content = yield store.get(id);
        res.status = 200;
    } catch (ex) {
        // TODO logger
        res.status = 404;
    }
    let fragment = "";
    if (content) {
        fragment = `\
            <div class="message-content">${outputToHTML(content)}</div>
            <div class="message-content-warning">
                <p><i class="fa-warning">&#61553;</i>该消息内容由用户产生，如果内容涉及儿童色情、儿童暴力、侵权、诈骗等，可以<a href="mailto:awhile.online@yandex.com?subject=举报&body="><b>发送邮件</b></a>举报！</p>
            </div>
        `;
    } else {
        fragment = `
            <div className="message-content-not-found">
                <span className="num">404</span>
                <span className="desc">Not Found</span>
            </div>
        `;
    }
    res.body = `\
<!DOCTYPE html>
<html lang="zh-Hans">
    <head>
        <meta charset="UTF-8">
        <title>Awhile.Online - Beta</title>
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta name="robots" content="noindex">
        <link href="${hash`/stylesheets/normalize.css`}" rel="stylesheet">
        <link href="${hash`/stylesheets/layout.css`}" rel="stylesheet">
        <script>
            window.messageContent = ${content && outputToJS(content)};
        </script>
        <script src="${hash`/javascripts/vendor.bundle.js`}"></script>
        <script src="${hash`/javascripts/bundle.js`}"></script>
    </head>
    <body>
        <div class="jumbotron">
            <div class="mid">
                <div class="logo">
                    <span class="name">Awhile</span><span class="dot">.</span><span class="domain">Online</span>
                </div>
            </div>
        </div>
        <div class="mid">
            <div class="main">
                <div class="nav">
                    <a href="/">首页</a>
                    <span>消息</span>
                </div>
                <div class="view-message-container">${fragment}</div>
            </div>
        </div>
    </body>
</html>`;
};
layoutRouter.get("/m/:id", middleware);
layoutRouter.get(`/${GUEST_NAME}/:id`, middleware);

export default function layout() {
    const a = layoutRouter.routes();
    const b = layoutRouter.allowedMethods();
    return function* (next) {
        return yield* a.call(this, b.call(this, next));
    };
}
