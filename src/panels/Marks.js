import React from "react";
import {
	Panel,
	PanelHeaderSimple,
	PanelHeaderContext,
	PanelHeaderContent,
	List,
	Cell,
	FixedLayout,
	Tabs,
	HorizontalScroll,
	TabsItem,
	PanelHeaderButton,
} from "@vkontakte/vkui";
import { connect } from "react-redux";
import { selectSemester, setActiveTopTab, notify } from "../redux/actions";

import Icon16Dropdown from "@vkontakte/icons/dist/16/dropdown";
import Icon24Done from "@vkontakte/icons/dist/24/done";

import Table from "./Table";
import Top from "./Top";

import Icon24Notification from "@vkontakte/icons/dist/24/notification";
import Icon24NotificationDisable from "@vkontakte/icons/dist/24/notification_disable";

const mapStateToProps = (state) => {
	return {
		student: state.init.student,
		selectedSemester: state.init.selectedSemester,
		semesters: state.init.semesters,
		marks: state.init.marks[state.init.selectedSemester],
		scheme: state.config.scheme,
		activeTopTab: state.config.activeTopTab,
		activeBottomTab: state.config.activeBottomTab,
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		onNotifyClick: () => {
			dispatch(notify());
		},
		onCellClick: (tag) => {
			dispatch(selectSemester(tag));
		},
		onTopTab: (tag) => {
			dispatch(setActiveTopTab(tag));
		},
	};
};

class Marks extends React.Component {
	state = {
		contextOpened: false,
		isFetching: false,
		popout: null,
		tooltip: false,
		login: "",
		password: "",
	};

	toggleContext = () => {
		this.setState({ contextOpened: !this.state.contextOpened });
	};

	select = (e) => {
		const tag = e.currentTarget.dataset.tag;

		this.props.onCellClick(tag);

		window.scrollTo(0, 0);
		requestAnimationFrame(this.toggleContext);
	};

	semesterFormat(semester) {
		return `${semester.slice(0, 4)} ${semester.slice(5, 10)}`;
	}

	selectTopTab = (e) => {
		const { contextOpened } = this.state;
		const tag = e.currentTarget.dataset.tag;

		if (contextOpened) requestAnimationFrame(this.toggleContext);
		this.props.onTopTab(tag);
	};

	renderFixedTop() {
		const { activeTopTab } = this.props;

		return (
			<FixedLayout vertical="top">
				<Tabs theme="header" type="buttons">
					<HorizontalScroll>
						<TabsItem
							data-tag={"marks"}
							onClick={this.selectTopTab}
							selected={activeTopTab === "marks"}
						>
							Оценки
						</TabsItem>
						<TabsItem
							data-tag={"top"}
							onClick={this.selectTopTab}
							selected={activeTopTab === "top"}
						>
							Топ
						</TabsItem>
					</HorizontalScroll>
				</Tabs>
			</FixedLayout>
		);
	}

	renderPanelHeaderContext() {
		const { semesters, selectedSemester, activeTopTab } = this.props;

		return (
			<PanelHeaderContext
				opened={this.state.contextOpened}
				onClose={this.toggleContext}
			>
				<div
					style={{
						marginTop: activeTopTab === "marks" ? -4 : 40,
					}}
				>
					<List>
						{semesters.map((semester, i) => (
							<Cell
								key={i}
								data-tag={i}
								asideContent={
									selectedSemester === i ? (
										<Icon24Done fill="var(--accent)" />
									) : null
								}
								onClick={this.select}
							>
								{this.semesterFormat(semester)}
							</Cell>
						))}
					</List>
				</div>
			</PanelHeaderContext>
		);
	}

	render() {
		const { semesters, marks, selectedSemester, activeTopTab } = this.props;
		const semester = this.semesterFormat(semesters[selectedSemester]);

		return (
			<Panel
				id="marks"
				theme="white"
				centered={activeTopTab === "marks"}
				separator={false}
			>
				<PanelHeaderSimple
					separator={false}
					left={
						<PanelHeaderButton onClick={this.props.onNotifyClick}>
							{this.props.student.notify ? (
								<Icon24NotificationDisable />
							) : (
								<Icon24Notification />
							)}
						</PanelHeaderButton>
					}
				>
					<PanelHeaderContent
						aside={
							<Icon16Dropdown
								style={{
									transform: `rotate(${
										this.state.contextOpened
											? "180deg"
											: "0"
									})`,
								}}
							/>
						}
						onClick={this.toggleContext}
					>
						{semester}
					</PanelHeaderContent>
				</PanelHeaderSimple>

				{this.renderPanelHeaderContext()}
				{this.renderFixedTop()}
				{(activeTopTab === "marks" && (
					<Table marks={marks} semester={semester} />
				)) || <Top />}
			</Panel>
		);
	}
}

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(Marks);
