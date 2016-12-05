"use strict";

import { h, Component } from "preact";
import * as actions from "../actions";

const Messages = ({ value: messageIds, reload, onRemoveMessage }) => {
    if (!messageIds) {
        return null;
    }
    const content = (ids => {
        if (ids.loading) {
            return <div className="loading"></div>;
        } else if (ids.error) {
            return <div className="load-failure">加载失败！ <a onClick={reload}>重试</a></div>;
        } else if (!ids.content.length) {
            return <div className="empty"></div>;
        }
        const messages = ids.content.map((obj, idx) => {
            const { id, deleting, error } = obj;
            let cls = "";
            if (deleting) {
                cls = "deleting";
            } else if (error) {
                cls = "delete-failure";
            }
            return (
                <li key={idx}>
                    <a href={`/m/${obj.id}`} target="_blank">{id}</a>
                    <a onClick={onRemoveMessage.bind(null, id)}
                       className={`delete-btn ${cls}`} aria-label="delete button"
                       title={error ? error.message : "Delete this message"}></a>
                </li>
            );
        });

        return (
            <ul className="links">
                {messages}
            </ul>
        );
    })(messageIds);

    return (
        <div className="messages">
            <div className="label">已发布的消息：</div>
            {content}
        </div>
    );
};

export default class User extends Component {
    constructor(...args) {
        super(...args);
        this.showInfo = this.showInfo.bind(this);
        this.hideInfo = this.hideInfo.bind(this);
        this.logout = this.logout.bind(this);
        this.handleRemoveMessage = this.handleRemoveMessage.bind(this);
        this.loadMessageIds = this.loadMessageIds.bind(this);
        this.state = {
            shown: false,
        };
    }
    loadMessageIds() {
        this.props.dispatch(actions.getMessageIds());
    }
    showInfo() {
        this.setState({
            shown: true,
        });
        if (this.props.messageIds == null) {
            this.loadMessageIds();
        }
    }
    hideInfo() {
        this.setState({
            shown: false,
        });
    }
    logout() {
        this.props.dispatch(actions.logout());
    }
    handleRemoveMessage(idx) {
        const { messageIds } = this.props;
        if (!messageIds || messageIds[idx] == null) {
            return;
        }
        const id = messageIds[idx];
        this.props.dispatch(actions.removeMessage(id));
    }
    render() {
        const { baseInfo, messageIds } = this.props;
        const { shown } = this.state;
        if (!baseInfo) {
            return null;
        }

        let detail;
        if (shown) {
            detail = [
                <div className="backdrop"></div>,
                <div className="detail">
                    <a className="close-btn" aria-label="Close" onClick={this.hideInfo}></a>
                    <div className="info">
                        <ul className="basic">
                            <li>用户名：{baseInfo.username}</li>
                            <li>昵称：{baseInfo.nickname}</li>
                            <li>邮箱：{baseInfo.email}</li>
                        </ul>
                    </div>
                    <Messages value={messageIds}
                              load={this.loadMessageIds}
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
