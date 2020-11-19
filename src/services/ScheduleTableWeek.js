import React, { useEffect, useState, useRef } from "react";
import {
	RichCell,
	Group,
	Caption,
	Header,
	Placeholder,
	FixedLayout,
	HorizontalScroll,
	getClassName,
	usePlatform,
	Headline,
} from "@vkontakte/vkui";
import ScheduleTableDay from "../services/ScheduleTableDay";

const HorizontalCalendar = ({
	date = new Date(),
	choosed = 1,
	isDarkWeekend = true,
	onClick,
}) => {
	const platform = usePlatform();
	const baseClassNames = getClassName("Card", platform);

	const onItemClick = (e) => {
		const choosedDay = e.currentTarget.dataset.day;

		const dayNumber =
			days().findIndex((day) => day.toString() === choosedDay) + 1;

		onClick && onClick({ choosedDay, dayNumber });
	};

	const itemStyle = {
		flexShrink: 0,
		height: 29,
		width: 29,
		display: "flex",
		flexDirection: "column",
		alignItems: "center",
		justifyContent: "center",
		clipPath: "circle()",
	};

	const days = () => {
		const dates = [];

		for (let i = 0; i < 7; i++) {
			const result = new Date(date);
			result.setDate(result.getDate() + i);
			dates.push(result);
		}

		return dates;
	};

	const getNameOfDay = (day) => {
		switch (day) {
			case 0:
				return "Вс";
			case 1:
				return "Пн";
			case 2:
				return "Вт";
			case 3:
				return "Ср";
			case 4:
				return "Чт";
			case 5:
				return "Пт";
			case 6:
				return "Сб";
			default:
				throw new RangeError({ message: "day" });
		}
	};

	return (
		<HorizontalScroll
			style={{
				display: "flex",
				alignItems: "center",
				justifyContent: "center",
			}}
		>
			<div
				style={{
					display: "flex",
				}}
			>
				{days(date).map((day, i) => {
					const dayNumber = day.getDay();

					return (
						<div
							key={day.toString()}
							style={{
								padding: 12,
								display: "flex",
								flexDirection: "column",
								alignItems: "center",
								color:
									isDarkWeekend &&
									(dayNumber === 0 || dayNumber === 6) &&
									"var(--text_secondary)",
							}}
							onClick={onItemClick}
							data-day={day}
						>
							<div
								style={{
									...itemStyle,
									backgroundColor:
										"var(--content_tint_background)",
									color:
										isDarkWeekend &&
										(dayNumber === 0 || dayNumber === 6)
											? "var(--text_secondary)"
											: "var(--text_primary)",
								}}
								className={baseClassNames}
							>
								<Headline weight="medium">
									{day.getDate()}
								</Headline>
							</div>
							<div>{getNameOfDay(dayNumber)}</div>
						</div>
					);
				})}
			</div>
		</HorizontalScroll>
	);
};

const ScheduleTableWeek = ({ lessonsWeek, isTeacher, before }) => {
	const [choosed, setChoosed] = useState(1);
	const lessonsRef = useRef();

	return (
		<React.Fragment>
			{window.innerWidth >= 768 || (
				<FixedLayout vertical="top" filled>
					<div style={{ margin: 0 }}>
						<HorizontalCalendar
							date={Date.now()}
							choosed={choosed}
							onClick={({ choosedDay, dayNumber }) => {
								window.scrollTo(
									0,
									lessonsRef.current.children[dayNumber]
										.offsetTop -
										60 -
										56
								);
								setChoosed(dayNumber);
							}}
						/>
					</div>
				</FixedLayout>
			)}

			{(window.innerWidth >= 768 && (
				<div
					style={{
						display: "flex",
						justifyContent: "space-between",
						flexWrap: "wrap",
					}}
				>
					{lessonsWeek.map((lessonsDay, i) => (
						<div key={i} style={{ width: 300 }}>
							<ScheduleTableDay
								lessonsDay={lessonsDay}
								number={i}
								isTeacher={isTeacher}
							/>
						</div>
					))}
				</div>
			)) || (
				<div
					style={{
						display: "flex",
						flexDirection: "column",
						paddingTop: 60,
					}}
					ref={lessonsRef}
				>
					{before}
					{lessonsWeek.map((lessonsDay, i) => (
						<ScheduleTableDay
							key={i}
							lessonsDay={lessonsDay}
							number={i}
							isTeacher={isTeacher}
						/>
					))}
				</div>
			)}
		</React.Fragment>
	);
};

export default ScheduleTableWeek;
