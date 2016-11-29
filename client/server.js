"use strict";

const path = require("path");
const koa = require("koa");
const koaStatic = require("koa-static");
const router = require("koa-router")();

const app = koa();

router.get(
    ["/", "/index.html", "/publish.html", "/login.html", "/register.html"], function* () {
        const { response } = this;
        response.status = 200;
        response.body = `
<!DOCTYPE html>
<html lang="zh-Hans">
    <head>
        <meta charset="UTF-8">
        <title>Awhile.Online</title>
        <link href="/stylesheets/normalize.css" rel="stylesheet">
        <link href="/stylesheets/layout.css" rel="stylesheet">
        <script src="/javascripts/bundle.js" async></script>
    </head>
    <body></body>
</html>
        `;
    }
);

router.get(
    ["/m/:id", "/anonymous/:id"], function* () {
        const { response } = this;
        response.status = 200;
        response.body = `
<!DOCTYPE html>
<html lang="zh-Hans">
    <head>
        <meta charset="UTF-8">
        <title>Awhile.Online</title>
        <meta name="robots" content="noindex">
        <link href="/stylesheets/normalize.css" rel="stylesheet">
        <link href="/stylesheets/layout.css" rel="stylesheet">
        <script src="/javascripts/bundle.js" async></script>
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
                <div class="view-message-container">
                    <div class="message-content">Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

        The above copyright notice and this per中文mission notice shall be included in all copies or substantial portions of the Software.
                    </div>
                    <div class="message-content-warning">
                        <p><i class="fa-warning">&#61553;</i>该消息内容由用户产生，如果内容涉及儿童色情、侵权、诈骗等，可以<a href="mailto:awhile.online@yandex.com?subject=举报&body="><b>发送邮件</b></a>举报！</p>
                    </div>
                </div>
            </div>
        </div>
    </body>
</html>
        `;
    }
);


app.use(router.routes(), router.allowedMethods());
app.use(koaStatic(path.join(__dirname, "./")));


app.listen(3001, function () {
    console.log("listening at http://localhost:3001");
});
