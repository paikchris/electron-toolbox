import React from "react";
import os from "os";

export class TempHomePage extends React.Component {
	constructor(props) {
		super(props);

		this.state = { date: new Date() };
	}

	render() {
		return (
			<div>
				<span>{os.release()}</span>
				<h1>Toolboxx</h1>
			</div>
		);
	}
}
