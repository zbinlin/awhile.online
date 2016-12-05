"use strict";

import { h } from "preact";

import { User, Jumbotron, Nav } from "../components";

const Content = ({ value }) => (
    <div>
        <div className="message-content">{value}</div>
        <div className="message-content-warning">
            <p>
                <i className="fa-warning">&#61553;</i>
                该消息内容由用户产生，如果内容涉及儿童色情、侵权、诈骗等，可以<a href={`mailto:awhile.online@yandex.com?subject=举报&body=${location.href}`}><b>发送邮件</b></a>举报！
            </p>
        </div>
    </div>
);

const NotFound = () => {
    return (
        <div className="message-content-not-found">
            <span className="num">404</span>
            <span className="desc">Not Found</span>
        </div>
    );
};


export default ({ content, userInfo, dispatch }) => {
    return (
        <div>
            <User {...userInfo} dispatch={dispatch} />
            <Jumbotron />
            <div className="mid">
                <div className="main">
                    <Nav value={[{ name: "首页", value: "/" }, { name: "消息", value: null }]} />
                    <div className="view-message-container">
                        { content ? <Content value={content} /> : <NotFound /> }
                    </div>
                </div>
            </div>
        </div>
    );
};
