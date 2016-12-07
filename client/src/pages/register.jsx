"use strict";

import { h, Component } from "preact";

import { User, Jumbotron, Nav } from "../components";
import * as actions from "../actions";
import { validateRegister } from "../../../isomorphic/validate";

const ERROR_MESSAGES = {
    username: {
        valueMismatch: "用户名不能为空",
        tooShort: "用户名长度必须至少 3 个字符",
        tooLong: "用户名长度不能超过 32 个字符",
    },
    password: {
        valueMismatch: "密码不能为空",
    },
    email: {
        typeMismatch: "Email 格式不对",
    },
};

class RegisterForm extends Component {
    constructor(...args) {
        super(...args);
        this.state = {
            passwordViewer: false,
            usernameValidityMessage: undefined,
            passwordValidityMessage: undefined,
            emailValidityMessage: undefined,
            errorMessage: "",
            submitting: false,
        };
        this.handleSubmit = this.handleSubmit.bind(this);
        this.togglePasswordViewer = this.togglePasswordViewer.bind(this);
    }
    getValidityMessage(validityState, errorMessages) {
        if (validityState.valid) {
            return;
        }
        if (validityState.customError) {
            return validityState.customErrorMessage;
        }
        const messages = [];
        for (const key of Object.keys(validityState)) {
            if (key === "valid" || key === "customError" || key === "customErrorMessage") {
                continue;
            }
            if (validityState[key]) {
                messages.push(messages[key]);
            }
        }
        return messages.join("; ");
    }
    convertValidityState({ username, password, email }) {
        const state = {};
        state.usernameValidityMessage = this.getValidityMessage(username, ERROR_MESSAGES["username"]);
        state.passwordValidityMessage = this.getValidityMessage(password, ERROR_MESSAGES["password"]);
        state.emailValidityMessage = this.getValidityMessage(email, ERROR_MESSAGES["email"]);
    }
    updateStateFrom(props) {
        const nextState = {};
        nextState.submitting = props.processing;
        if (!props.error) {
            return;
        }
        const { message, detail } = props.error;
        if (!detail) {
            nextState.errorMessage = message;
            return this.setState(nextState);
        }
        Object.assign(nextState, this.convertValidityState(detail));
        this.setState(nextState);
    }
    handleSubmit(evt) {
        evt.preventDefault();
        const target = evt.target;
        const username = target["username"].value;
        const password = target["password"].value;
        const email = target["email"].value;

        const result = validateRegister({
            username,
            password,
            email,
        });

        if (result !== true) {
            const state = this.convertValidityState(result);
            this.setState(state);
            return;
        }
        this.props.dispatch(actions.register(username, password, email));
    }
    togglePasswordViewer(evt) {
        evt.preventDefault();
        this.setState({
            passwordViewer: !this.state.passwordViewer,
        });
    }
    render() {
        const {
            usernameValidityMessage,
            passwordValidityMessage,
            emailValidityMessage,
            passwordViewer,
            submitting,
            errorMessage,
        } = this.state;
        return (
            <form onSubmit={this.handleSubmit} name="register-form">
                <div className="form-ctl">
                    <label className="for-text" for="ipt-register-username">用户名</label>
                    <input id="ipt-register-username" type="text"
                           name="username" required />
                    {usernameValidityMessage && (
                        <div className="invalid-message">
                            {usernameValidityMessage}
                        </div>
                    )}
                </div>
                <div className="form-ctl">
                    <label className="for-text" for="ipt-register-password">密码</label>
                    <input id="ipt-register-password"
                           type={passwordViewer ? "text" : "password"}
                           name="password" required />
                    <a className="check-pw-btn" onClick={this.togglePasswordViewer}></a>
                    {passwordValidityMessage && (
                        <div className="invalid-message">
                            {passwordValidityMessage}
                        </div>
                    )}
                </div>
                <div className="form-ctl">
                    <label className="for-text" for="ipt-register-email">邮箱</label>
                    <input id="ipt-register-email" type="email" name="email" />
                    {emailValidityMessage && (
                        <div className="invalid-message">
                            {emailValidityMessage}
                        </div>
                    )}
                </div>
                { errorMessage && <div className="form-ctl"><div class="tips invalid">{errorMessage}</div></div> }
                <div className="form-ctl">
                    <button disabled={submitting} type="submit" className="btn btn-primary btn-block">注册</button>
                </div>
            </form>
        );
    }
}

const RegisterSuccess = () => (
    <div className="register-success-dialog">
        <h2>注册成功！</h2>
        <a className="btn btn-block btn-primary" href="/login.html">登录</a>
    </div>
);

export default class Register extends Component {
    constructor(...args) {
        super(...args);
    }
    render() {
        const { userInfo, dispatch, register } = this.props;
        return (
            <div>
                <User {...userInfo} dispatch={dispatch} />
                <Jumbotron />
                <div className="mid">
                    <div className="main">
                        <Nav value={[{ name: "首页", value: "/" }, { name: "注册", value: null } ]} />
                        <div className="register-container">
                            { register.success
                                ? <RegisterSuccess />
                                : <RegisterForm {...register} dispatch={dispatch} />
                            }
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
