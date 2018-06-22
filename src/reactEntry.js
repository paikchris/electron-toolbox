import React from "react";
import ReactDOM from "react-dom";
import { NavigationBar } from "./components/NavigationBar.js";
import * as ProjectPage from "./components/project/ProjectPage.js";
import "./css/blueprint.css";
import "./css/theme.css";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import { TempHomePage } from "./components/home/HomePage.js";

const { remote } = window.require("electron");
const { Menu, MenuItem } = remote;

export class App extends React.Component {
	constructor(props) {
		super(props);
		this.state = {};

		createRightClickMenu();
	}

	render() {
		return (
			<BrowserRouter id="historyDIV">
				<div className="appContainer pt-dark">
					<NavigationBar brandText="Toolbox" />
					<div className="bodyContainer">
						<Switch>
							<Route exact path="/" component={TempHomePage} />
							<Route path="/projects" component={ProjectPage.ProjectPageContainer} />
							<Route component={ProjectPage.TempHomePage} />
						</Switch>
					</div>
				</div>
			</BrowserRouter>
		);
	}
}

function createRightClickMenu() {
	let rightClickPosition = null;

	const menu = new Menu();
	const menuItem = new MenuItem({
		label: "Inspect Element",
		click: () => {
			remote.getCurrentWindow().inspectElement(rightClickPosition.x, rightClickPosition.y);
		}
	});
	menu.append(menuItem);

	window.addEventListener(
		"contextmenu",
		e => {
			e.preventDefault();
			rightClickPosition = { x: e.x, y: e.y };
			menu.popup(remote.getCurrentWindow());
		},
		false
	);
}

ReactDOM.render(<App />, document.getElementById("root"));
