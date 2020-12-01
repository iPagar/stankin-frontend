import React, { useEffect, useState } from "react";
import { Header, CardGrid, Placeholder } from "@vkontakte/vkui";
import moment from "moment";
import "moment/locale/ru";
import LessonCell from "../cells/LessonCell";

import Icon56GestureOutline from "@vkontakte/icons/dist/56/gesture_outline";

moment.locale("ru");

const ScheduleTableDay = ({
	lessonsDay,
	withHeaders,
	isTeacher,
	number,
	style,
}) => {
	const [parsedLessons, setParsedLessons] = useState([]);

	useEffect(() => {
		setParsedLessons(createTableData(lessonsDay));
	}, [lessonsDay]);

	const createTableData = (data) => {
		let lessonsDay = [];
		const groups = [[], [], [], [], [], [], [], []];
		data.forEach((lesson) => {
			const day = moment(lesson.start_date);

			lessonsDay.push({
				start_time: day.format("H:mm"),
				end_time:
					moment.utc(lesson.start_date).hours() + 3 < 18
						? day.add(100, "minutes").format("H:mm")
						: day.add(90, "minutes").format("H:mm"),
				...lesson,
			});
		});

		if (isTeacher)
			lessonsDay = lessonsDay.map((lesson, i) => {
				return { ...lesson, stgroups: groups[i] };
			});

		return lessonsDay;
	};

	return (
		<div style={{ maxWidth: 400, display: "contents", ...style }}>
			<Header mode="secondary">
				{withHeaders &&
					moment()
						.add(number, "days")
						.format("D MMMM, dddd")}
			</Header>

			{(lessonsDay.length > 0 && (
				<CardGrid>
					{parsedLessons.map((lesson, i) => {
						return (
							<LessonCell
								key={i}
								lesson={lesson}
								isTeacher={isTeacher}
							/>
						);
					})}
				</CardGrid>
			)) || (
				<Placeholder icon={<Icon56GestureOutline />} header="Нет пар" />
			)}
		</div>
	);
};

export default ScheduleTableDay;

// lessonsDay.length > 0
// 					? lessonsDay.length === 1
// 						? `Сегодня ${lessonsDay.length} пара`
// 						: lessonsDay.length > 1 && lessonsDay.length < 5
// 						? `Сегодня ${lessonsDay.length} пары`
// 						: `Сегодня ${lessonsDay.length} пар`
// 					: "Сегодня нет пар"
