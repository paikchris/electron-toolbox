const fs = window.require("fs");
import os from "os";
const shell = window.require("shelljs");

if (shell.config) {
	shell.config.execPath = "/Users/paikchris/.nvm/versions/node/v8.11.1/bin/node";
}

export class Vagrant {
	constructor(options) {
		this.boxID = options.boxID; //REQUIRED
		this.vagrantDir = options.vagrantDir; //REQUIRED
	}

	createVagrantBox(cb) {
		let stdout;
		shell.cd(this.vagrantDir);

		stdout = shell.pwd().stdout;
		console.log(stdout);

		stdout = shell.exec("vagrant init " + this.boxID).stdout;
		console.log(stdout);

		// stdout = shell.exec("vagrant up").stdout;
		// console.log(stdout);
		shell.exec("vagrant up", cb);
	}

	getVagrantBoxList() {
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

	static getVagrantGlobalStatus() {
		//PRUNED
		let stdout;
		shell.cd(this.vagrantDir);

		stdout = shell.exec("vagrant global-status --prune ").stdout;
		console.log(stdout);

		// stdout = shell.exec("vagrant up").stdout;
		// console.log(stdout);
		// shell.exec("vagrant up", cb);
	}

	static isVagrantRunning(dirPath) {
		let stdout;

		shell.cd(dirPath);

		stdout = shell.pwd().stdout;

		stdout = shell.exec("vagrant status").stdout;

		if (stdout.trim().length === 0) {
			//NO VAGRANT BOX EXISTS
			return undefined;
		} else {
			let stdoutVagrantStatusLine = stdout.split("\n")[2];

			let statusLineSplit = stdoutVagrantStatusLine.replace(/\([^\)]*\)/g, "").split(/[\s]{3,}/);
			let status = statusLineSplit[1].trim();

			console.log(status);

			if (status === "running") {
				return true;
			} else {
				return false;
			}
		}
	}
}
