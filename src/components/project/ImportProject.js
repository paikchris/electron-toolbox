import React from "react";
import PropTypes from "prop-types";
import os from "os";
import * as Blueprint from "@blueprintjs/core";
import { Link } from "react-router-dom";
import { Project } from "./../../lib/Project.js";
import * as VagrantComponents from "./VagrantComponents.js";
import { Switch, Route, Redirect, BrowserRouter } from "react-router-dom";
import { TempHomePage } from "./../home/HomePage.js";

const { lstatSync, readdirSync } = window.require("fs");
const { join } = window.require("path");
const { remote } = window.require("electron");
const dbInsert = remote.require("./main.js").dbInsert;

//PROJECT CREATION COMPONENTS
export class ImportProjectContainer extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			projectImportInProgress: false,
			projectPath: "",
			redirectToProject: {
				redirect: false,
				projectID: ""
			}
		};

		this.handleProjectImportClick = this.handleProjectImportClick.bind(this);
		this.handleProjectPathChange = this.handleProjectPathChange.bind(this);
	}

	handleProjectPathChange(event) {
		let value = event.currentTarget.value;

		this.setState((prevState, props) => {
			let updateStateMap = prevState;

			updateStateMap.projectPath = value;
			return updateStateMap;
		});
	}

	handleProjectImportClick(event) {
		//BUILD PROJECT OBJECT
		let projectPath = this.state.projectPath;

		this.setState((prevState, props) => {
			return { projectImportInProgress: true };
		});
		let cb = () => {
			let redirectToProjectobj = {
				redirect: true,
				projectID: "import"
			};
			this.setState((prevState, props) => {
				let updateStateMap = prevState;

				updateStateMap.projectImportInProgress = false;
				updateStateMap.redirectToProject = redirectToProjectobj;

				return updateStateMap;
			});
		};
		Project.importProject(projectPath, cb);
	}

	render() {
		if (this.state.redirectToProject.redirect) {
			return <Redirect to="/project/index" />;
		}

		return (
			<div>
				<h3>Project Import</h3>
				<div className="projectCreateContainer">
					<ProjectPathInput
						onChange={this.handleProjectPathChange}
						projectPath={this.state.projectPath}
					/>
					<Blueprint.Button
						type="button"
						text="Import Project"
						onClick={this.handleProjectImportClick}
						intent="primary"
						loading={this.state.projectImportInProgress}
						minimal={false}
						fill={false}
						small={false}
					/>
				</div>
			</div>
		);
	}
}

class ProjectPathInput extends React.Component {
	constructor(props) {
		super(props);
		this.state = {};
	}

	render() {
		return (
			<Blueprint.InputGroup
				type="text"
				onChange={this.props.onChange}
				value={this.props.projectPath}
				intent="NONE"
				placeholder="/path/to/project/folder/"
			/>
		);
	}
}
