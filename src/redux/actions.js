import { api } from "../services";
import {
	SET_STORY,
	SET_VIEW,
	SET_SCHEME,
	REQUEST_INIT,
	RECEIVE_INIT,
	INVALIDATE_INIT,
	SELECT_SEMESTER,
	SET_ACTIVE_TOP_TAB,
	SET_ACTIVE_BOTTOM_TAB,
	RECEIVE_NOTIFY,
	RECEIVE_EXIT,
	SET_ACTIVE_SCHEDULE,
	INVALIDATE_SCHEDULE,
	REQUEST_SCHEDULE,
	RECEIVE_SCHEDULE,
} from "./actionTypes";

export function openRating(tag) {
	return (dispatch) => {};
}

export function openRatingSt(tag) {
	return (dispatch) => {};
}

export function setActiveSchedule(content) {
	return { type: SET_ACTIVE_SCHEDULE, payload: content };
}

export function setStgroup(stgroup) {
	return { type: "SET_STGROUP", stgroup };
}

export function setView(content) {
	return { type: SET_VIEW, payload: content };
}

export function setStory(content) {
	return { type: SET_STORY, payload: content };
}

export function setActiveTopTab(content) {
	return { type: SET_ACTIVE_TOP_TAB, payload: content };
}

export function setActiveBottomTab(content) {
	return { type: SET_ACTIVE_BOTTOM_TAB, payload: content };
}

export function setScheme(content) {
	return { type: SET_SCHEME, payload: content };
}

export function selectSemester(content) {
	return { type: SELECT_SEMESTER, payload: +content };
}

function requestInit() {
	return { type: REQUEST_INIT };
}

function receiveInit(content) {
	return { type: RECEIVE_INIT, payload: content };
}

function invalidateInit() {
	return { type: INVALIDATE_INIT };
}

function requestSchedule() {
	return { type: REQUEST_SCHEDULE };
}

function receiveSchedule(content) {
	return { type: RECEIVE_SCHEDULE, payload: content };
}

function invalidateSchedule() {
	return { type: INVALIDATE_SCHEDULE };
}

export function exit() {
	return (dispatch) => {
		dispatch(requestInit());
		return api
			.delete("/student")
			.then(() => dispatch(setView("loginView")))
			.then(() => dispatch(setActiveTopTab("marks")))
			.then(() => dispatch(setActiveBottomTab("rating")))
			.then(() => dispatch({ type: RECEIVE_EXIT }))
			.then(() => dispatch(setStory("marksRoot")))
			.catch(() => dispatch(invalidateInit()));
	};
}

export function notify() {
	return (dispatch) => {
		dispatch(requestInit());
		return api
			.post("/notify")
			.then(() => {
				dispatch({ type: RECEIVE_NOTIFY });
			})

			.catch(() => {
				dispatch(invalidateInit());
			});
	};
}

export function fetchInit() {
	return (dispatch) => {
		dispatch(requestInit());
		return Promise.all([
			api.post("/student").then((student) => student.data),
			api.post("/semesters").then((semesters) => {
				return Promise.all([
					Promise.all(
						semesters.data.map((semester) => {
							return api.post("/marks", { semester });
						})
					).then((marks) => marks.map((mark) => mark.data)),
				]).then((resp) => {
					return {
						semesters: semesters.data,
						marks: resp[0],
					};
				});
			}),
		])
			.then((response) => {
				dispatch(
					receiveInit({
						student: response[0],
						semesters: response[1].semesters,
						marks: response[1].marks,
					})
				);
				dispatch(setView("mainView"));
			})
			.catch(() => {
				dispatch(invalidateInit());
			});
	};
}

export function loadSchedule() {
	return {
		// Action to emit
		request: "LOAD_SCHEDULE",
		// Perform the fetching:
		callAPI: () => api.get("/schedule/favourite"),
		// Arguments to inject in begin/end actions
		// payload: { stgroup, group, isTeacher },
	};
}
