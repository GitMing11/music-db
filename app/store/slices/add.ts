// app/store/slices/add.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AddState {
    [key: string]: boolean;
}

const initialState: AddState = {};

const addSlice = createSlice({
    name: "add", // slice의 이름
    initialState, // 초기 상태
    reducers: {
        setAddState(
            state,
            action: PayloadAction<{ itemId: string; added: boolean }>
        ) {
        state[action.payload.itemId] = action.payload.added;
        },
    },
});

// 액션과 리듀서를 내보냄
export const { setAddState } = addSlice.actions;
export default addSlice.reducer;
