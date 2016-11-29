"use strict";

import { h, Component } from "preact";

import { User, Jumbotron, Nav } from "../components";

export default class Login extends Component {
    render() {
        return (
            <div>
                <User />
                <Jumbotron />
                <div className="mid">
                    <div className="main">
                        <Nav value={[{ name: "首页", value: "/" }, { name: "登录", value: null }]} />
                        <div className="login-container">
                            <form>
                                <div className="form-ctl">
                                    <label className="for-text">用户名</label>
                                    <input type="text" name="username" required />
                                </div>
                                <div className="form-ctl">
                                    <label className="for-text">密码</label>
                                    <input type="password" name="password" required />
                                </div>
                                <div className="form-ctl">
                                    <label className="for-checkbox"><span className="checkbox-wrapper"><input type="checkbox" name="rememberMe" value="true" /><i>&#10003;</i></span>记住登录状态</label>
                                </div>
                                <div className="form-tips">
                                </div>
                                <div className="form-ctl">
                                    <button type="submit" className="btn btn-block btn-primary">登录</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
