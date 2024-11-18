// src/redux/tutorialSlice.ts
import { createSlice, PayloadAction  } from "@reduxjs/toolkit";

interface TutorialState {
  isOpen: boolean;
  step: number;
}

const initialState: TutorialState = {
  isOpen: false,
  step: 1,
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
    setStep: (state, action: PayloadAction<number>) => {
      state.step = action.payload;
    },
  },
});

export const { openTutorial, closeTutorial, setStep } = tutorialSlice.actions;
export default tutorialSlice.reducer;
