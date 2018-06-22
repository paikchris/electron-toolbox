import React from "react";
import PropTypes from "prop-types";
import os from "os";
import * as Blueprint from "@blueprintjs/core";
import * as BlueprintTable from "@blueprintjs/table";
import { Cell, Table, Column, SelectionModes, RegionCardinality } from "@blueprintjs/table";
const shell = window.require("shelljs");
shell.config.execPath = "/Users/paikchris/.nvm/versions/node/v8.11.1/bin/node";

export class VagrantOptions extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			open: true,
			vagrantBoxes: getVagrantBoxList()
		};
		// this.vagrantBoxList(this.state);

		this.handleChange = this.handleChange.bind(this);
		this.VagrantBoxNameInput = this.VagrantBoxNameInput.bind(this);
		this.vagrantBoxList = this.vagrantBoxList.bind(this);
	}

	//EVENT LISTENERS
	handleChange(event) {
		let checked = event.target.checked;
		this.setState((prevState, props) => {
			return { open: checked };
		});
	}

	//SUB COMPONENTS
	VagrantBoxNameInput(props) {
		return (
			<Blueprint.EditableText
				placeholder={props.vagrantBoxName}
				value={props.vagrantBoxName}
				maxLines={1}
				minLines={1}
				intent="NONE"
				selectAllOnFocus={true}
				confirmOnEnterKey={true}
			/>
		);
	}

	VagrantBoxesOnMachine(props) {}

	/**
	 * @param {Map} initStateObject
	 * @memberof VagrantOptions
	 */
	vagrantBoxList(initStateObject) {
		let updateStateMap = {};
		const updateStateFunction = this.setState((prevState, props) => {
			return updateStateMap;
		});
		//THIS FUNCTION CAN ONLY RUN IN CONSTRUCTOR, USES AND SETS THE INITIAL STATE OBJECT
		shell.exec("vagrant box list", function(code, stdout, stderr) {
			let vagrantBoxMap = {};

			//LOOP THROUGH VAGRANT BOXES
			for (let vb of stdout.split("\n")) {
				/*SPLIT THE VAGRANT COMMAND LINE INPUT BY WHITESPACE. 0-BOX NAME. 1-VM TYPE. 2-BOX VERSION*/

				let vagrantBoxObj = vb.match(/\S+/g);
				if (vagrantBoxObj !== null) {
					let boxName = vagrantBoxObj[0];

					vagrantBoxMap[boxName] = vagrantBoxObj;
				}
			}

			//SET THE VAGRANT BOX MAP FOR THE INITIAL STATE OBJECT
			// initStateObject.vagrantBoxes = vagrantBoxMap;
			updateStateMap.vagrantBoxes = vagrantBoxMap;
		});
	}

	render() {
		return (
			<div className="VagrantOptionsContainer">
				<Blueprint.Switch
					value={this.state.open}
					onChange={this.handleChange}
					label="Vagrant"
					inline={false}
				/>
				<QuickCreate
					vagrantBoxes={this.state.vagrantBoxes}
					boxIDChange={this.props.boxIDChange}
					selected={this.props.vagrant.boxID}
				/>
			</div>
		);
	}
}

/**
 * Shortcut to create Vagrant boxes within Project Directory
 * @export
 * @class QuickCreate
 * @extends {React.Component}
 */
export class QuickCreate extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			vagrantFile: ""
		};
	}

	render() {
		let vagrantBoxArray = Object.keys(this.props.vagrantBoxes);
		return (
			<div className="pt-select">
				<select value={this.props.selected} onChange={this.props.boxIDChange}>
					<option value="invalid">Select Box Image</option>
					{vagrantBoxArray.map((item, index) => <option key={index}>{item}</option>)}
				</select>
			</div>
		);
	}
}

//VAGRANT BOX COMMANDS
function getVagrantBoxList() {
	let vagrantBoxMap = {};

	let stdout = shell.exec("vagrant box list").stdout;

	//LOOP THROUGH VAGRANT BOXES
	for (let vb of stdout.split("\n")) {
		/*SPLIT THE VAGRANT COMMAND LINE INPUT BY WHITESPACE. 0-BOX NAME. 1-VM TYPE. 2-BOX VERSION*/
		let vagrantBoxObj = vb.match(/\S+/g);
		if (vagrantBoxObj !== null) {
			let boxID = vagrantBoxObj[0];
			let boxName = vagrantBoxObj[0];
			let boxVM = vagrantBoxObj[1];
			let boxVersion = vagrantBoxObj[2];

			vagrantBoxMap[boxID] = {};
			vagrantBoxMap[boxID].name = boxName;
			vagrantBoxMap[boxID].vm = boxVM;
			vagrantBoxMap[boxID].version = boxVersion;
		}
	}

	return vagrantBoxMap;
}

function getVagrantFileList() {
	const vagrantFileDir = "";
}

function boxAdd(address, options) {
	let addProcess = shell.exec("vagrant box add " + address).stdout;
	let stdout = addProcess.stdout;
}
