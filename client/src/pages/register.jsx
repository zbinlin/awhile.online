"use strict";

import { h, Component } from "preact";

import { User, Jumbotron, Nav } from "../components";

export default class Register extends Component {
    constructor(...args) {
        super(...args);
        this.state = {
            passwordViewer: false,
        };
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.togglePasswordViewer = this.togglePasswordViewer.bind(this);
    }
    handleInputChange(evt) {
    }
    handleSubmit(evt) {
        evt.preventDefault();
    }
    togglePasswordViewer(evt) {
        evt.preventDefault();
        this.setState({
            passwordViewer: !this.state.passwordViewer,
        });
    }
    render() {
        const state = this.state;
        console.log(state.valid);
        return (
            <div>
                <User />
                <Jumbotron />
                <div className="mid">
                    <div className="main">
                        <Nav value={[{ name: "首页", value: "/" }, { name: "注册", value: null } ]} />
                        <div className="register-container">
                            <form onSubmit={this.handleSubmit}>
                                <div className="form-ctl">
                                    <label className="for-text" for="ipt-register-username">用户名</label>
                                    <input id="ipt-register-username" type="text"
                                           name="username" required
                                           onChange={this.handleInputChange} />
                                    {state.usernameInvalid && (
                                        <div className="invalid-message">
                                            {state.usernameInvalid}
                                        </div>
                                    )}
                                </div>
                                <div className="form-ctl">
                                    <label className="for-text" for="ipt-register-password">密码</label>
                                    <input id="ipt-register-password"
                                           type={state.passwordViewer ? "text" : "password"}
                                           name="password" required
                                           onChange={this.handleInputChange} />
                                    <a className="check-pw-btn" onClick={this.togglePasswordViewer}></a>
                                    {state.usernameInvalid && (
                                        <div className="invalid-message">
                                            {state.passwordInvalid}
                                        </div>
                                    )}
                                </div>
                                <div className="form-ctl">
                                    <label className="for-text" for="ipt-register-email">邮箱</label>
                                    <input id="ipt-register-email" type="email" name="email" />
                                    {state.usernameInvalid && (
                                        <div className="invalid-message">
                                            {state.emailInvalid}
                                        </div>
                                    )}
                                </div>
                                <div className="form-ctl">
                                    <button disabled={!state.valid} type="submit" className="btn btn-primary btn-block">注册</button>
                                </div>
                            </form>
                            <div className="register-success-dialog" style="display: none">
                                <h2>注册成功！</h2>
                                <a className="btn btn-primary" href="/login.html">登录</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
