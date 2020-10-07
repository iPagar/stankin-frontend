import React from "react";
import { RichCell, Group, Caption } from "@vkontakte/vkui";

const ScheduleTable = ({ lessons }) => {
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

		const pairs = pairtimes.map((pairtime) => {
			switch (parseInt(pairtime.start_time.match(/\d*[^:]/))) {
				case 8:
					return pairtimes[0];

				case 10:
					return pairtimes[1];

				case 12:
					return pairtimes[2];

				case 14:
					return pairtimes[3];

				case 16:
					return pairtimes[4];

				case 18:
					return pairtimes[5];

				case 19:
					return pairtimes[6];

				case 21:
					return pairtimes[7];
				default:
					throw new Error("err");
			}
		});

		data.forEach((lesson) => {
			switch (new Date(lesson.start_date).getHours()) {
				case 8:
					pairs[0] = { ...pairs[0], ...lesson };
					break;
				case 10:
					pairs[1] = { ...pairs[1], ...lesson };
					break;
				case 12:
					pairs[2] = { ...pairs[2], ...lesson };
					break;
				case 14:
					pairs[3] = { ...pairs[3], ...lesson };
					break;
				case 16:
					pairs[4] = { ...pairs[4], ...lesson };
					break;
				case 18:
					pairs[5] = { ...pairs[5], ...lesson };
					break;
				case 19:
					pairs[6] = { ...pairs[6], ...lesson };
					break;
				case 21:
					pairs[7] = { ...pairs[7], ...lesson };
					break;
				default:
					throw new Error("err");
			}
		});

		return pairs;
	};

	return createTableData(lessons).map((lesson) => {
		return (
			<Group key={lesson.start_time}>
				<RichCell
					before={
						<div style={{ padding: 12 }}>
							<Caption level="1" weight="semibold" caps>
								{lesson.start_time}
							</Caption>

							<Caption level="1" weight="semibold" caps>
								{lesson.end_time}
							</Caption>
						</div>
					}
					caption={
						!lesson.audience && lesson.subject
							? "Онлайн"
							: lesson.audience
					}
					text={
						lesson.subject &&
						`${lesson.type} ${lesson.teacher &&
							`ведет ${lesson.teacher}`}`
					}
					multiline
				>
					{lesson.subject}
				</RichCell>
			</Group>
		);
	});
};

export default ScheduleTable;
