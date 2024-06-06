import { createSlice } from "@reduxjs/toolkit";

const messageSlice = createSlice({
  name: "message",
  initialState: null,
  reducers: {
    generate(state, action) {
      return action.payload ? { ...action.payload } : null;
    },
  },
});

export const { generate } = messageSlice.actions;
export default messageSlice.reducer;
