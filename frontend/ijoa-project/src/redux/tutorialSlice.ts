// src/redux/tutorialSlice.ts
import { createSlice } from "@reduxjs/toolkit";

interface TutorialState {
  isOpen: boolean;
}

const initialState: TutorialState = {
  isOpen: false,
};

const tutorialSlice = createSlice({
  name: "tutorial",
  initialState,
  reducers: {
    openTutorial: (state) => {
      state.isOpen = true;
    },
    closeTutorial: (state) => {
      state.isOpen = false;
    },
  },
});

export const { openTutorial, closeTutorial } = tutorialSlice.actions;
export default tutorialSlice.reducer;
