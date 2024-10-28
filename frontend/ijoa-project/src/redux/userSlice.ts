import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

// CounterState 인터페이스 정의
export interface UserState {
  value: number;
}

// 초기 상태 정의
const initialState: UserState = {
  value: 0,
};

// slice 생성
export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    increment: (state) => {
      state.value += 1;
    },
    decrement: (state) => {
      state.value -= 1;
    },
    incrementByAmount: (state, action: PayloadAction<number>) => {
      state.value += action.payload;
    },
  },
});

// action 생성자와 reducer 함수 내보내기
export const { increment, decrement, incrementByAmount } = userSlice.actions;
export default userSlice.reducer;
