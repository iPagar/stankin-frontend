import React from "react";
import {
	Epic,
	View,
	Root,
	ScreenSpinner,
	Tabbar,
	TabbarItem,
} from "@vkontakte/vkui";
import { connect } from "react-redux";
import { setStory } from "./redux/actions";
import "@vkontakte/vkui/dist/vkui.css";
import "./app.css";

import Icon28CalendarOutline from "@vkontakte/icons/dist/28/calendar_outline";
import Icon20EducationOutline from "@vkontakte/icons/dist/20/education_outline";
import Icon24Users from "@vkontakte/icons/dist/24/users";

import Login from "./panels/Login";
import Marks from "./panels/Marks";
import Profile from "./panels/Profile";
import ScheduleView from "./views/ScheduleView";
import TeachersView from "./views/TeachersView";
import StgroupsView from "./views/StgroupsView";
import GroupsView from "./views/GroupsView";

const mapStateToProps = (state) => {
	return {
		isFetching: state.init.isFetching,
		activeView: state.config.activeView,
		activeStory: state.config.activeStory,
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		onStoryChange: (e) => {
			dispatch(setStory(e.currentTarget.dataset.story));
		},
		changeStory: (story) => {
			dispatch(setStory(story));
		},
	};
};

class App extends React.Component {
	componentDidMount() {
		const hash = window.location.hash.slice(1);
		let story = "scheduleView";

		switch (hash) {
			case "marks":
				story = "marksRoot";
				break;
			default:
				story = "scheduleView";
				break;
		}
		this.props.changeStory(story);
	}

	render() {
		const {
			isFetching,
			activeView,
			activeStory,
			onStoryChange,
		} = this.props;
		const withTeachers = false;

		return (
			<Epic
				activeStory={activeStory}
				tabbar={
					<Tabbar>
						<TabbarItem
							onClick={onStoryChange}
							selected={activeStory === "scheduleView"}
							data-story="scheduleView"
						>
							<Icon28CalendarOutline />
						</TabbarItem>
						<TabbarItem
							onClick={onStoryChange}
							selected={activeStory === "marksRoot"}
							data-story="marksRoot"
						>
							<Icon20EducationOutline width={28} height={28} />
						</TabbarItem>
						{withTeachers && (
							<TabbarItem
								onClick={onStoryChange}
								selected={activeStory === "teachersView"}
								data-story="teachersView"
							>
								<Icon24Users width={28} height={28} />
							</TabbarItem>
						)}
					</Tabbar>
				}
			>
				<Root
					id="marksRoot"
					activeView={activeView}
					popout={
						isFetching &&
						activeView !== "loginView" && <ScreenSpinner />
					}
				>
					<View id="loginView" activePanel="login" header={false}>
						<Login id="login" />
					</View>
					<View id="mainView" activePanel="marks" header={false}>
						<Marks id="marks" />
					</View>
					<View id="profileView" activePanel="profile" header={false}>
						<Profile id="profile" />
					</View>
				</Root>
				<ScheduleView id="scheduleView" />
				<TeachersView id="teachersView" />
				<StgroupsView id="stgroupsView" />
				<GroupsView id="groupsView" />
			</Epic>
		);
	}
}

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(App);
