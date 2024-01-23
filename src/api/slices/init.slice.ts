import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isFetching: true,
  didInvalidate: false,
  selectedSemester: 0,
  student: {} as any,
  semesters: [],
  marks: [],
};

const initSlice = createSlice({
  name: "init",
  initialState,
  reducers: {
    invalidateInit(state) {
      state.didInvalidate = true;
    },
    requestInit(state) {
      state.isFetching = true;
      state.didInvalidate = false;
    },
    receiveInit(state, action) {
      const { student, semesters, marks, favouriteGroup, favouriteStgroup } =
        action.payload;
      state.isFetching = false;
      state.didInvalidate = false;
      state.selectedSemester = semesters.length - 1;
      state.student = student;
      state.semesters = semesters;
      state.marks = marks;
    },
    receiveNotify(state) {
      const notify = state.student.notify;
      state.student.notify = !notify;
    },
    receiveExit(state) {
      return initialState;
    },
    selectSemester(state, action) {
      state.selectedSemester = action.payload;
    },
  },
});

export const {
  invalidateInit,
  requestInit,
  receiveInit,
  receiveNotify,
  receiveExit,
  selectSemester,
} = initSlice.actions;

export default initSlice.reducer;
