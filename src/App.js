import React from "react";
import { View, Root, ScreenSpinner } from "@vkontakte/vkui";
import { connect } from "react-redux";
import "@vkontakte/vkui/dist/vkui.css";

import Login from "./panels/Login";
import Marks from "./panels/Marks";
import Profile from "./panels/Profile";

const mapStateToProps = state => {
	return {
		isFetching: state.init.isFetching,
		activeView: state.config.activeView
	};
};

class App extends React.Component {
	render() {
		const { isFetching, activeView } = this.props;

		return (
			<Root
				activeView={activeView}
				popout={
					isFetching &&
					activeView !== "loginView" && <ScreenSpinner />
				}
			>
				<View id="loginView" activePanel="login">
					<Login id="login" />
				</View>
				<View id="mainView" activePanel="marks">
					<Marks id="marks" />
				</View>
				<View id="profileView" activePanel="profile">
					<Profile id="profile" />
				</View>
			</Root>
		);
	}
}

export default connect(mapStateToProps)(App);
