import React, { useState, useEffect } from "react";
import { RichCell, Group, Caption, Header, Placeholder } from "@vkontakte/vkui";

const LessonCell = ({ lesson, isTeacher }) => {
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
					`${lesson.type} ${
						lesson.teacher && !isTeacher
							? `ведет ${lesson.teacher}`
							: `у ${lesson.stgroups.toString()} ${
									lesson.group !== "Без подгруппы"
										? `подгруппы ${lesson.group.slice(
												1,
												2
										  )}`
										: ""
							  } `
					}`
				}
				multiline
			>
				{lesson.subject}
			</RichCell>
		</Group>
	);
};

export default LessonCell;
