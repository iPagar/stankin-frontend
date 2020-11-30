import React from "react";
import { RichCell, Caption, Card } from "@vkontakte/vkui";

const LessonCell = ({ lesson, isTeacher }) => {
	return (
		<Card size="l">
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
						"ведет "} ${lesson.teacher && lesson.teacher}`
				}
				multiline
			>
				{lesson.subject}
			</RichCell>
		</Card>
	);
};

export default LessonCell;
