"use strict";

jest.unmock("redis");
export { default as default } from "fakeredis";
