import React from "react";
import PropTypes from "prop-types";
// import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import {
	Navbar,
	NavbarDivider,
	NavbarGroup,
	NavbarHeading,
	Button,
	Alignment
} from "@blueprintjs/core";
import { Link } from "react-router-dom";

export class NavigationBar extends React.Component {
	constructor(props) {
		super(props);
		this.state = { date: new Date() };
	}
	render() {
		return (
			<Navbar>
				<NavbarGroup align={Alignment.LEFT}>
					<Link className="rL" to="/">
						<NavbarHeading>{this.props.brandText}</NavbarHeading>
					</Link>
				</NavbarGroup>
				<NavbarGroup align={Alignment.RIGHT}>
					<NavbarDivider />
					<Link className="rL" to="/">
						<Button className="pt-minimal" icon="home" text="Home" />
					</Link>
					<Link className="rL" to="/projects/index">
						<Button className="pt-minimal" icon="projects" text="Projects" />
					</Link>

					{/* <Button className="pt-minimal" icon="document" text="Cloud" /> */}
					<NavbarDivider />
					<Button className="pt-minimal" icon="user" />
					<Button className="pt-minimal" icon="notifications" />
					<Button className="pt-minimal" icon="cog" />
				</NavbarGroup>
			</Navbar>
		);
	}
}

NavigationBar.propTypes = {
	brandText: PropTypes.string
};
