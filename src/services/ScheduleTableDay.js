import React, { useEffect, useState } from "react";
import { RichCell, Group, Caption, Header, Cell } from "@vkontakte/vkui";
import moment from "moment";
import "moment/locale/ru";
import LessonCell from "../cells/LessonCell";

moment.locale("ru");

const ScheduleTableDay = ({ lessonsDay, isTeacher, number, style }) => {
	const [parsedLessons, setParsedLessons] = useState([]);

	useEffect(() => {
		setParsedLessons(createTableData(lessonsDay));
	}, [lessonsDay]);

	const createTableData = (data) => {
		const pairtimes = [
			{ start_time: "8:30", end_time: "10:10" },
			{ start_time: "10:20", end_time: "12:00" },
			{ start_time: "12:20", end_time: "14:00" },
			{ start_time: "14:10", end_time: "15:50" },
			{ start_time: "16:00", end_time: "17:40" },
			{ start_time: "18:00", end_time: "19:30" },
			{ start_time: "19:40", end_time: "21:10" },
			{ start_time: "21:20", end_time: "22:50" },
		];

		let lessonsDay = [];
		const groups = [[], [], [], [], [], [], [], []];
		data.forEach((lesson) => {
			switch (new Date(lesson.start_date).getHours()) {
				case 8:
					lessonsDay[0] = {
						...pairtimes[0],
						...lesson,
					};
					groups[0].push(lesson.stgroup);

					break;
				case 10:
					lessonsDay[1] = {
						...pairtimes[1],
						...lesson,
					};
					groups[1].push(lesson.stgroup);

					break;
				case 12:
					lessonsDay[2] = {
						...pairtimes[2],
						...lesson,
					};
					groups[2].push(lesson.stgroup);

					break;
				case 14:
					lessonsDay[3] = {
						...pairtimes[3],
						...lesson,
					};
					groups[3].push(lesson.stgroup);
					break;
				case 16:
					lessonsDay[4] = {
						...pairtimes[4],
						...lesson,
					};
					groups[4].push(lesson.stgroup);
					break;
				case 18:
					lessonsDay[5] = {
						...pairtimes[5],
						...lesson,
					};
					groups[5].push(lesson.stgroup);

					break;
				case 19:
					lessonsDay[6] = {
						...pairtimes[6],
						...lesson,
					};
					groups[6].push(lesson.stgroup);

					break;
				case 21:
					lessonsDay[7] = {
						...pairtimes[7],
						...lesson,
					};
					groups[7].push(lesson.stgroup);

					break;
				default:
					throw new Error("err");
			}
		});

		if (isTeacher)
			lessonsDay = lessonsDay.map((lesson, i) => {
				return { ...lesson, stgroups: groups[i] };
			});

		return lessonsDay;
	};

	return (
		<div style={{ maxWidth: 400, ...style }}>
			<Header mode="secondary">
				{moment()
					.add(number, "days")
					.format("D MMMM, dddd")}
			</Header>
			{(lessonsDay.length > 0 && (
				<React.Fragment>
					{parsedLessons.map((lesson, i) => {
						return (
							<LessonCell
								key={i}
								lesson={lesson}
								isTeacher={isTeacher}
							/>
						);
					})}
				</React.Fragment>
			)) || <Cell style={{ textAlign: "center" }}>Нет пар</Cell>}
		</div>
	);
};

export default ScheduleTableDay;
