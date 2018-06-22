import React from "react";
import * as Blueprint from "@blueprintjs/core";
import { Link } from "react-router-dom";
import { Project } from "./../../lib/Project.js";
import { Switch, Route } from "react-router-dom";

import { NewProjectFormUnguided } from "./NewProject.js";
import { ImportProjectContainer } from "./ImportProject.js";

const { remote } = window.require("electron");

// CONTAINER FOR ENTIRE PAGE
export class ProjectPageContainer extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			guided: false
		};

		this.handleGuidedSwitchChange = this.handleGuidedSwitchChange.bind(this);
	}

	handleGuidedSwitchChange(event) {
		let updateStateMap = {};
		let key = "guided";

		let checked;
		if (event.currentTarget.checked) {
			checked = true;
		} else {
			checked = false;
		}

		updateStateMap[key] = checked;

		this.setState((prevState, props) => {
			return updateStateMap;
		});
	}

	render() {
		console.log();
		return (
			<div className="projectViewContainer">
				<ProjectPageMenu />
				<Switch>
					<Route exact path="/projects/index" component={ExistingProjects} />
					<Route exact path="/projects/new" component={NewProjectFormUnguided} />
					<Route exact path="/projects/import" component={ImportProjectContainer} />
				</Switch>
			</div>
		);
	}
}

export class ProjectPageMenu extends React.Component {
	constructor(props) {
		super(props);
		this.state = {};
	}

	render() {
		return (
			<div id="projectPageMenu">
				<Blueprint.ButtonGroup vertical={false} fill={false}>
					<Link className="rL" to="/projects/index">
						<Blueprint.Button
							intent="primary"
							icon="grid-view"
							text="Dashboard"
							loading={false}
							small={true}
						/>
					</Link>
					<Link className="rL" to="/projects/new">
						<Blueprint.Button
							intent="primary"
							icon="plus"
							text="New Project"
							loading={false}
							small={true}
						/>
					</Link>
					<Link className="rL" to="/projects/import">
						<Blueprint.Button
							intent="primary"
							icon="import"
							text="Import"
							loading={false}
							small={true}
						/>
					</Link>

					{/* <Blueprint.Popover content={<div />} position={Blueprint.Position.RIGHT_TOP}>
						<Blueprint.Button
							intent="primary"
							icon="home"
							text="Button Text"
							loading={false}
							small={true}
						/>
					</Blueprint.Popover> */}
				</Blueprint.ButtonGroup>
			</div>
		);
	}
}

export class ExistingProjects extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			projects: []
		};

		//GET PROJECT INFO FROM DATABASE
		this.getProjectsInDB();
	}

	getProjectsInDB() {
		let resultCB = (err, results) => {
			let projectsArray = [];

			//LOOP THROUGH OBJECTS RETURNED FROM DB, AND CONVERT INTO PROJECT OBJECTS
			for (const proj of results) {
				let projObj = new Project(proj);
				projectsArray.push(projObj);
			}

			this.setState((prevState, props) => {
				return { projects: projectsArray };
			});
		};

		Project.getAllProjects("project", resultCB);
	}

	render() {
		console.log(this.state.projects);
		return (
			<div className="projectsContainer">
				<h3>Current Projects</h3>
				<div id="projectCardsContainer">
					{this.state.projects.map((project, index) => (
						<ProjectCard key={index} project={project} />
					))}
				</div>
			</div>
		);
	}
}

export class ProjectCard extends React.Component {
	constructor(props) {
		super(props);
		this.state = {};
	}

	render() {
		let projObject = new Project(this.props.project);
		let vagrantInfo = "";
		if (this.props.project.vagrant) {
			let vagrantStatus = projObject.isVagrantRunning();
			let classString = "vagrantHeaderLabel";

			if (vagrantStatus === true) {
				classString = classString + " active";
			} else if (vagrantStatus === false) {
				classString = classString + " inactive";
			} else {
				classString = classString + " undefined";
			}

			vagrantInfo = (
				<span className={classString}>
					<Blueprint.Icon icon="desktop" iconSize={12} /> {this.props.project.vagrant.boxID}
				</span>
			);
		}
		return (
			<Blueprint.Card className="projectCard" interactive={true} elevation="0">
				<h6>{this.props.project.name}</h6>
				<div className="projectCardDetails">
					<span className="projectDir">
						<Blueprint.Icon icon="folder-open" iconSize={12} /> {this.props.project.projectDir}
					</span>
					{vagrantInfo}
				</div>

				<div className="vagrantInfoContainer" />
			</Blueprint.Card>
		);
	}
}

//PROJECT DETAIL COMPONENTS
export class ProjectDetailContainer extends React.Component {
	constructor(props) {
		super(props);
		this.state = {};
	}

	render() {
		return (
			<div>
				<span>Project Detail</span>
			</div>
		);
	}
}
