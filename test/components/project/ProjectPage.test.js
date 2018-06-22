// Link.react.test.js
import React from "react";
import renderer from "react-test-renderer";
import * as Enzyme from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import { MemoryRouter } from "react-router-dom";
// import { App } from "./../../../src/reactEntry.js";

Enzyme.configure({ adapter: new Adapter() });

//SETUP
afterEach(() => {});

//TESTS
describe("Project Page Tests", () => {
	test("Project Page Test Example", () => {
		expect(1).toEqual(1);
	});
});
