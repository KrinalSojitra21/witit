import { SearchCreator } from "@/types/user";
import { createSlice } from "@reduxjs/toolkit";

type InitialCreator = SearchCreator[];

const creatorListSlice = createSlice({
  name: "creators",
  initialState: [] as InitialCreator,
  reducers: {
    concatCreator(state, action) {
      return action.payload;
    },
  },
});

export const { concatCreator } = creatorListSlice.actions;
export default creatorListSlice.reducer;
