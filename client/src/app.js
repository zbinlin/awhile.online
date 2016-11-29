"use strict";

import { h, render } from "preact";
import Router from "preact-router";

import {
    Home,
    Publish,
    Login,
    Register,
    Message,
} from "./pages";

const App = () => (
    <Router>
        <Home path="/" />
        <Home path="/index.html" />
        <Publish path="/publish.html" />
        <Login path="/login.html" />
        <Register path="/register.html" />
        <Message path="/m/:id" />
        <Message path="/anonymous/:id" />
    </Router>
);

document.body.innerHTML = "";

render(<App />, document.body);
