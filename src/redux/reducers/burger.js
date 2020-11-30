import { createReducer, updateObject } from "./generator";

const initialState = {
	activePanel: "main",
	activeModal: null,
	popout: null,
	teacher: "",
	snackbar: null,
	searchTeacher: "",
};

const burgerReducers = createReducer(initialState, {
	SET_ACTIVE_PANEL: updateObject,
	SET_ACTIVE_MODAL: updateObject,
	SET_POPOUT: updateObject,
	SET_TEACHER: updateObject,
	SET_SNACKBAR: updateObject,
	SET_SEARCH_TEACHER: updateObject,
});

export default burgerReducers;
