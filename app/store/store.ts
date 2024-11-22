import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./slices/user";
import tracksReducer from "./slices/tracks";
import likeReducer from "./slices/like";

export const store = configureStore({
  reducer: {
    user: userReducer,
    tracks: tracksReducer,
    like: likeReducer,
  },
});

// 타입 설정
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
