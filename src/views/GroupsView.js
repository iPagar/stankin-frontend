import React, { useState, useEffect } from "react";
import {
	View,
	Panel,
	PanelHeader,
	PanelSpinner,
	PanelHeaderBack,
	Cell,
	Group,
} from "@vkontakte/vkui";
import { useDispatch, useSelector } from "react-redux";
import { setStory, setActiveGroup } from "../redux/actions";
import { api } from "../services";

const GroupsView = ({ id }) => {
	const [groups, setGroups] = useState("");
	const stgroup = useSelector((state) => state.schedule.activeStgroup);
	const [isLoading, setIsLoading] = useState(true);
	const dispatch = useDispatch();

	const getGroups = async () => {
		await api
			.get(`/schedule/groups?stgroup=${stgroup}`)
			.then(({ data }) => {
				setGroups(data);
			});

		setIsLoading(false);
	};

	useEffect(() => {
		getGroups();
	}, []);

	const onBack = () => {
		dispatch(setStory("scheduleView"));
	};

	return (
		<View id={id} activePanel="main">
			<Panel id="main">
				<PanelHeader
					left={<PanelHeaderBack onClick={onBack} />}
					separator={false}
				>
					Выбор подгруппы
				</PanelHeader>
				{!isLoading ? (
					<Group>
						{groups.length > 1 ? (
							groups
								.filter((group) => group !== "Без подгруппы")
								.map((group) => (
									<Cell
										key={group}
										onClick={() => {
											dispatch(setActiveGroup(group));
											onBack();
										}}
									>
										{group}
									</Cell>
								))
						) : (
							<Cell
								onClick={() => {
									dispatch(setActiveGroup(groups[0]));
									onBack();
								}}
							>
								{groups[0]}
							</Cell>
						)}
					</Group>
				) : (
					<PanelSpinner size="large" />
				)}
			</Panel>
		</View>
	);
};

export default GroupsView;
