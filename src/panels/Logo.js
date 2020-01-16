import React from "react";
import { Div, Spinner } from "@vkontakte/vkui";
import { connect } from "react-redux";
import { Spring } from "react-spring/renderprops";

import logo from "../img/logo.jpg";
import logoblack from "../img/logoblack.png";

const mapStateToProps = state => {
	return {
		scheme: state.config.scheme
	};
};

class Logo extends React.Component {
	render() {
		const { scheme } = this.props;

		return (
			<Spring
				config={{ delay: 0, duration: 1000 }}
				from={{ opacity: 0 }}
				to={{ opacity: 1 }}
			>
				{props => (
					<div style={props}>
						<Div
							style={{
								color: "var(--text_primary)",
								display: "flex",
								flexDirection: "column",
								alignItems: "center",
								marginTop: 20
							}}
						>
							<img
								src={
									scheme.includes("light") ? logo : logoblack
								}
								alt="logo"
							/>
							<Spinner
								size="large"
								style={{
									marginTop: 20
								}}
							/>
						</Div>
					</div>
				)}
			</Spring>
		);
	}
}

export default connect(mapStateToProps)(Logo);
