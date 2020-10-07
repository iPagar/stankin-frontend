import React, { useState, useEffect } from "react";
import {
	View,
	Panel,
	PanelHeader,
	PanelSpinner,
	PanelHeaderButton,
	Placeholder,
	Header,
	PanelHeaderBack,
	FixedLayout,
	Link,
	ScreenSpinner,
	Div,
	Gallery,
} from "@vkontakte/vkui";
import { useSelector, useDispatch } from "react-redux";
import { setModal, setActiveStgroup, setActiveGroup } from "../redux/actions";
import Icon28Settings from "@vkontakte/icons/dist/28/settings";
import HorizontalCalendar from "vkui-horizontal-calendar";
import ScheduleTable from "../services/ScheduleTable";
import { api } from "../services";
import ScheduleSettings from "./ScheduleSettings";
import Icon56Users3Outline from "@vkontakte/icons/dist/56/users_3_outline";
import { Document, pdfjs, Page } from "react-pdf";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${
	pdfjs.version
}/pdf.worker.js`;

const ScheduleView = ({ id }) => {
	const [choosed, setChoosed] = useState(1);
	const date = new Date();
	const stgroup = useSelector((state) => state.schedule.activeStgroup);
	const group = useSelector((state) => state.schedule.activeGroup);
	const [isLoading, setIsLoading] = useState(true);
	const [lessons, setLessons] = useState([]);
	const [file, setFile] = useState(null);
	const [activePanel, setActivePanel] = useState("main");
	const modal = useSelector((state) => state.schedule.modal);
	const dispatch = useDispatch();

	const load = async () => {
		const result = new Date(date);
		result.setDate(result.getDate() + choosed - 1);
		const parsedDate =
			result.getFullYear() +
			"-" +
			parseInt(result.getMonth() + 1) +
			"-" +
			result.getDate();

		if (!modal) {
			await api.get(`/schedule/favourite`).then(async ({ data }) => {
				if (data) {
					const stgroup = data.stgroup;
					const group = data.group;

					await api
						.get(
							`/schedule/lessons?stgroup=${stgroup}&group=${group}&day=${parsedDate}`
						)
						.then(({ data }) => {
							dispatch(setActiveStgroup(stgroup));
							dispatch(setActiveGroup(group));

							setLessons(data);
						});
				}
			});
		}
		setIsLoading(false);
	};

	useEffect(() => {
		if (activePanel === "pdf")
			api.get(`/schedule/file?stgroup=${stgroup}`).then(({ data }) => {
				var pdf = `data:application/pdf;base64,${data}`;

				setFile(pdf);
			});
	}, [activePanel]);

	useEffect(() => {
		load();
	}, [choosed, modal]);

	const onHeaderButtonClick = () => {
		dispatch(
			setModal(
				<ScheduleSettings
					onClose={() => {
						dispatch(setModal(null));
					}}
				/>
			)
		);
	};

	return (
		<View id={id} activePanel={activePanel} modal={modal}>
			<Panel id="main">
				<PanelHeader
					left={
						<PanelHeaderButton onClick={onHeaderButtonClick}>
							<Icon28Settings />
						</PanelHeaderButton>
					}
				>
					Расписание
				</PanelHeader>

				{!isLoading ? (
					!stgroup || !group ? (
						<Placeholder
							header="Группа не выбрана"
							icon={<Icon56Users3Outline />}
							stretched
						/>
					) : (
						<React.Fragment>
							<HorizontalCalendar
								date={date}
								choosed={choosed}
								onClick={({ choosedDay, dayNumber }) => {
									if (dayNumber !== choosed) {
										setChoosed(dayNumber);
									}
								}}
							/>
							<Div style={{ textAlign: "center" }}>
								<span>Сверьтесь с</span>{" "}
								<span
									style={{ color: "var(--accent)" }}
									onClick={() => {
										setActivePanel("pdf");
									}}
								>
									оригиналом
								</span>
								.<br />
								<Link
									href="https://vk.com/im?sel=-183639424"
									target="_blank"
								>
									Сообщите
								</Link>
								<span> об ошибке.</span>
							</Div>
							<Header mode="secondary">
								{lessons.length > 0
									? lessons.length === 1
										? `Сегодня ${lessons.length} пара`
										: lessons.length > 1 &&
										  lessons.length < 5
										? `Сегодня ${lessons.length} пары`
										: `Сегодня ${lessons.length} пар`
									: "Сегодня нет пар"}
							</Header>
							<Gallery
								slideWidth="100%"
								align="center"
								style={{ height: "100%" }}
								slideIndex={choosed - 1}
								onChange={(slideIndex) => {
									setChoosed(slideIndex + 1);
								}}
							>
								<ScheduleTable lessons={lessons} />
								<ScheduleTable lessons={lessons} />
								<ScheduleTable lessons={lessons} />
								<ScheduleTable lessons={lessons} />
								<ScheduleTable lessons={lessons} />
								<ScheduleTable lessons={lessons} />
								<ScheduleTable lessons={lessons} />
							</Gallery>
						</React.Fragment>
					)
				) : (
					<PanelSpinner size="large" />
				)}
			</Panel>
			<Panel id="pdf" centered>
				<PanelHeader
					left={
						<PanelHeaderBack
							onClick={() => {
								setActivePanel("main");
							}}
						/>
					}
				>
					Расписание
				</PanelHeader>

				{file && (
					<div
						style={{
							paddingBottom: "var(--tabbar_height)",
						}}
					>
						<TransformWrapper options={{ limitToBounds: false }}>
							<TransformComponent>
								<Document
									loading={<ScreenSpinner size="large" />}
									options={{
										cMapUrl: `//cdn.jsdelivr.net/npm/pdfjs-dist@${
											pdfjs.version
										}/cmaps/`,
										cMapPacked: true,
									}}
									file={file}
								>
									<Page
										loading={<ScreenSpinner size="large" />}
										pageNumber={1}
										renderAnnotationLayer={false}
									/>
								</Document>{" "}
							</TransformComponent>
						</TransformWrapper>
					</div>
				)}

				{file && (
					<FixedLayout vertical="bottom" filled>
						<Div style={{ textAlign: "center" }}>
							<Link href={file} download>
								Скачать
							</Link>
						</Div>
					</FixedLayout>
				)}
			</Panel>
		</View>
	);
};

export default ScheduleView;
