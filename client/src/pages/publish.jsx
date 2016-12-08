"use strict";

import moment from "moment";
import { h, Component } from "preact";

import { User, Jumbotron, Nav, TimeRange, QRCode } from "../components";
import { isObjectEqual } from "../utils";
import { MAX_MESSAGE_CONTENT_LENGTH } from "../constants";
import * as actions from "../actions";
import {
    validateMessage,
    mapValidityStatesToMessages,
} from "../../../isomorphic/validate";

const ERROR_MESSAGES = {
    content: {
        typeMismatch: "格式不对",
        tooShort: "内容不能为空",
        tooLong: "内容已超过 1024 个字符",
    },
};

class PostedSuccess extends Component {
    constructor(...args) {
        super(...args);
        this.state = {
            coping: false,
        };
        this.doCopy = this.doCopy.bind(this);
    }
    doCopy() {
        this.setState({
            coping: true,
        });
        if ("clipboardData" in window) {
            window.clipboardData.setData("Text", this.props.link);
            this.setState({
                coping: false,
            });
            return;
        }
        const handleEvent = evt => {
            document.removeEventListener("copy", handleEvent, true);
            evt.preventDefault();
            evt.clipboardData.setData("text/plain", this.props.link);
            this.setState({
                coping: false,
            });
        };
        document.addEventListener("copy", handleEvent, true);
        document.execCommand("copy");
    }
    componentDidUnmount() {
        this.props.dispatch(actions.resetPublishState());
    }
    render() {
        const { link, coping } = this.props;
        return (
            <div className="posted-message-container">
                <h2>发布成功！</h2>
                <div className="message-link-text">
                    <a href={link} target="_blank">{link}</a>
                    <a className={`copy-btn ${coping ? "copying" : ""}`}
                       onClick={this.doCopy}>复制</a>
                </div>
                <div className="qrcode">
                    <QRCode value={link} size={150} />
                </div>
            </div>
        );
    }
}

class PostMessage extends Component {
    constructor(...args) {
        super(...args);
        const { startTime, endTime, range } = this.getTimeRanges();
        this.state = {
            posting: false,
            errorMessage: "",
            characterCount: MAX_MESSAGE_CONTENT_LENGTH,
            startTime,
            endTime,
            range,
        };
        setTimeout(() => {
            this.updateStateFrom(this.props);
        });
        this.handleSubmit = this.handleSubmit.bind(this);
        this.calcRemainingCharacterCount = this.calcRemainingCharacterCount.bind(this);
        this.handleFocus = this.handleFocus.bind(this);
        this.handleBlur = this.handleBlur.bind(this);
        this.handleTimeRangeChange = this.handleTimeRangeChange.bind(this);
    }
    componentDidMount() {
        if (this._textAreaEl) {
            this._textAreaEl.value = "";
        }
    }
    componentWillReceiveProps(nextProps) {
        if (!isObjectEqual(nextProps, this.props)) {
            this.updateStateFrom(nextProps);
        }
    }
    getTimeRanges() {
        const now = Math.floor(Date.now() / 1000);
        const startTime = now;
        const endTime = now + (this.props.isLoggedIn
            ? moment.duration(1, "months") : moment.duration(5, "days")
        ).asSeconds();
        return {
            startTime,
            endTime,
            range: {
                startTime,
                endTime: startTime + moment.duration(1, "hours").asSeconds(),
            },
        };
    }
    normalizeErrorMessage(messages) {
        if (!messages) {
            return messages;
        } else if (typeof messages === "string") {
            return messages;
        } else if (Array.isArray(messages)) {
            return messages.join("; ");
        } else if (typeof messages === "object") {
            const keys = Object.keys(messages);
            return keys.map(key => messages[key]).join("; ");
        }
    }
    updateStateFrom(props) {
        let errorMessage;
        if (props.error) {
            if (props.error.detail) {
                errorMessage = this.normalizeErrorMessage(
                    mapValidityStatesToMessages(props.error.detail, ERROR_MESSAGES),
                );
            } else {
                errorMessage = props.error.message;
            }
        }
        this.setState({
            posting: props.posting,
            errorMessage,
        });
    }
    handleSubmit(evt) {
        evt.preventDefault();
        const el = this._textAreaEl;
        const content = el.value;
        const { startTime, endTime } = this.state.range;
        const ttl = endTime - startTime;
        const result = validateMessage({
            content,
            startTime,
            ttl,
        });
        if (result !== true) {
            const errorMessage = this.normalizeErrorMessage(
                mapValidityStatesToMessages(result, ERROR_MESSAGES),
            );
            this.setState({
                errorMessage,
            });
        } else {
            this.props.dispatch(
                actions.postMessage(content, startTime, ttl),
            );
        }
    }
    calcRemainingCharacterCount() {
        const el = this._textAreaEl;
        if (!el) return;
        const remainingCount = MAX_MESSAGE_CONTENT_LENGTH - el.value.length;
        if (remainingCount == this.state.characterCount) {
            return;
        }
        this.setState({
            characterCount: remainingCount,
        });
    }
    handleFocus() {
        if (this._intervalId) {
            clearInterval(this._intervalId);
        }
        this._intervalId = setInterval(this.calcRemainingCharacterCount, 100);
    }
    handleBlur() {
        clearInterval(this._intervalId);
        delete this._intervalId;
        this.calcRemainingCharacterCount();
    }
    handleTimeRangeChange(value) {
        this.setState({
            range: value,
        });
    }
    render() {
        const { posting, errorMessage, characterCount, startTime, endTime, range } = this.state;
        const submitCls = posting ? "submiting btn--pending" : "";
        return (
            <div className="post-message-container">
                <form onSubmit={this.handleSubmit} name="publish-form">
                    <div className="content">
                        <textarea ref={ el => (this._textAreaEl = el) }
                                  onFocus={this.handleFocus}
                                  onBlur={this.handleBlur}
                                  placeholder="在此输入您需要发布的消息……"></textarea>
                        <span className={`character-remaining ${characterCount < 0 ? "warning" : ""}`}>{characterCount}</span>
                    </div>
                    <div className="metadata-container">
                        <div className="label">设置生效时间：</div>
                        <TimeRange start={startTime} end={endTime} value={range}
                                   fixedStart={!this.props.isLoggedIn}
                                   onChange={this.handleTimeRangeChange} />
                    </div>
                    { errorMessage && <div className="form-ctl"><div className="tips invalid">{errorMessage}</div></div> }
                    <div className="btn-container">
                        <button type="submit" disabled={characterCount < 0}
                                className={`btn btn-primary ${submitCls}`}>
                            发布
                        </button>
                    </div>
                </form>
            </div>
        );
    }
}

export default ({ userInfo, dispatch, message }) => (
    <div>
        <User {...userInfo} dispatch={dispatch} />
        <Jumbotron />
        <div className="mid">
            <div className="main">
                <Nav value={[{ name: "首页", value: "/" }, { name: "发布", value: null }]} />
                { message.link ? <PostedSuccess link={message.link} dispatch={dispatch} />
                  : <PostMessage isLoggedIn={!!userInfo.baseInfo} error={message.error} posting={message.posting} dispatch={dispatch} />
                }
            </div>
        </div>
    </div>
);
