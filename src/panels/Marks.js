import React from "react";
import {
	Panel,
	PanelHeader,
	PanelHeaderContent,
	HeaderContext,
	List,
	Cell,
	FixedLayout,
	Tabs,
	HorizontalScroll,
	TabsItem,
	HeaderButton
} from "@vkontakte/vkui";
import { connect } from "react-redux";
import { selectSemester, setActiveTopTab, setView } from "../redux/actions";

import Icon16Dropdown from "@vkontakte/icons/dist/16/dropdown";
import Icon24Done from "@vkontakte/icons/dist/24/done";

import Table from "./Table";
import Top from "./Top";

import Icon24Settings from "@vkontakte/icons/dist/24/settings";

const mapStateToProps = state => {
	return {
		selectedSemester: state.init.selectedSemester,
		semesters: state.init.semesters,
		marks: state.init.marks[state.init.selectedSemester],
		scheme: state.config.scheme,
		activeTopTab: state.config.activeTopTab,
		activeBottomTab: state.config.activeBottomTab
	};
};

const mapDispatchToProps = dispatch => {
	return {
		onCellClick: tag => {
			dispatch(selectSemester(tag));
		},
		onTopTab: tag => {
			dispatch(setActiveTopTab(tag));
		},
		onProfileClick: tag => {
			dispatch(setView(tag));
		}
	};
};

class Marks extends React.Component {
	state = {
		contextOpened: false,
		isFetching: false,
		popout: null,
		tooltip: false,
		login: "",
		password: ""
	};

	toggleContext = () => {
		this.setState({ contextOpened: !this.state.contextOpened });
	};

	select = e => {
		const tag = e.currentTarget.dataset.tag;

		this.props.onCellClick(tag);

		window.scrollTo(0, 0);
		requestAnimationFrame(this.toggleContext);
	};

	semesterFormat(semester) {
		return `${semester.slice(0, 4)} ${semester.slice(5, 10)}`;
	}

	selectTopTab = e => {
		const tag = e.currentTarget.dataset.tag;

		this.props.onTopTab(tag);
	};

	onProfileClick = e => {
		const tag = e.currentTarget.dataset.tag;

		this.props.onProfileClick(tag);
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

	renderHeaderContext() {
		const { semesters, selectedSemester } = this.props;

		return (
			<HeaderContext
				opened={this.state.contextOpened}
				onClose={this.toggleContext}
			>
				<List style={{ top: 46 }}>
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
			</HeaderContext>
		);
	}

	render() {
		const { semesters, marks, selectedSemester, activeTopTab } = this.props;
		const semester = this.semesterFormat(semesters[selectedSemester]);

		return (
			<Panel id="marks" theme="white" centered={activeTopTab === "marks"}>
				<PanelHeader
					left={
						<HeaderButton
							data-tag="profileView"
							onClick={this.onProfileClick}
						>
							<Icon24Settings />
						</HeaderButton>
					}
					noShadow
				>
					<PanelHeaderContent
						aside={<Icon16Dropdown />}
						onClick={this.toggleContext}
					>
						{semester}
					</PanelHeaderContent>
				</PanelHeader>

				{this.renderHeaderContext()}
				{this.renderFixedTop()}
				{(activeTopTab === "marks" && <Table marks={marks} />) || (
					<Top />
				)}
			</Panel>
		);
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(Marks);
