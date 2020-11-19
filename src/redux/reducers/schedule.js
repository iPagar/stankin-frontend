import { SET_ACTIVE_STGROUP, SET_ACTIVE_GROUP } from "../actionTypes";

const initialState = {
	activeStgroup: "",
	acctiveGgroup: "",
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

		default:
			return state;
	}
}
