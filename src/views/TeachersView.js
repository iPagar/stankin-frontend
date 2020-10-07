import React, { useState, useEffect } from "react";
import {
	View,
	Panel,
	PanelHeader,
	PanelSpinner,
	PanelHeaderBack,
	Cell,
	Group,
	Search,
} from "@vkontakte/vkui";
import { api } from "../services";

const TeachersView = ({ id }) => {
	const [teachers, setTeachers] = useState([]);
	const [name, setName] = useState("");
	const [activePanel, setActivePanel] = useState("main");
	const [isLoading, setIsLoading] = useState(true);
	const [choosed, setChoosed] = useState(null);

	const getTeachers = async () => {
		await api.get(`/teachers?name=${name}`).then(({ data }) => {
			setTeachers(data);
		});

		setIsLoading(false);
	};

	useEffect(() => {
		getTeachers();
	}, []);

	const filterTeachers = () => {
		return teachers.filter(
			(teacher) =>
				teacher.name.toLowerCase().indexOf(name.toLowerCase()) > -1
		);
	};

	return (
		<View id={id} activePanel={activePanel}>
			<Panel id="main">
				<PanelHeader separator={false}>Преподователи</PanelHeader>
				<Search
					value={name}
					onChange={(e) => {
						setName(e.currentTarget.value);
					}}
				/>
				{!isLoading ? (
					<Group>
						{filterTeachers().map((teacher) => (
							<Cell
								key={teacher}
								onClick={() => {
									setActivePanel("teacher");
								}}
								expandable
							>
								{teacher.name}
							</Cell>
						))}
					</Group>
				) : (
					<PanelSpinner size="large" />
				)}
			</Panel>
			<Panel id="teacher">
				<PanelHeader
					left={
						<PanelHeaderBack
							onClick={() => {
								setActivePanel("main");
							}}
						/>
					}
					separator={false}
				>
					Преподователь
				</PanelHeader>

				{!isLoading ? (
					<Group>
						<Cell>{teachers[0].name}</Cell>
					</Group>
				) : (
					<PanelSpinner size="large" />
				)}
			</Panel>
		</View>
	);
};

export default TeachersView;
