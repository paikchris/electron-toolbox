// var fs = require("fs");
import { Vagrant } from "../lib/Vagrant.js";
import { dirname } from "path";
console.log("PROBLEM AREA");
const fs = window.require("fs");
const { join } = window.require("path");
const { remote } = window.require("electron");
// const { remote } = window.require("electron").remote;
const dbInsert = remote.require("./main.js").dbInsert;
const dbFindAll = remote.require("./main.js").dbFindAll;

//CONSTANTS
export const ProjectsRootFolder = "/Users/paikchris/Development/universe";
export const ProjectTypes = ["Option 1", "Option 2"];
export const ComponentPurpose = {
	server: {
		id: "server",
		desc: "Server"
	},
	db: {
		id: "db",
		desc: "DB"
	},
	UI: {
		id: "ui",
		desc: "UI"
	},
	web: {
		id: "web",
		desc: "Web"
	}
};

export const TargetOS = {
	linux: {
		id: "linux",
		desc: "Linux"
	},
	windows: {
		id: "windows",
		desc: "Windows"
	},
	macos: {
		id: "macos",
		desc: "macOS"
	},
	mobile: {
		id: "mobile",
		desc: "Mobile"
	}
};

export const Languages = {
	c: {
		id: "c",
		desc: "C"
	},
	shell: {
		id: "shell",
		desc: "Shell Scripting Languages",
		children: {
			bash: {
				id: "bash",
				desc: "Bash"
			}
		}
	},
	python: {
		id: "python",
		desc: "Python"
	},
	jvm: {
		id: "jvm",
		desc: "JVM Languages",
		children: {
			java: {
				id: "java",
				desc: "Java"
			},
			groovy: {
				id: "groovy",
				desc: "Groovy"
			}
		}
	},
	node: {
		id: "node",
		desc: "Node.js",
		children: {
			javascript: {
				id: "javascript",
				desc: "Javascript"
			}
		}
	}
};

export const DevTools = {
	vagrant: {
		id: "vagrant",
		desc: "Vagrant"
	}
};

export class Project {
	constructor(options) {
		this.name = options.name;
		this.projectDir = options.projectDir ? options.projectDir : this.getProjectPath();
		this.vagrant = options.vagrant ? options.vagrant : {}; //VAGRANT OBJECT
	}

	//PROJECT METHODS
	createProject(cb) {
		if (this.validateProjectName()) {
			//INSERT PROJECT INTO DB
			dbInsert(this);

			this.createLocalProjectFolder();

			//SET VAGRANT DIRECTORY AND CREATE VAGRANT

			if (this.vagrant.boxID) {
				this.vagrant.vagrantDir = this.getProjectPath();
				let vagrant = new Vagrant(this.vagrant);
				vagrant.createVagrantBox(cb);
			}
		}

		//NEED TO TELL THE MAIN APP PROJECT CREATION IS COMPLETE
	}
	validateProjectName() {
		//PROJECT NAME:NO SPACES, /UNDERSCORES, OR SPECIAL CHARACTERS EXCEPT UNDERSCORE
		var re = /^\w+.+$/;
		if (!re.test(this.name)) {
			alert("Invalid Character In Project Name");
			return false;
		}
		return true;
	}
	getProjectPath() {
		return ProjectsRootFolder + "/" + this.name;
	}
	createLocalProjectFolder() {
		//VALIDATE PROJECT NAME
		if (this.validateProjectName()) {
			// var dir = ProjectsRootFolder + "/" + this.name;
			var dir = this.getProjectPath();

			if (!fs.existsSync(dir)) {
				fs.mkdirSync(dir);
			}
		}
	}

	getVagrantObject() {
		return new Vagrant(this.vagrant);
	}

	isVagrantRunning() {
		//CD TO PROJECT DIR AND DO A VAGRANT STATUS. NOT STATIC
		return Vagrant.isVagrantRunning(this.projectDir);
	}

	/////////////////////////////////////////
	///////////STATIC FUNCTIONS//////////////
	/////////////////////////////////////////
	static importProject(projectPath, cb) {
		if (Project.isDirectory(projectPath)) {
			let project = new Project({
				name: Project.getFolderNameFromPath(projectPath),
				projectDir: projectPath
			});

			if (project.validateProjectName()) {
				//INSERT PROJECT INTO DB
				dbInsert(project);
			}
		}

		cb();
	}
	//GETTERS
	static getProjectTypeOptions() {
		return ProjectTypes;
	}
	static getComponentPurposeOptions() {
		return ComponentPurpose;
	}
	static getTargetOSOptions() {
		return TargetOS;
	}
	static getLanguageOptions() {
		return Languages;
	}
	static getDevToolOptions() {
		return DevTools;
	}

	//FILTERS
	static isDirectory(path) {
		return fs.lstatSync(path).isDirectory();
	}
	static isValidProjectDirName(dirName) {
		return dirName.charAt(0) !== "." && dirName.charAt(0) !== "_";
	}
	static getFolderNameFromPath(path) {
		let index = path.split("/").length - 1;
		let folderName = path.split("/")[index];
		console.log(folderName);

		return folderName;
	}

	//DATABASE
	static getAllProjects(collection, resultCB) {
		dbFindAll(collection, resultCB);
	}
}

//PROJECT FUNCTIONS NOT IN PRODUCT OBJECT
