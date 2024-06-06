import { createSlice } from "@reduxjs/toolkit";

type InitialPostIdList = string[];

const viewedNSFWSlice = createSlice({
  name: "viewedNSFWSlice",
  initialState: [] as InitialPostIdList,
  reducers: {
    addViewedNSFWPost(state, action) {
      const postIdToAdd = action.payload.postId;
      if (postIdToAdd && !state.includes(postIdToAdd)) {
        return [...state, postIdToAdd];
      }
      return state;
    },
  },
});

export const { addViewedNSFWPost } = viewedNSFWSlice.actions;
export default viewedNSFWSlice.reducer;
