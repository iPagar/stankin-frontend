import React from "react";
import {
	Panel,
	PanelHeaderSimple,
	FormLayout,
	Input,
	Button,
	Snackbar,
	Avatar,
} from "@vkontakte/vkui";
import { Spring } from "react-spring/renderprops";
import { connect } from "react-redux";
import { fetchInit, setView } from "../redux/actions";
import { api } from "../services";

import Icon24Error from "@vkontakte/icons/dist/24/error";

import Logo from "./Logo";

const orangeBackground = {
	backgroundImage: "linear-gradient(135deg, #ffb73d, #ffa000)",
};

const mapStateToProps = (state) => {
	return {
		student: state.init.student,
		didInvalidate: state.init.didInvalidate,
		scheme: state.config.scheme,
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		onPanelLoad: () => {
			dispatch(fetchInit());
		},
		openMarks: () => {
			dispatch(setView("mainView"));
		},
	};
};

class Login extends React.Component {
	state = {
		isFetching: false,
		popout: null,
		login: "",
		password: "",
	};

	componentDidMount() {
		if (!this.props.student.hasOwnProperty("student"))
			this.props.onPanelLoad();
		else this.props.openMarks();
	}

	onSubmit = (e) => {
		e.preventDefault();
		const { login, password } = this.state;

		this.setState({ isFetching: true });
		api.put("/student", { student: login, password })
			.then(() => {
				setTimeout(() => {
					this.props.onPanelLoad();
					this.setState({ isFetching: false });
				}, 200);
			})
			.catch(() => {
				this.openSnackbar();
				this.setState({ isFetching: false });
			});
	};

	openSnackbar() {
		if (this.state.snackbar) return;
		this.setState({
			snackbar: (
				<Snackbar
					layout="vertical"
					onClose={() => this.setState({ snackbar: null })}
					before={
						<Avatar size={24} style={orangeBackground}>
							<Icon24Error fill="#fff" width={20} height={20} />
						</Avatar>
					}
				>
					Произошла ошибка
				</Snackbar>
			),
		});
	}

	renderForm() {
		const { login, password, isFetching } = this.state;

		return (
			<React.Fragment>
				{(isFetching && <Logo />) || (
					<Spring
						config={{ duration: 500 }}
						from={{ opacity: 0 }}
						to={{ opacity: 1 }}
					>
						{(props) => (
							<div style={props}>
								<FormLayout onSubmit={this.onSubmit}>
									<Input
										value={login}
										onChange={(e) => {
											this.setState({
												login: e.target.value,
											});
										}}
										type="number"
										placeholder="Логин"
									/>
									<Input
										value={password}
										onChange={(e) => {
											this.setState({
												password: e.target.value,
											});
										}}
										type="password"
										placeholder="Пароль"
									/>
									<Button size="xl">Войти</Button>
								</FormLayout>
							</div>
						)}
					</Spring>
				)}
			</React.Fragment>
		);
	}

	render() {
		const { snackbar } = this.state;
		const { didInvalidate } = this.props;

		return (
			<Panel id="login" theme="white" separator={false} centered>
				<PanelHeaderSimple>Модульный журнал</PanelHeaderSimple>
				{(didInvalidate && this.renderForm()) || <Logo />}
				{snackbar}
			</Panel>
		);
	}
}

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(Login);
