// Link.react.test.js
import React from "react";
import renderer from "react-test-renderer";
import * as Enzyme from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import { TempHomePage } from "./../../../src/components/home/HomePage";

Enzyme.configure({ adapter: new Adapter() });

//SETUP
beforeEach(() => {});
afterEach(() => {});

//EXAMPLE STUFF

//TESTS
describe("Home Page Tests", () => {
	test("TempHomePage Snapshot Test", () => {
		const tree = renderer.create(<TempHomePage />).toJSON();
		expect(tree).toMatchSnapshot();
	});
});
