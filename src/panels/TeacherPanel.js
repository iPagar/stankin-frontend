import React, { useState, useEffect } from "react";
import {
	Panel,
	PanelHeader,
	PanelHeaderBack,
	Gallery,
	Header,
	Div,
} from "@vkontakte/vkui";
import ScheduleTableWeek from "../services/ScheduleTableWeek";

const TeacherPanel = ({ teacher, lessons, onBack, date }) => {
	const [choosed, setChoosed] = useState(1);

	useEffect(() => {}, [choosed, lessons]);

	return (
		<Panel id="teacher">
			<PanelHeader
				left={<PanelHeaderBack onClick={onBack} />}
				separator={false}
			>
				Преподаватель
			</PanelHeader>
			<ScheduleTableWeek lessonsWeek={lessons} isTeacher />
		</Panel>
	);
};

export default TeacherPanel;
