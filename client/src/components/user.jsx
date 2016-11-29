"use strict";

import { h, Component } from "preact";


class Messages extends Component {
    constructor(...args) {
        super(...args);
        this.removeMessage = this.removeMessage.bind(this);
    }
    removeMessage(idx) {
        return this.props.onRemoveMessage(idx);
    }
    render() {
        const { props } = this.props;
        let messages;
        if (props.messages) {
            messages = props.messages.map((msg, idx) => {
                return (
                    <li>
                        <a href="/m/{msg}" target="_blank">{msg}</a>
                        <a onClick={this.removeMessage.bind(null, idx)}
                           className="delete-btn" aria-label="delete"
                           title="Delete this message"></a>
                    </li>
                );
            });
        }

        const content = (messages => {
            if (Array.isArray(messages)) {
                if (messages.length) {
                    return (
                        <ul className="links">
                            {messages}
                        </ul>
                    );
                } else {
                    return <div className="empty"></div>;
                }
            } else {
                return <div className="loading"></div>;
            }
        })(messages);

        return (
            <div className="messages">
                <div className="label">已发布的消息：</div>
                {content}
            </div>
        );
    }
}

export default class User extends Component {
    constructor(...args) {
        super(...args);
        this.showInfo = this.showInfo.bind(this);
        this.hideInfo = this.hideInfo.bind(this);
        this.logout = this.logout.bind(this);
        this.handleRemoveMessage = this.handleRemoveMessage.bind(this);
    }
    showInfo() {
        this.setState({
            shown: true,
        });
    }
    hideInfo() {
        this.setState({
            shown: false,
        });
    }
    logout() {
    }
    handleRemoveMessage(idx) {
    }
    render() {
        const { props, state } = this;
        if (!props.userInfo) {
            return null;
        }

        let detail;
        if (state.shown) {
            detail = [
                <div className="backdrop"></div>,
                <div className="detail">
                    <a className="close-btn" aria-label="Close" onClick={this.hideInfo}></a>
                    <div className="info">
                        <ul className="basic">
                            <li>用户名：{props.userInfo.username}</li>
                            <li>昵称：{props.userInfo.nickname}</li>
                            <li>邮箱：{props.userInfo.email}</li>
                        </ul>
                    </div>
                    <Messages value={props.userInfo.messages}
                              onRemoveMessage={this.handleRemoveMessage} />
                </div>,
            ];
        }
        return (
            <div className="userinfo">
                <div className="mid welcome">
                    欢迎，<a href="javascript:" onClick={this.showInfo} className="detail-btn">Admin</a>
                    <a href="javascript:" onClick={this.logout} className="logout-btn">[退出]</a>
                </div>
                {detail}
            </div>
        );
    }
}
