import React, { useState, useEffect } from "react";
import {
	View,
	Panel,
	PanelHeader,
	PanelSpinner,
	Cell,
	Group,
	PanelHeaderBack,
	Search,
} from "@vkontakte/vkui";
import { api } from "../services";

import TeacherPanel from "../panels/TeacherPanel";

const TeachersView = ({ id, onCancelClick }) => {
	const date = new Date();

	const [lessons, setLessons] = useState([]);
	const [teachers, setTeachers] = useState([]);
	const [name, setName] = useState("");
	const [activeTeacher, setActiveTeacher] = useState("");
	const [activePanel, setActivePanel] = useState("main");
	const [isLoading, setIsLoading] = useState(true);

	const getTeachers = async () => {
		await api.get(`/teachers?name=${name}`).then(({ data }) => {
			setTeachers(data);
		});

		setIsLoading(false);
	};

	useEffect(() => {
		getTeachers();
	}, []);

	const getLessons = async (activeTeacher) => {
		// получаем пары
		const secondName = activeTeacher.match(/[А-Яа-я]*/)[0];
		const firstName = activeTeacher.match(/ ([А-Яа-я]*)/)[1];
		const thirdName = activeTeacher
			.slice(
				firstName.length + secondName.length + 2,
				activeTeacher.length
			)
			.match(/[А-Яа-я]*/)[0];

		const formattedName = `${secondName} ${firstName[0]}.${thirdName[0]}.`;

		let lessons = [];
		for (var i = 0; i < 7; i++) {
			const result = new Date(date);
			result.setDate(result.getDate() + i);
			const parsedDate =
				result.getFullYear() +
				"-" +
				parseInt(result.getMonth() + 1) +
				"-" +
				result.getDate();

			await api
				.get(
					`/schedule/lessons/teacher?teacher=${formattedName}&day=${parsedDate}`
				)
				.then(({ data }) => {
					lessons = lessons.concat([data]);
				});
		}

		setLessons(lessons);
	};

	const filterTeachers = () => {
		return teachers.filter(
			(teacher) =>
				teacher.name.toLowerCase().indexOf(name.toLowerCase()) > -1
		);
	};

	return (
		<View id={id} activePanel={activePanel}>
			<Panel id="main">
				<PanelHeader
					separator={false}
					left={<PanelHeaderBack onClick={onCancelClick} />}
				>
					Преподаватели
				</PanelHeader>
				<Search
					value={name}
					onChange={(e) => {
						setName(e.currentTarget.value);
					}}
				/>
				{!isLoading ? (
					<Group>
						{filterTeachers()
							.slice(0, 10)
							.map((teacher) => (
								<Cell
									key={teacher.name}
									onClick={() => {
										setActiveTeacher(teacher.name);
									}}
								>
									{teacher.name}
								</Cell>
							))}
					</Group>
				) : (
					<PanelSpinner size="large" />
				)}
			</Panel>
			<TeacherPanel
				id="teacher"
				teacher={activeTeacher}
				lessons={lessons}
				date={date}
				onBack={() => {
					setActivePanel("main");
					setActiveTeacher("");
					setLessons([]);
				}}
			/>
		</View>
	);
};

export default TeachersView;
