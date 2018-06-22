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
export class NewProjectFormUnguided extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			projectCreateInProgress: false,
			projectObject: {
				path: "",
				name: "",
				type: "",
				vagrant: {
					vagrantDir: "",
					boxID: ""
				}
			},
			redirectToProject: {
				redirect: false,
				projectID: ""
			}
		};

		this.handleProjectNameChange = this.handleProjectNameChange.bind(this);
		this.handleCreateProjectButtonClick = this.handleCreateProjectButtonClick.bind(this);
		this.handleVagrantBoxIDChange = this.handleVagrantBoxIDChange.bind(this);
	}

	handleProjectNameChange(event) {
		let key = event.currentTarget.getAttribute("name");
		let value = event.currentTarget.value;

		this.setState((prevState, props) => {
			let updateStateMap = prevState;

			updateStateMap.projectObject.name = value;
			return updateStateMap;
		});
	}

	handleCreateProjectButtonClick(event) {
		let project = new Project(this.state.projectObject);

		let cb = (exitCode, stdout, stderr) => {
			if (exitCode === 0) {
				console.log("VAGRANT SETUP COMPLETE");
				console.log(project);
				//IF SUCCESSFUL, SET THE REDIRECT FLAG TO TRUE
				let redirectToProjectobj = {
					redirect: true,
					projectID: project.name
				};
				this.setState((prevState, props) => {
					let updateStateMap = prevState;

					updateStateMap.projectCreateInProgress = true;
					updateStateMap.redirectToProject = redirectToProjectobj;

					return updateStateMap;
				});
			} else {
				console.log(stderr);
			}
		};

		this.setState((prevState, props) => {
			return { projectCreateInProgress: true };
		});
		project.createProject(cb);
	}

	handleVagrantBoxIDChange(event) {
		let value = event.currentTarget.value;
		this.setState((prevState, props) => {
			let updateStateMap = prevState;
			updateStateMap.projectObject.vagrant.boxID = value;
			return updateStateMap;
		});
	}

	render() {
		if (this.state.redirectToProject.redirect) {
			return <Redirect to="/" />;
		}

		return (
			<div>
				<h3>Project Setup</h3>
				<div className="projectCreateContainer">
					<ProjectNameInput
						name="name"
						onChange={this.handleProjectNameChange}
						projectName={this.state.projectObject.name}
					/>
					<VagrantComponents.VagrantOptions
						style={{ marginTop: "18px" }}
						boxIDChange={this.handleVagrantBoxIDChange}
						vagrant={this.state.projectObject.vagrant}
					/>
					<Blueprint.Button
						type="button"
						text="Create Project"
						onClick={this.handleCreateProjectButtonClick}
						intent="primary"
						loading={this.state.projectCreateInProgress}
						minimal={false}
						fill={false}
						small={false}
					/>
				</div>
			</div>
		);
	}
}

export class ProjectTypeSelect extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			projectTypes: ["Option 1", "Option 2"]
		};

		this.handleChange = this.handleChange.bind(this);
	}
	handleChange(event) {
		this.props.handleProjectFormChange(event);
	}

	render() {
		return (
			<Blueprint.Popover
				content={
					<Blueprint.Menu>
						{Project.getProjectTypeOptions().map((item, index) => (
							<Blueprint.MenuItem
								name={this.props.name}
								key={index}
								value={item}
								text={item}
								onClick={this.handleChange}
							/>
						))}
					</Blueprint.Menu>
				}
				position={Blueprint.Position.BOTTOM_RIGHT}
			>
				<Blueprint.Button minimal={true} value={this.props.projectType} rightIcon="caret-down">
					{this.props.projectType}
				</Blueprint.Button>
			</Blueprint.Popover>
		);
	}
}

class ProjectNameInput extends React.Component {
	constructor(props) {
		super(props);
		this.state = {};
	}

	render() {
		return (
			<Blueprint.InputGroup
				name={this.props.name}
				type="text"
				onChange={this.props.onChange}
				value={this.props.projectName}
				intent="NONE"
				placeholder="Project Name"
			/>
		);
	}
}
