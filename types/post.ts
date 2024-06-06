import { CreationSettings, GenerationSetting, RecreationSettings } from "./ai";
import { UserBaseInfo } from "./user";

export type Image = {
  url: string;
  width: number;
  height: number;
  blurhash: string;
  description?: string | null;
};

type RepostedBy = {
  userId: string;
  userName: string;
};

export type GeneratedFrom = {
  postId: string | null;
  modelId: string | null;
};

type Counts = {
  like: number;
  comment: number;
  repost: number;
  recreation: number;
  view: number;
};

type UserActivity = {
  isLiked: boolean;
  isCommented: boolean;
  isReposted: boolean;
  isViewed: boolean;
  isAccessToViewPrompt: boolean;
};

export type Post = {
  rank?: number;
  postId: string;
  postedBy: UserBaseInfo;
  caption: string | null;
  category: string[];
  image: Image[];
  repostedBy: RepostedBy | null;
  generatedFrom: GeneratedFrom | null;
  allowGenerations: boolean;
  counts: Counts;
  createdAt: string;
  updatedAt: string;
  isPromptAvailable: boolean;
  userActivity: UserActivity;
  searchScore?: number;
};

export type OtherUserPost = {
  blockedBy: string | null;
  postData: Post[];
};

export type DiscoverPost = {
  postId: string;
  category: string[];
  image: Image[];
  searchScore?: number;
};

export type Tag = {
  userId: string;
  userName: string;
};

export type PostComment = {
  commentId: string;
  postId: string;
  comment: string;
  tag: Tag[];
  commenter: UserBaseInfo;
  createdAt: string;
  updatedAt: string;
};

export type PostPrompt = {
  prompt: string;
  creationSettings: null;
  recreationSettings: null;
  modelName: string;
};

export type PromptDetail = {
  prompt: string;
  modelName: string;
  creditPerPromptView: number;
  allowPromptView: boolean;
  generationId: string;
} & GenerationSetting;

export type ImageState = {
  imagePreview: string;
  file: File;
};

export type OwnerPost = Post & {
  parentId: string | null;
  promptDetails: Partial<PromptDetail>;
  prompt: string | null;
};
