"use strict";

/* eslint-env jest */
import { h } from "preact";
import renderer from "react-test-renderer";
import Jumbotron from "../jumbotron.jsx";

it("Jumbotron renders correctly", () => {
    const tree = renderer.create(
        <Jumbotron />
    ).toJSON();
    expect(tree).toMatchSnapshot();
});
