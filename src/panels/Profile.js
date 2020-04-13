import React from "react";
import {
	Panel,
	PanelHeaderButton,
	PanelHeaderSimple,
	List,
	Cell,
	Header,
	InfoRow,
	CellButton,
} from "@vkontakte/vkui";
import { connect } from "react-redux";
import { setView, notify, exit } from "../redux/actions";

import Icon24Cancel from "@vkontakte/icons/dist/24/cancel";
import Icon24Notification from "@vkontakte/icons/dist/24/notification";

const mapStateToProps = (state) => {
	return {
		student: state.init.student,
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		onCancelClick: (tag) => {
			dispatch(setView(tag));
		},
		onNotifyClick: () => {
			dispatch(notify());
		},
		onExitClick: () => {
			dispatch(exit());
		},
	};
};

class Profile extends React.Component {
	onCancelClick = (e) => {
		const tag = e.currentTarget.dataset.tag;

		this.props.onCancelClick(tag);
	};

	onExit = () => {
		this.props.onExitClick();
	};

	setNotify = () => {
		this.props.onNotifyClick();
	};

	renderExit() {
		return (
			<CellButton mode={"danger"} onClick={this.onExit}>
				Выйти
			</CellButton>
		);
	}

	renderNotify() {
		const { notify } = this.props.student;

		return (
			<CellButton
				mode={(notify && `danger`) || `primary`}
				onClick={this.setNotify}
				before={<Icon24Notification />}
			>
				{(notify && `Не у`) || `У`}ведомлять об оценках
			</CellButton>
		);
	}

	renderProfile() {
		const { student } = this.props;

		return (
			<div>
				<Header level="secondary">Информация о студенте</Header>
				<List>
					<Cell>
						<InfoRow header="ФИО">
							{`${student.surname} ${student.initials}`}
						</InfoRow>
					</Cell>
					<Cell>
						<InfoRow header="Студенческий билет">
							{student.student}
						</InfoRow>
					</Cell>
					<Cell>
						<InfoRow header="Группа">{student.stgroup}</InfoRow>
					</Cell>
				</List>
			</div>
		);
	}

	render() {
		return (
			<Panel id="profile" theme="white" separator={false}>
				<PanelHeaderSimple
					left={
						<PanelHeaderButton
							data-tag="mainView"
							onClick={this.onCancelClick}
						>
							<Icon24Cancel />
						</PanelHeaderButton>
					}
				>
					Профиль
				</PanelHeaderSimple>
				{this.renderProfile()}
				<List>
					{this.renderNotify()}
					{this.renderExit()}
				</List>
			</Panel>
		);
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(Profile);
