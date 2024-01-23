import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  activeStory: "scheduleRoot",
  activeView: "scheduleView",
  scheme: "light",
  activeTopTab: "marks",
  activeBottomTab: "rating",
};

const configSlice = createSlice({
  name: "config",
  initialState,
  reducers: {
    setStory(state, action) {
      state.activeStory = action.payload;
    },
    setView(state, action) {
      state.activeView = action.payload;
    },
    setActiveTopTab(state, action) {
      state.activeTopTab = action.payload;
    },
    setActiveBottomTab(state, action) {
      state.activeBottomTab = action.payload;
    },
    setScheme(state, action) {
      state.scheme = action.payload;
    },
  },
});

export const {
  setStory,
  setView,
  setActiveTopTab,
  setActiveBottomTab,
  setScheme,
} = configSlice.actions;

export default configSlice.reducer;
