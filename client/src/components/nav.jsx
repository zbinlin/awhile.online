"use strict";

import { h, Component } from "preact";

export default class Nav extends Component {
    render() {
        const { value } = this.props;
        const children = value.map(({ name, value }, idx) => {
            if (value) {
                return <a key={idx} href={value}>{name}</a>;
            } else {
                return <span key={idx}>{name}</span>;
            }
        });
        return (
            <div className="nav">{children}</div>
        );
    }
}
