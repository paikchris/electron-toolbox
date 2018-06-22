const path = require("path");
const PostCompile = require("post-compile-webpack-plugin");
const { BrowserWindow } = require("electron");
const shell = require("shelljs");

module.exports = {
	mode: "development",
	devServer: {
		contentBase: "./dist",
		historyApiFallback: {
			index: "index.html"
		}
	},
	entry: "./src/reactEntry.js",
	output: {
		path: path.resolve(__dirname, "dist"),
		filename: "bundle.js"
	},
	node: {
		fs: "empty"
	},
	// LOADERS
	module: {
		rules: [
			// NEEDED FOR REACT
			{
				test: /\.js$/,
				exclude: /node_modules/,
				use: "babel-loader"
			},
			{
				test: /\.jsx?$/,
				exclude: /node_modules/,
				use: "babel-loader"
			},
			// CSS
			{
				test: /\.css$/,
				use: [
					{ loader: "style-loader" },
					{
						loader: "css-loader",
						options: {
							sourceMap: true
						}
					}
				]
			},
			// IMAGES AND FILES
			{
				test: /\.(png|svg|jpg|gif)$/,
				use: ["file-loader"]
			},
			// FILE LOADER
			{
				test: /\.(woff|woff2|eot|ttf|otf)$/,
				use: ["file-loader"]
			},
			// CSV AND TSV FILE LOADER
			{
				test: /\.(csv|tsv)$/,
				use: ["csv-loader"]
			},
			// XML LOADER
			{
				test: /\.xml$/,
				use: ["xml-loader"]
			}
		]
	},
	plugins: [
		new PostCompile(() => {
			console.log("Your app is running at http://localhost:4000");
			// shell.exec("pwd", { silent: false})

			//IF THERE IS A EXISTING ELECTRON APP PROCESS RUNNING
			// console.log( global.mainElectronProc )

			// if( global.mainElectronProc ){
			// 	global.mainElectronProc.kill('SIGINT');
			// electronProcess.kill();
			// }

			// //START A NEW ELECTRON PROCESS
			// shell.exec("npm start", { async: true })
			// childProc.exec('node ./failing.js', function(error, stdout, stderr)

			// console.log("PID=========" + pid)
			// console.log(pid)

			// app.quit()
			// console.log( process.env )
			// shell.exec('node --version', {silent:true}).stdout
			// shell
			// 	.exec("ps -ef ", { silent: false })

			// .exec("ps -ef | grep 'node .*electron '", { silent: false });
			// 	.exec("awk '{print $3}' | xargs kill -9", { silent: false })
			// shell.exec("kill $(ps aux | grep 'node .*electron ' | awk '{print $2}')", {silent:false})
			// shell.exec("electron .", { async: true });

			// kill $(ps -ef | grep 'node .*electron ' | awk '{print $2}')
			// ps -ef | grep 'node .*electron-toolbox' | awk '{print $3}' | xargs kill -9
			// ps -ef | grep 'electron-toolbox' | awk '{print $2}' | xargs kill -9
		})
	]
};
