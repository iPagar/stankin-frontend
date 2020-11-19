import React, { useState, useEffect } from "react";
import { View, Panel, PanelHeader, List, Cell } from "@vkontakte/vkui";
import { useSelector, useDispatch } from "react-redux";
import { setStory } from "../redux/actions";

import Profile from "../panels/Profile";

import Icon28Users from "@vkontakte/icons/dist/28/users";
import Icon28UserCircleOutline from "@vkontakte/icons/dist/28/user_circle_outline";

const BurgerView = ({ id }) => {
	const [activePanel, setActivePanel] = useState("main");
	const dispatch = useDispatch();
	const student = useSelector((state) => state.init.student, {});

	useEffect(() => {
		const hash = window.location.hash.slice(1);

		if (hash === "teachers") setActivePanel(hash);
	}, []);

	return (
		<View id={id} activePanel={activePanel}>
			<Panel id="main">
				<PanelHeader>Меню</PanelHeader>
				<List>
					{student.hasOwnProperty("student") && (
						<Cell
							expandable
							before={<Icon28UserCircleOutline />}
							onClick={() => {
								setActivePanel("profile");
							}}
						>
							Профиль
						</Cell>
					)}

					<Cell
						expandable
						before={<Icon28Users />}
						onClick={() => {
							dispatch(setStory("teachersView"));
						}}
					>
						Преподаватели
					</Cell>
				</List>
			</Panel>

			<Profile
				id="profile"
				onCancelClick={() => {
					setActivePanel("main");
				}}
			/>
		</View>
	);
};

export default BurgerView;
