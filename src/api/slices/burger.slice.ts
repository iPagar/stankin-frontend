import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  activePanel: "main",
  activeModal: null,
  popout: null,
  teacher: "",
  snackbar: null,
  searchTeacher: "",
};

const burgerSlice = createSlice({
  name: "burger",
  initialState,
  reducers: {
    setActivePanel(state, action) {
      state.activePanel = action.payload;
    },
    setActiveModal(state, action) {
      state.activeModal = action.payload;
    },
    setPopout(state, action) {
      state.popout = action.payload;
    },
    setTeacher(state, action) {
      state.teacher = action.payload;
    },
    setSnackbar(state, action) {
      state.snackbar = action.payload;
    },
    setSearchTeacher(state, action) {
      state.searchTeacher = action.payload;
    },
  },
});

export const {
  setActivePanel,
  setActiveModal,
  setPopout,
  setTeacher,
  setSnackbar,
  setSearchTeacher,
} = burgerSlice.actions;

export default burgerSlice.reducer;
