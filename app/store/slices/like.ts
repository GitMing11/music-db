// app/store/slices/like.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface LikeState {
  [key: string]: boolean;
}

const initialState: LikeState = {};

const likeSlice = createSlice({
  name: "like",
  initialState,
  reducers: {
    setLikeState(
      state,
      action: PayloadAction<{ itemId: string; liked: boolean }>
    ) {
      state[action.payload.itemId] = action.payload.liked;
    },
  },
});

export const { setLikeState } = likeSlice.actions;
export default likeSlice.reducer;
