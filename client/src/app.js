"use strict";

import { h, render, Component } from "preact";
import Router from "preact-router";
import store from "./store";
import "babel-polyfill";
import * as actions from "./actions";

import {
    Home,
    Publish,
    Login,
    Register,
    Message,
} from "./pages";

window.addEventListener("shared-session-storage", function (evt) {
    store.dispatch(actions.getUserInfo());
});

class App extends Component {
    constructor(...args) {
        super(...args);
        const { store } = this.props;
        this.state = Object.assign({}, store.getState(), {
            $dispatch$(...args) {
                return store.dispatch(...args);
            },
        });
        store.subscribe(() => {
            this.setState(Object.assign({}, store.getState()));
        });
    }
    componentDidMount() {
        this.props.store.dispatch(
            actions.getUserInfo(),
        );
    }
    render() {
        const { messageContent } = this.props;
        const { $dispatch$: dispatch, ...store } = this.state;
        return (
            <Router>
                <Home path="/" dispatch={dispatch} userInfo={store.userInfo} />
                <Home path="/index.html" dispatch={dispatch} userInfo={store.userInfo} />
                <Publish path="/publish.html" dispatch={dispatch} userInfo={store.userInfo} message={store.message} />
                <Login path="/login.html" dispatch={dispatch} userInfo={store.userInfo} auth={store.auth} />
                <Register path="/register.html" dispatch={dispatch} userInfo={store.userInfo} register={store.register} />
                <Message path="/m/:id" content={messageContent} dispatch={dispatch} {...store} userInfo={store.userInfo} />
                <Message path="/anonymous/:id" content={messageContent} dispatch={dispatch} {...store} userInfo={store.userInfo} />
            </Router>
        );
    }
}

document.body.innerHTML = "";

render(<App store={store} messageContent={window.messageContent} />, document.body);
