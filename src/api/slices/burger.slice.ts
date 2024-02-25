import { createSlice } from "@reduxjs/toolkit";
import { SnackbarProps } from "@vkontakte/vkui";
import React, { ReactNode } from "react";

const initialState = {
  activePanel: "main",
  activeModal: null,
  popout: null,
  teacher: "",
  snackbar: null,
  searchTeacher: "",
  history: ["main"],
} as {
  activePanel: string;
  activeModal: string | null;
  popout: ReactNode;
  teacher: string;
  snackbar: SnackbarProps | null;
  searchTeacher: string;
  audience: string | null;
  history: string[];
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
    setAudience(state, action) {
      state.audience = action.payload;
    },
    setHistory(state, action) {
      state.history = action.payload;
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
  setAudience,
  setHistory,
} = burgerSlice.actions;

export default burgerSlice.reducer;
