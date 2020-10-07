import {
	SET_ACTIVE_STGROUP,
	SET_ACTIVE_GROUP,
	SET_MODAL,
} from "../actionTypes";

const initialState = {
	activeStgroup: "",
	activeGroup: "",
	modal: null,
};

export default function(state = initialState, action) {
	switch (action.type) {
		case SET_ACTIVE_STGROUP: {
			const activeStgroup = action.payload;
			return { ...state, activeStgroup };
		}
		case SET_ACTIVE_GROUP: {
			const activeGroup = action.payload;
			return { ...state, activeGroup };
		}
		case SET_MODAL: {
			const modal = action.payload;
			return { ...state, modal };
		}
		default:
			return state;
	}
}
