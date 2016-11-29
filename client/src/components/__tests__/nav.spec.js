"use strict";

/* eslint-env jest */
import { h } from "preact";
import renderer from "react-test-renderer";
import Nav from "../nav.jsx";

it("Nav renders correctly", () => {
    const tree = renderer.create(
        <Nav value={[{name: "首页", value: "/"}, {name: "test", value: null}]} />
    ).toJSON();
    expect(tree).toMatchSnapshot();
});
