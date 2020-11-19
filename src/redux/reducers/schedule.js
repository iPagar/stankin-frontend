import { createReducer, updateObject } from "./generator";

const initialState = {
	isFetching: true,
	didInvalidate: false,
	stgroup: "",
	group: "",
	isTeacher: false,
};

const scheduleReducers = createReducer(initialState, {
	LOAD_SCHEDULE: {},
	SET_STGROUP: updateObject,
});

export default scheduleReducers;
