import { DiscoverPost } from "@/types/post";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type InitialPostList = DiscoverPost[];

const discoverFeedSlice = createSlice({
  name: "discoverPost",
  initialState: [] as InitialPostList,
  reducers: {
    addDiscoverPost(state, action) {
      return action.payload.length > 0 ? action.payload : [];
    },
    updateDiscoverPost(state, action) {
      console.log(action.payload);
    },

    deleteDiscoverPost(state, action: PayloadAction<{ postId: string }>) {
      const { postId } = action.payload;
      const updatedState = state.filter((post) => post.postId !== postId);
      return updatedState;
    },
  },
  
});

export const { addDiscoverPost, updateDiscoverPost, deleteDiscoverPost } =
  discoverFeedSlice.actions;
export default discoverFeedSlice.reducer;
