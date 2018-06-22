const { app, BrowserWindow, Menu } = require("electron");
const path = require("path");
const url = require("url");
const { default: installExtension, REACT_DEVELOPER_TOOLS } = require("electron-devtools-installer");

const mongoDB = require("./src/db/db.js");

//SET ENVIRONMENT TO DEVELOPMENT FOR NOW
// process.env.NODE_ENV = "development";
console.log("ENVIRONMENT ===== " + process.env.NODE_ENV);

//LIVE RELOAD SERVER
// require("electron-reload")(__dirname, {
// 	electron: path.join(__dirname, "node_modules", ".bin", "electron")
// });

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win;
global.sharedObject = {
	someProperty: "default value"
};

function createWindow() {
	// Create the browser window.
	// win = new BrowserWindow({ width: 1200, height: 900 });
	win = new BrowserWindow({
		width: 1200,
		height: 900,
		webPreferences: {
			//IGNORE SECURITY WARNING AS LONG AS USING LOCAL HOST IN DEV ENV
			nodeIntegration: true
		}
	});

	//ACTIVATE REACT DEV TOOLS
	if (process.env.NODE_ENV === "development") {
		installExtension(REACT_DEVELOPER_TOOLS)
			.then(name => console.log(`Added Extension:  ${name}`))
			.catch(err => console.log("An error occurred: ", err));
	} else if (process.env.NODE_ENV === "test") {
		//IF TEST, DON'T OPEN DEV TOOLS
	}

	win.loadURL("http://localhost:8081");
	// and load the index.html of the app
	// win.loadURL(
	// 	url.format({
	// 		pathname: path.join(__dirname, "index.html"),
	// 		protocol: "file:",
	// 		slashes: true
	// 	})
	// );

	// Open the DevTools.

	if (process.env.NODE_ENV === "development") {
		win.webContents.openDevTools();
	} else if (process.env.NODE_ENV === "test") {
		//IF TEST, DON'T OPEN DEV TOOLS
	}

	// Emitted when the window is closed.
	win.on("closed", () => {
		// Dereference the window object, usually you would store windows
		// in an array if your app supports multi windows, this is the time
		// when you should delete the corresponding element.
		win = null;
	});
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
// app.on("ready", createWindow);

app.on("ready", () => {
	if (process.env.NODE_ENV === "development" || process.env.NODE_ENV === "production") {
		createMenu(app);
		createWindow();
	} else if (process.env.NODE_ENV === "test") {
		//IF TEST, DON'T CREATE RIGHT CLICK MENU
		win = new BrowserWindow({
			width: 1200,
			height: 900,
			webPreferences: {
				//IGNORE SECURITY WARNING AS LONG AS USING LOCAL HOST IN DEV ENV
				nodeIntegration: true
			}
		});
		win.loadURL("http://localhost:8081");
	}
});

// Quit when all windows are closed.
app.on("window-all-closed", () => {
	// On macOS it is common for applications and their menu bar
	// to stay active until the user quits explicitly with Cmd + Q
	if (process.platform !== "darwin") {
		app.quit();
	}
});

app.on("activate", () => {
	// On macOS it's common to re-create a window in the app when the
	// dock icon is clicked and there are no other windows open.
	if (win === null) {
		createWindow();
	}
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

////////////////////////////////////////////////////////////
//////////// ADDING CONTEXT MENU TO APP ////////////
/**
 * Creates and sets Menu for app
 * Must be called or executed after the 'ready' event of 'app' module
 * @param {electron} app
 */
function createMenu(app) {
	const template = [
		{
			label: "Edit",
			submenu: [
				{ role: "undo" },
				{ role: "redo" },
				{ type: "separator" },
				{ role: "cut" },
				{ role: "copy" },
				{ role: "paste" },
				{ role: "pasteandmatchstyle" },
				{ role: "delete" },
				{ role: "selectall" }
			]
		},
		{
			label: "View",
			submenu: [
				{ role: "reload" },
				{ role: "forcereload" },
				{ role: "toggledevtools" },
				{ type: "separator" },
				{ role: "resetzoom" },
				{ role: "zoomin" },
				{ role: "zoomout" },
				{ type: "separator" },
				{ role: "togglefullscreen" }
			]
		},
		{
			role: "window",
			submenu: [{ role: "minimize" }, { role: "close" }]
		},
		{
			role: "help",
			submenu: [
				{
					label: "Learn More",
					click() {
						require("electron").shell.openExternal("https://electronjs.org");
					}
				}
			]
		}
	];

	if (process.platform === "darwin") {
		template.unshift({
			label: app.getName(),
			submenu: [
				{ role: "about" },
				{ type: "separator" },
				{ role: "services", submenu: [] },
				{ type: "separator" },
				{ role: "hide" },
				{ role: "hideothers" },
				{ role: "unhide" },
				{ type: "separator" },
				{ role: "quit" }
			]
		});

		// Edit menu
		template[1].submenu.push(
			{ type: "separator" },
			{
				label: "Speech",
				submenu: [{ role: "startspeaking" }, { role: "stopspeaking" }]
			}
		);

		// Window menu
		template[3].submenu = [
			{ role: "close" },
			{ role: "minimize" },
			{ role: "zoom" },
			{ type: "separator" },
			{ role: "front" }
		];
	}

	const menu = Menu.buildFromTemplate(template);
	Menu.setApplicationMenu(menu);
}
/**
 * PROBABLY A BETTER WAY TO DO THIS. BUT MONGO METHODS
 * @returns
 */
exports.dbInsert = function(insertDoc) {
	mongoDB.insert(insertDoc);
};

exports.dbFind = function(collection, query) {
	return mongoDB.find(query);
};

exports.dbFindAll = function(collection, resultCB) {
	return mongoDB.findAll(collection, resultCB);
};
