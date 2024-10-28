import { configureStore } from "@reduxjs/toolkit";
import { userSlice } from "./userSlice";

// 새로운 Redux Store 생성
export const store = configureStore({
  reducer: { user: userSlice.reducer },
});

// 스토어의 상태 트리 타입을 추론하여 정의하는 RootState
export type RootState = ReturnType<typeof store.getState>;
// 스토어의 dispatch 함수 타입을 가져와서 정의한 AppDispatch
export type AppDispatch = typeof store.dispatch;
