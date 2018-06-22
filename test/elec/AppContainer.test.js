// Link.react.test.js
import React from "react";
import renderer from "react-test-renderer";
import * as Enzyme from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import { MemoryRouter } from "react-router-dom";
const shell = require("shelljs");

//SERVER CHECK IMPORTS
let net = require("net");
let Promise = require("bluebird");
const util = require("util");
let childProcess = require("child_process");
let serverProcess;

//ENZYME SETUP
Enzyme.configure({ adapter: new Adapter() });

//SPECTRON STUFF
const Application = require("spectron").Application;
const assert = require("assert");
const electronPath = require("electron"); // Require Electron from the binaries included in node_modules.
const path = require("path");
let app;

//ELECTRON TEST HELPER FUNCTIONS
function startServer() {
	console.log("ATTEMPTING TO START SERVER");
	return new Promise(function(resolve, reject) {
		serverProcess = childProcess.exec("webpack-dev-server --port 8081", function(
			error,
			stdout,
			stderr
		) {
			if (error) {
				console.log("Error starting server");
				console.log(error.stack);
				console.log("START SERVER STDERR: " + stderr);
				console.log("Error code: " + error.code);
				console.log("Signal received: " + error.signal);
				reject(error);
			}
		});
		// serverProcess.stdout.pipe(process.stdout);
		let stdoutReadable = serverProcess.stdout;

		stdoutReadable.on("data", chunk => {
			// console.log(chunk);
			if (chunk.includes("Compiled successfully")) {
				console.log("SERVER HAS STARTED");
				resolve(true);
			}
		});

		// serverProcess.on("message", message => {
		// 	console.log("message from parent:", message);
		// 	resolve(message);
		// });
	});
}
function serverIsRunning(host, port, timeout) {
	return new Promise(function(resolve, reject) {
		timeout = timeout || 10000; // default of 10 seconds
		var timer = setTimeout(function() {
			reject("timeout");
			socket.end();
		}, timeout);
		var socket = net.createConnection(port, host, function() {
			clearTimeout(timer);
			resolve();
			socket.end();
		});
		socket.on("error", function(err) {
			clearTimeout(timer);
			reject(err);
		});
	});
}
function killServer() {
	if (serverProcess) {
		serverProcess.kill("SIGINT");
	}
}
function closeElectron() {
	return app.stop();
}

beforeAll(() => {
	console.log("TESTING APP");
	return serverIsRunning("localhost", 8081).then(
		function() {
			//SERVER IS RUNNING
			console.log("SERVER IS RUNNING");
			app = new Application({
				path: electronPath,
				// args: ['-r', path.join(__dirname, 'mocks.js'), path.join(__dirname, '..')],
				args: [path.join(__dirname, "../..")],
				env: { NODE_ENV: "test" },
				waitTimeout: 10e3
			});
			return app.start();
		},
		function(err) {
			//SERVER IS NOT RUNNING, TRY TO START IT
			console.log("SERVER IS NOT RUNNING");

			return startServer().then(function() {
				app = new Application({
					path: electronPath,
					// args: ['-r', path.join(__dirname, 'mocks.js'), path.join(__dirname, '..')],
					args: [path.join(__dirname, "../..")],
					env: { NODE_ENV: "test" },
					waitTimeout: 10e3
				});
				return app.start();
			});
		}
	);
}, 10000);
afterAll(() => {
	console.log("Shutting Down Server");
	killServer();
	return closeElectron();
}, 10000);

describe("Electron App Tests", () => {
	beforeEach(() => {});
	test("Electron App Visible", () => {
		return app.client
			.waitUntilWindowLoaded()
			.getWindowCount()
			.then(function(m) {
				expect(m).toEqual(1);
			});
	});
	test("Webpack server is reachable (Dev Only)", () => {
		return serverIsRunning("localhost", 8081);
		// return app.client
		// 	.waitUntilWindowLoaded()
		// 	.getWindowCount()
		// 	.then(function(m) {
		// 		expect(m).toEqual(1);
		// 	});
	});
});
