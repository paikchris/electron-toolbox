// Link.react.test.js
import React from "react";
import renderer from "react-test-renderer";
import * as Enzyme from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import * as Project from "./../../src/lib/Project.js";

//ENZYME SETUP
Enzyme.configure({ adapter: new Adapter() });

describe("Project Module Tests", () => {
	test("function validateProjectName()", () => {
		//ALLOW PERIODS
		expect(Project.validateProjectName("test.test_TEST")).toBe(true);
	});
});
