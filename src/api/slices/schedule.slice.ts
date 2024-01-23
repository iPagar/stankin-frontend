import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isFetching: true,
  didInvalidate: false,
  stgroup: "",
  group: "",
  isTeacher: false,
  activeStgroup: "",
  activeGroup: "",
};

const scheduleSlice = createSlice({
  name: "schedule",
  initialState,
  reducers: {
    setStgroup: (state, action) => {
      state.stgroup = action.payload;
    },
    setGroup: (state, action) => {
      state.group = action.payload;
    },
    setIsFetching: (state, action) => {
      state.isFetching = action.payload;
    },
    setGroupAndStgroup: (state, action) => {
      state.group = action.payload.group;
      state.stgroup = action.payload.stgroup;
    },
  },
});

export const { setStgroup, setGroup, setIsFetching, setGroupAndStgroup } =
  scheduleSlice.actions;

export default scheduleSlice.reducer;
