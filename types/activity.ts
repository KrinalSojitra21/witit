export type ActivityInfo = {
  title: string;
  message: string | null;
  frontImage: string;
  otherInfo: string | null;
  backImage: string | null;
};

type Action = {
  actionTakerId: string;
  postId: string | null;
};

type GenerationDetails = {
  id: string;
  creatorId: string;
  postId: string | null;
};

export type ActivityType =
  | "USER_NOTIFICATION"
  | "CREATOR_NOTIFICATION"
  | "CREDIT_NOTIFICATION"
  | "POST_NOTIFICATION"
  | "GENERATION_NOTIFICATION"
  | "USER_GENERATION_NOTIFICATION"
  | "CREATOR_GENERATION_NOTIFICATION"
  | "QUESTION_NOTIFICATION";

export type Activity = {
  activityId: string;
  userId: string;
  activity: ActivityInfo;
  action: Action;
  generationDetails: GenerationDetails | null;
  activityType: ActivityType;
  createdAt: string;
  updatedAt: string;
};

export type ActivityCounts = {
  notification: number;
  offerCreated: number;
  offerReceived: number;
};
