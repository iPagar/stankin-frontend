import React, { useEffect, useState } from "react";
import {
	View,
	Panel,
	PanelHeader,
	List,
	ModalRoot,
	SimpleCell,
	Banner,
	Button,
	Snackbar,
} from "@vkontakte/vkui";
import { useSelector, useDispatch } from "react-redux";
import {
	setBurgerPanel,
	setBurgerModal,
	setSearchTeacher,
	notify,
} from "../redux/actions";
import bridge from "@vkontakte/vk-bridge";
import Profile from "../panels/Profile";
import TeachersPanel from "../panels/TeachersPanel";
import CommentsPage from "../cells/CommentsPage";
import WriteCommentCard from "../cells/WriteCommentCard";
import ReactionsCard from "../cells/ReactionsCard";

import Icon28Users from "@vkontakte/icons/dist/28/users";
import Icon28UserCircleOutline from "@vkontakte/icons/dist/28/user_circle_outline";
import Icon20Info from "@vkontakte/icons/dist/20/info";

import Icon28NotificationCircleFillGray from "@vkontakte/icons/dist/28/notification_circle_fill_gray";

const BurgerView = ({ id }) => {
	const activePanel = useSelector((state) => state.burger.activePanel);
	const activeModal = useSelector((state) => state.burger.activeModal);
	const student = useSelector((state) => state.init.student);
	const popout = useSelector((state) => state.burger.popout);
	const [snackbar, setSnackbar] = useState(null);
	const dispatch = useDispatch();

	useEffect(() => {
		const hash = window.location.hash.slice(1);
		let burgerPanel = "main";
		let teacherName = "";

		if (hash.includes("teachers")) {
			burgerPanel = "teachers";
			dispatch(setBurgerPanel(burgerPanel));

			if (hash.match(/\?.*/) && hash.match(/\?.*/)[0].slice(1)) {
				teacherName = decodeURI(hash.match(/\?.*/)[0].slice(1));
				dispatch(setSearchTeacher(teacherName));
			}
		}
	}, []);

	const modal = (
		<ModalRoot
			activeModal={activeModal}
			onClose={() => {
				dispatch(setBurgerModal(null));
			}}
		>
			<CommentsPage id="comments" dynamicContentHeight />
			<WriteCommentCard id="text" />
			<ReactionsCard id="reactions" />
		</ModalRoot>
	);

	return (
		<View id={id} activePanel={activePanel} popout={popout} modal={modal}>
			<Panel id="main">
				<PanelHeader>Меню</PanelHeader>
				<List>
					{
						<SimpleCell
							expandable
							before={<Icon28UserCircleOutline />}
							onClick={() => {
								dispatch(setBurgerPanel("profile"));
							}}
						>
							Профиль
						</SimpleCell>
					}

					<SimpleCell
						expandable
						before={<Icon28Users />}
						onClick={() => {
							dispatch(setBurgerPanel("teachers"));
						}}
					>
						Преподаватели
					</SimpleCell>
					{student.hasOwnProperty("student") && !student.notify && (
						<Banner
							before={
								<Icon28NotificationCircleFillGray
									width={48}
									height={48}
								/>
							}
							text="Хотите получать уведомления о модулях? Мы пришлем их сообщением от сообщества!"
							actions={
								<React.Fragment>
									<Button
										onClick={() => {
											dispatch(notify());

											setSnackbar(
												<Snackbar
													before={<Icon20Info />}
													layout="vertical"
													onClose={() =>
														setSnackbar(null)
													}
												>
													Уведомления о модулях
													включены!
												</Snackbar>
											);
										}}
									>
										Хочу!
									</Button>
								</React.Fragment>
							}
						/>
					)}
				</List>
				{snackbar}
			</Panel>
			<TeachersPanel
				id="teachers"
				onCancelClick={() => {
					dispatch(setBurgerPanel("main"));
				}}
			/>
			<Profile
				id="profile"
				onCancelClick={() => {
					dispatch(setBurgerPanel("main"));
				}}
			/>
		</View>
	);
};

export default BurgerView;
