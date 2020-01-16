import {
	SET_VIEW,
	SET_SCHEME,
	SET_ACTIVE_TOP_TAB,
	SET_ACTIVE_BOTTOM_TAB
} from "../actionTypes";

const initialState = {
	activeView: "loginView",
	scheme: "light",
	activeTopTab: "marks",
	activeBottomTab: "rating"
};

export default function(state = initialState, action) {
	switch (action.type) {
		case SET_VIEW: {
			const activeView = action.payload;
			return { ...state, activeView };
		}
		case SET_ACTIVE_TOP_TAB: {
			const activeTopTab = action.payload;
			return { ...state, activeTopTab };
		}
		case SET_ACTIVE_BOTTOM_TAB: {
			const activeBottomTab = action.payload;
			return { ...state, activeBottomTab };
		}
		case SET_SCHEME: {
			const scheme = action.payload;
			return { ...state, scheme };
		}
		default:
			return state;
	}
}
