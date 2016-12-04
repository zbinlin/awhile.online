"use strict";

import { h, Component } from "preact";

import { User, Jumbotron } from "../components";

export default class Home extends Component {
    render() {
        const { dispatch, userInfo } = this.props;
        return (
            <div>
                <User userInfo={userInfo} dispatch={dispatch} />
                <Jumbotron />
                <div class="mid">
                    <div class="main">
                        <div class="publish-btn-conatiner">
                            <a class="btn btn-primary btn-lg" href="/publish.html">发布</a>
                        </div>
                        <div class="user-btn-conatiner">
                            <a class="btn btn-outline-secondary btn-lg" href="/login.html">登录</a>
                            <a class="btn btn-outline-secondary btn-lg" href="/register.html">注册</a>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
