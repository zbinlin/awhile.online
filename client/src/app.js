"use strict";

import { h, render, Component } from "preact";
import Router from "preact-router";
import store from "./store";

import {
    Home,
    Publish,
    Login,
    Register,
    Message,
} from "./pages";

class App extends Component {
    constructor(...args) {
        super(...args);
        this.state = Object.assign({}, store.getState(), {
            $dispatch$(...args) {
                return store.dispatch(...args);
            },
        });
        store.subscribe(() => {
            this.setState(Object.assign({}, store.getState()));
        });
    }
    render() {
        const { $dispatch$: dispatch, ...store } = this.state;
        return (
            <Router>
                <Home path="/" dispatch={dispatch} userInfo={store.userInfo} />
                <Home path="/index.html" dispatch={dispatch} userInfo={store.userInfo} />
                <Publish path="/publish.html" dispatch={dispatch} userInfo={store.userInfo} message={store.message} />
                <Login path="/login.html" dispatch={dispatch} userInfo={store.userInfo} auth={store.auth} />
                <Register path="/register.html" dispatch={dispatch} userInfo={store.userInfo} register={store.register} />
                <Message path="/m/:id" dispatch={dispatch} {...store} userInfo={store.userInfo} />
                <Message path="/anonymous/:id" dispatch={dispatch} {...store} userInfo={store.userInfo} />
            </Router>
        );
    }
}

document.body.innerHTML = "";

render(<App store={store} />, document.body);
