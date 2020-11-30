import React, { useEffect } from "react";
import {
	View,
	Panel,
	PanelHeader,
	List,
	ModalRoot,
	SimpleCell,
} from "@vkontakte/vkui";
import { useSelector, useDispatch } from "react-redux";
import {
	setBurgerPanel,
	setBurgerModal,
	setSearchTeacher,
} from "../redux/actions";

import Profile from "../panels/Profile";
import TeachersPanel from "../panels/TeachersPanel";
import CommentsPage from "../cells/CommentsPage";
import WriteCommentCard from "../cells/WriteCommentCard";
import ReactionsCard from "../cells/ReactionsCard";

import Icon28Users from "@vkontakte/icons/dist/28/users";
import Icon28UserCircleOutline from "@vkontakte/icons/dist/28/user_circle_outline";

const BurgerView = ({ id }) => {
	const activePanel = useSelector((state) => state.burger.activePanel);
	const activeModal = useSelector((state) => state.burger.activeModal);
	const popout = useSelector((state) => state.burger.popout);
	const dispatch = useDispatch();

	useEffect(() => {
		const hash = window.location.hash.slice(1);
		let burgerPanel = "main";
		let teacherName = "";

		if (hash.includes("teachers")) {
			burgerPanel = "teachers";
			dispatch(setBurgerPanel(burgerPanel));

			if (hash.match(/\?.*/)[0].slice(1)) {
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
				</List>
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
