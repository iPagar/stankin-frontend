import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isFetching: true,
  didInvalidate: false,
  stgroup: "",
  group: "",
  isTeacher: false,
};

const scheduleSlice = createSlice({
  name: "schedule",
  initialState,
  reducers: {},
});

export const {} = scheduleSlice.actions;

export default scheduleSlice.reducer;
