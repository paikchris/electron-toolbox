var Module = require("module");
var originalRequire = Module.prototype.require;
const electron = require("electron");
const remote = electron.remote;
console.log("IMPORTED REMOTE: " + remote);

//TODO: SEPARATE ELECTRON MODULES AND REACT MODULES. THIS IS IMPOSSIBLE TO TEST.

var projectPath = "/Users/paikchris/Development/universe/electron-toolbox/node_modules/";
// Module.prototype.require = function() {
// 	//do your thing here
// 	return originalRequire.apply(this, arguments);
// };

let modulesArray = ["shelljs", "electron", "fs", "path"];

window.require = function(module) {
	console.log(module);
	if (modulesArray.includes(module)) {
		console.log("Standard Require: " + module);
		return require(module);
	} else {
		console.log("Custom Require: " + module);
		return Module.prototype.require.apply(null, arguments);
	}

	// return originalRequire.apply(this, arguments);
};
