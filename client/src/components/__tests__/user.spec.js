"use strict";

/* eslint-env jest */
import { h } from "preact";
import renderer from "react-test-renderer";
import User from "../user.jsx";

it("User renders correctly", () => {
    const tree = renderer.create(
        <User userInfo={{}} dispatch={() => {}} />
    ).toJSON();
    expect(tree).toMatchSnapshot();
});
