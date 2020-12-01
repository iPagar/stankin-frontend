import React, { useState, useEffect } from "react";
import {
	Panel,
	PanelHeader,
	Group,
	PanelHeaderBack,
	Search,
	CardGrid,
	FixedLayout,
	Spinner,
	PullToRefresh,
	Header,
} from "@vkontakte/vkui";
import { api } from "../services";
import useDebounce from "../services/useDebounce";
import { useSelector, useDispatch } from "react-redux";
import { setSearchTeacher } from "../redux/actions";
import TeacherCard from "../cells/TeacherCard";
import InfiniteScroll from "react-infinite-scroller";

const TeachersPanel = ({ id, onCancelClick }) => {
	const [teachers, setTeachers] = useState([]);
	const [myTeachers, setMyTeachers] = useState([]);
	const name = useSelector((state) => state.burger.searchTeacher);
	const [pageStart, setPageStart] = useState(0);
	const [hasMore, setHasMore] = useState(true);
	const [isFetching, setIsFetching] = useState(false);
	const student = useSelector((state) => state.init.student);
	const snackbar = useSelector((state) => state.burger.snackbar);
	const modal = useSelector((state) => state.burger.activeModal);
	const debouncedName = useDebounce(name, 500);
	const dispatch = useDispatch();

	const onRefresh = async () => {
		setIsFetching(true);
		let newTeachers = [];

		await api.get(`/teachers?name=${name}&offset=${0}`).then(({ data }) => {
			if (data.length !== 0) {
				setHasMore(true);
				newTeachers = [...data];
			} else {
				setHasMore(false);
			}
		});

		student.hasOwnProperty("student") &&
			(await api.get(`/teachers/my`).then(({ data }) => {
				setMyTeachers(data);
			}));

		setTeachers(newTeachers);
		setIsFetching(false);
	};

	const getTeachers = async (isNew = false) => {
		if (isNew === false)
			await api
				.get(`/teachers?name=${debouncedName}&offset=${pageStart}`)
				.then(({ data }) => {
					if (setHasMore) {
						if (data.length < 10) {
							setHasMore(false);
						} else setHasMore(true);
						setTeachers([...teachers, ...data]);
						setPageStart([...teachers, ...data].length);
					}
				});
		else {
			await api
				.get(`/teachers?name=${debouncedName}&offset=${0}`)
				.then(({ data }) => {
					setHasMore(true);
					setTeachers(data);
					setPageStart(data.length);

					if (data.length < 10) {
						setHasMore(false);
					} else setHasMore(true);
				});
		}
	};

	useEffect(() => {
		getTeachers(true);
	}, [debouncedName]);

	useEffect(() => {
		onRefresh();
	}, [student.hasOwnProperty("student")]);

	return (
		<Panel id={id}>
			<PanelHeader
				separator={false}
				left={<PanelHeaderBack onClick={onCancelClick} />}
			>
				Преподаватели
			</PanelHeader>
			<FixedLayout vertical="top">
				<Search
					value={name}
					onChange={(e) => {
						dispatch(setSearchTeacher(e.currentTarget.value));
					}}
				/>
			</FixedLayout>

			<PullToRefresh
				style={{ marginTop: 60, marginBottom: 10 }}
				onRefresh={onRefresh}
				isFetching={isFetching}
			>
				{student.hasOwnProperty("student") &&
					!debouncedName &&
					myTeachers.length > 0 && (
						<Group
							header={
								student && (
									<Header mode="secondary">
										Текущий семестр
									</Header>
								)
							}
							separator="hide"
						>
							<CardGrid>
								{myTeachers.map((teacher) => (
									<TeacherCard
										key={teacher.name + "my"}
										teacher={teacher}
										onRefresh={onRefresh}
									/>
								))}
							</CardGrid>
						</Group>
					)}
				<Group
					header={
						student.hasOwnProperty("student") &&
						!debouncedName && <Header mode="secondary">Все</Header>
					}
					separator="hide"
				>
					<CardGrid>
						<InfiniteScroll
							pageStart={pageStart}
							loadMore={() => {
								getTeachers(false);
							}}
							hasMore={hasMore}
							loader={
								<div key={0} style={{ paddingTop: 20 }}>
									<Spinner size={"large"} />
								</div>
							}
						>
							{teachers.map((teacher) => (
								<TeacherCard
									key={teacher.name}
									teacher={teacher}
									onRefresh={onRefresh}
								/>
							))}
						</InfiniteScroll>
					</CardGrid>
				</Group>
			</PullToRefresh>
			{snackbar}
		</Panel>
	);
};

export default TeachersPanel;
