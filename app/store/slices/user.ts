// app/store/slices/user.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UserState {
  id: string | null;
  name: string | null;
  token: string | null; // 토큰 추가
  isLoggedIn: boolean; // 로그인 상태 추가
}

const initialState: UserState = {
  id: null,
  name: null,
  token: null,
  isLoggedIn: false,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    login(
      state,
      action: PayloadAction<{ id: string; name: string; token: string }>
    ) {
      state.id = action.payload.id;
      state.name = action.payload.name;
      state.token = action.payload.token;
      state.isLoggedIn = true;
    },
    logout(state) {
      state.id = null;
      state.name = null;
      state.token = null;
      state.isLoggedIn = false;
    },
  },
});

export const { login, logout } = userSlice.actions;
export default userSlice.reducer;
