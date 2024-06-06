import { Post } from "@/types/post";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type InitialPostList = Post[];

const discoverSimilarFeedSlice = createSlice({
  name: "discoverSimilarPost",
  initialState: [] as InitialPostList,
  reducers: {
    addSimilarDiscoverPost(state, action) {
      return action.payload.length > 0 ? action.payload : [];
    },

    updateSimilarDiscoverPost(state, action) {
      const { postId, caption, category } = action.payload;
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
    updateSimilarDiscoverCommentCount(
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
    updateSimilarDiscoverLikeStatus(
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
    updateSimilarDiscoverRepostStatus(
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
    deleteSimilarDiscoverPost(
      state,
      action: PayloadAction<{ postId: string }>
    ) {
      const { postId } = action.payload;
      const updatedState = state.filter((post) => post.postId !== postId);
      return updatedState;
    },
    updateSimilarDiscoverPostView(
      state,
      action: PayloadAction<{ postId: string }>
    ) {
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
    updateSimilarDiscoverPostViewPrompt(
      state,
      action: PayloadAction<{ postId: string }>
    ) {
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
  addSimilarDiscoverPost,
  updateSimilarDiscoverPost,
  updateSimilarDiscoverLikeStatus,
  updateSimilarDiscoverCommentCount,
  updateSimilarDiscoverRepostStatus,
  deleteSimilarDiscoverPost,
  updateSimilarDiscoverPostView,
  updateSimilarDiscoverPostViewPrompt,
} = discoverSimilarFeedSlice.actions;
export default discoverSimilarFeedSlice.reducer;
