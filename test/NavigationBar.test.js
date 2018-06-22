// Link.react.test.js
import React from "react";
import renderer from "react-test-renderer";
import * as Enzyme from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import { MemoryRouter } from "react-router-dom";
import { NavigationBar } from "./../src/components/NavigationBar";

//ENZYME SETUP
Enzyme.configure({ adapter: new Adapter() });

//TESTS
describe("Navigation Bar Tests", () => {
	test("NavBar Snapshot Test", () => {
		const tree = renderer
			.create(<MemoryRouter>
				<NavigationBar />
			</MemoryRouter>)
			.toJSON();
		expect(tree).toMatchSnapshot();
	});
	test("Enzyme Shallow Render Example", () => {
		const wrapper = Enzyme.shallow(<NavigationBar />);
	});
	test("Enzyme Full Render Example", () => {
		const wrapper = Enzyme.mount(<MemoryRouter>
			<NavigationBar />
		</MemoryRouter>);
	});
});
