"use strict";

import { h, Component } from "preact";

export default class Jumbotron extends Component {
    render() {
        return (
            <div className="jumbotron">
                <div className="mid">
                    <div className="logo">
                        <span className="name">Awhile</span><span className="dot">.</span><span className="domain">Online</span>
                    </div>
                </div>
            </div>
        );
    }
}
