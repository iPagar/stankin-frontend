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
	SET_ACTIVE_STGROUP,
	SET_ACTIVE_GROUP,
	SET_MODAL,
} from "./actionTypes";

export function openRating(tag) {
	return (dispatch) => {};
}

export function openRatingSt(tag) {
	return (dispatch) => {};
}

export function setModal(content) {
	return { type: SET_MODAL, payload: content };
}

export function setActiveGroup(content) {
	return { type: SET_ACTIVE_GROUP, payload: content };
}

export function setActiveStgroup(content) {
	return { type: SET_ACTIVE_STGROUP, payload: content };
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

export function exit() {
	return (dispatch) => {
		dispatch(requestInit());
		return api
			.delete("/student")
			.then(() => dispatch(setView("loginView")))
			.then(() => dispatch(setActiveTopTab("marks")))
			.then(() => dispatch(setActiveBottomTab("rating")))
			.then(() => dispatch({ type: RECEIVE_EXIT }))
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
			})
			.then(() => dispatch(setView("mainView")))
			.catch(() => {
				dispatch(invalidateInit());
			});
	};
}
