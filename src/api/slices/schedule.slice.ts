import { createSlice } from "@reduxjs/toolkit";
import { TeacherDto } from "./teachers.slice";
import { ReactNode } from "react";

const initialState = {
  isFetching: true,
  didInvalidate: false,
  stgroup: "",
  group: "",
  isTeacher: false,
  activeStgroup: "",
  activeGroup: "",
  modal: null,
} as {
  isFetching: boolean;
  didInvalidate: boolean;
  stgroup: string;
  group: string;
  isTeacher: boolean;
  activeStgroup: string;
  activeGroup: string;
  modal: string | null;
  selectedTeacher?: TeacherDto;
  snackbar: ReactNode;
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
    setScheduleModal: (state, action) => {
      state.modal = action.payload;
    },
    setSelectedTeacher: (state, action) => {
      state.selectedTeacher = action.payload;
    },
    setScheduleSnackbar: (state, action) => {
      state.snackbar = action.payload;
    },
  },
});

export const {
  setStgroup,
  setGroup,
  setIsFetching,
  setGroupAndStgroup,
  setScheduleModal,
  setSelectedTeacher,
  setScheduleSnackbar,
} = scheduleSlice.actions;

export default scheduleSlice.reducer;
