"use strict";

import { h, Component } from "preact";

import { User, Jumbotron, Nav } from "../components";

export default class Message extends Component {
    render() {
        return (
            <div>
                <User />
                <Jumbotron />
                <div className="mid">
                    <div className="main">
                        <Nav value={[{ name: "首页", value: "/" }, { name: "消息", value: null }]} />
                        <div className="view-message-container">
                            <div className="message-content">Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

                The above copyright notice and this per中文mission notice shall be included in all copies or substantial portions of the Software.
                            </div>
                            <div className="message-content-warning">
                                <p><i className="fa-warning">&#61553;</i>该消息内容由用户产生，如果内容涉及儿童色情、侵权、诈骗等，可以<a href="mailto:awhile.online@yandex.com?subject=举报&body="><b>发送邮件</b></a>举报！</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
