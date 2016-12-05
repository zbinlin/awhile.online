"use strict";

import { h, Component } from "preact";

import * as actions from "../actions";
import { User, Jumbotron, Nav } from "../components";

const LoginForm = ({ errorMessage, processing, onSubmit }) => {
    let tips, submitCls = "";
    if (processing) {
        submitCls = "processing";
    } else if (errorMessage) {
        tips = (
            <div className="form-tips">{errorMessage}</div>
        );
    }
    return (
        <form onSubmit={onSubmit}>
            <div className="form-ctl">
                <label className="for-text">用户名</label>
                <input type="text" name="username" required />
            </div>
            <div className="form-ctl">
                <label className="for-text">密码</label>
                <input type="password" name="password" required />
            </div>
            <div className="form-ctl">
                <label className="for-checkbox">
                    <span className="checkbox-wrapper">
                        <input type="checkbox" name="rememberMe" value="true" />
                        <i>&#10003;</i>
                    </span>
                    记住登录状态
                </label>
            </div>
            {tips}
            <div className="form-ctl">
                <button type="submit"
                        className={`btn btn-block btn-primary ${submitCls}`.trim()}>登录</button>
            </div>
        </form>
    );
};

const LoginSuccessDialog = () => {
    return (
        <div className="login-success-dialog">
            <h2>登录成功</h2>
            <div className="btns">
                <a class="btn btn-block btn-primary" href="/publish.html">发布消息</a>
            </div>
        </div>
    );
};

export default class Login extends Component {
    constructor(...args) {
        super(...args);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.state = {
            loggedIn: false,
            errorMessage: "",
            processing: false,
        };
        setTimeout(this.updateState.bind(this, this.props));
    }
    updateState(auth) {
        if (auth.processing) {
            this.setState({
                processing: true,
                errorMessage: "",
                loggedIn: false,
            });
        } else if (auth.success) {
            this.setState({
                processing: false,
                errorMessage: "",
                loggedIn: true,
            });
        } else if (auth.errno) {
            this.setState({
                processing: false,
                errorMessage: auth.errno.message,
                loggedIn: false,
            });
        }
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.auth !== this.props.auth) {
            this.updateState(nextProps.auth);
        }
    }
    handleSubmit(evt) {
        evt.preventDefault();
        const formEl = evt.target;
        const usernameEl = formEl["username"];
        const passwordEl = formEl["password"];
        const rememberEl = formEl["rememberMe"];
        const errorMessages = [];
        const username = usernameEl.value;
        const password = passwordEl.value;
        const isRemember = rememberEl.checked;
        if (usernameEl.value.length < 3) {
            errorMessages.push("用户名太短了");
        } else if (usernameEl.value.length > 32) {
            errorMessages.push("用户名太长了");
        }
        if (passwordEl.value.length === "0") {
            errorMessages.push("密码不能为空");
        }
        if (errorMessages.length) {
            this.setState({
                errorMessage: errorMessages.map((msg, idx) => <p key={idx}>{msg}</p>),
            });
        } else {
            this.props.dispatch(actions.login(username, password, isRemember));
        }
    }
    render() {
        const { userInfo, dispatch } = this.props;
        const { errorMessage, loggedIn, processing } = this.state;
        return (
            <div>
                <User {...userInfo} dispatch={dispatch} />
                <Jumbotron />
                <div className="mid">
                    <div className="main">
                        <Nav value={[{ name: "首页", value: "/" }, { name: "登录", value: null }]} />
                        <div className="login-container">
                            { loggedIn
                                ? <LoginSuccessDialog />
                                : <LoginForm errorMessage={errorMessage}
                                             processing={processing}
                                             onSubmit={this.handleSubmit} />
                            }
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
