import { Post } from "@/types/post";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type InitialPostList = Post[];

const userPostSlice = createSlice({
  name: "userPost",
  initialState: [] as InitialPostList,
  reducers: {
    addUserPost(state, action) {
      return action.payload.length > 0 ? action.payload : [];
    },
    updateUserPost(state, action) {
      const { postId, category, caption } = action.payload;
      const updatedState = state.map((post) =>
        post.postId === postId
          ? {
              ...post,
              caption: caption,
              category: category,
            }
          : post
      );
      return updatedState;
    },
    updateUserPostCommentCount(
      state,
      action: PayloadAction<{ postId: string }>
    ) {
      const { postId } = action.payload;
      const updatedState = state.map((post) =>
        post.postId === postId
          ? {
              ...post,
              counts: {
                ...post.counts,
                comment: post.counts.comment + 1,
              },
              userActivity: {
                ...post.userActivity,
                isCommented: true,
              },
            }
          : post
      );
      return updatedState;
    },
    updateUserPostLikeStatus(state, action: PayloadAction<{ postId: string }>) {
      const { postId } = action.payload;
      const updatedState = state.map((post) =>
        post.postId === postId
          ? {
              ...post,
              counts: {
                ...post.counts,
                like: post.userActivity.isLiked
                  ? post.counts.like - 1
                  : post.counts.like + 1,
              },
              userActivity: {
                ...post.userActivity,
                isLiked: !post.userActivity.isLiked,
              },
            }
          : post
      );
      return updatedState;
    },
    updateUserPostRepostStatus(
      state,
      action: PayloadAction<{ postId: string }>
    ) {
      const { postId } = action.payload;
      const updatedState = state.map((post) =>
        post.postId === postId
          ? {
              ...post,
              counts: {
                ...post.counts,
                repost: post.userActivity.isReposted
                  ? post.counts.repost - 1
                  : post.counts.repost + 1,
              },
              repostedBy: post.userActivity.isReposted ? null : post.repostedBy,
              userActivity: {
                ...post.userActivity,
                isReposted: !post.userActivity.isReposted,
              },
            }
          : post
      );
      return updatedState;
    },
    deleteUserPost(state, action: PayloadAction<{ postId: string }>) {
      const { postId } = action.payload;
      const updatedState = state.filter((post) => post.postId !== postId);
      return updatedState;
    },
    updateUserPostView(state, action: PayloadAction<{ postId: string }>) {
      const { postId } = action.payload;
      const updatedState = state.map((post) =>
        post.postId === postId
          ? {
              ...post,
              userActivity: {
                ...post.userActivity,
                isViewed: true,
              },
            }
          : post
      );
      return updatedState;
    },
    updateUserPostViewPrompt(state, action: PayloadAction<{ postId: string }>) {
      const { postId } = action.payload;
      const updatedState = state.map((post) =>
        post.postId === postId
          ? {
              ...post,
              isPromptAvailable: true,
              userActivity: {
                ...post.userActivity,
                isAccessToViewPrompt: true,
              },
            }
          : post
      );
      return updatedState;
    },
  },
});

export const {
  addUserPost,
  updateUserPost,
  deleteUserPost,
  updateUserPostCommentCount,
  updateUserPostLikeStatus,
  updateUserPostRepostStatus,
  updateUserPostView,
  updateUserPostViewPrompt,
} = userPostSlice.actions;
export default userPostSlice.reducer;
