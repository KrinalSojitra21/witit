export type GeneralInfo = {
  firstName: string;
  lastName: string;
  profileImage: string | null;
  DOB?: Date | null;
  describedWord?: string | null;
  bio: string | null;
};

export type LinkedAccounts = {
  instagram: string | null;
  tiktok: string | null;
  twitter: string | null;
  youtube: string | null;
  twitch: string | null;
  onlyfans: string | null;
};

type Credit = {
  nonTransferableCredit: number;
  tempCredit: number;
  transferableCredit: number;
};

type Counts = {
  followingCount: number;
  followerCount: number;
};

type PushNotifications = {
  pauseAllNotification: boolean;
  likes: boolean;
  comments: boolean;
  directMessages: boolean;
  circleAdds: boolean;
  fromWitit: boolean;
};

export type GenerationSettings = {
  creditPerDerivative: number | undefined;
  creditPerMessage: number | undefined;
  allowGenerationOnPost: boolean | undefined;
};

type UserPlan = {
  id: string | null;
  name: string;
  status: string;
  startAt: Date;
  endAt: Date;
};

type Notification = {
  dialog: string;
  priorityType: "STICKY" | "NON_STICKY";
  notificationId: string;
};

export enum UserType {
  "GENERAL" = "GENERAL",
  "VERIFIED" = "VERIFIED",
}

export type ReduxUser = {
  userId: string;
  userName: string;
  email?: string;
  phone?: string | null;
  userType: UserType;
  NSFW?: boolean;
  shouldShowRepost?: boolean;
  generalInfo: GeneralInfo;
  linkedAccounts: LinkedAccounts;
  credit?: Credit;
  counts: Counts;
  isModelTrained: boolean;
  dynamicProfileLink: string | null;
  allowedModels: number;
  pushNotifications?: PushNotifications;
  generationSettings: GenerationSettings | null;
  userPlan: UserPlan | null;
  notifications?: Notification[];
  isMyFollower?: boolean;
  isMyFollowing?: boolean;
  blockedBy?: string | null;
  modelCount?: number;
};

export type UserBaseInfo = {
  userId: string;
  userName: string;
  profileImage: string | null;
  userType: UserType;
  searchScore?: number;
};

// export type OtherUser = {
//   userId: string;
//   userName: string;
//   userType: UserType;
//   generalInfo: GeneralInfo;
//   linkedAccounts: LinkedAccounts;
//   counts: Counts;
//   isModelTrained: boolean;
//   dynamicProfileLink: string | null;
//   allowedModels: number;
//   generationSettings: GenerationSettings | null;
//   userPlan: UserPlan | null;
//   isMyFollower: boolean;
//   isMyFollowing: boolean;
//   blockedBy: string | null;
//   modelCount: number;
// };

export type SearchCreator = {
  userName: string;
  generalInfo: GeneralInfo;
  userType: UserType;
  counts: {
    followerCount: 17;
  };
  userId: string;
  searchScore?: number;
};

export type BlockedUser = {
  blockListId: string;
  userId: string;
  blockedUserInfo: UserBaseInfo;
  createdAt: string;
  updatedAt: string;
};

export type CreditItem = {
  name: string;
  description: string;
  credit: number;
  amount: number;
  color: string;
};

export type DriverLicense = {
  frontOfLicense: {
    imagePreview: string;
    file: File | null;
  };
  backOfLicense: {
    imagePreview: string;
    file: File | null;
  };
};

export type Aimodel = {
  selectedPhotos: (string | null)[];
  verificationImages: (string | null)[];
  audioURL: string | null;
  generationSettings: {
    bannedWords: string[];
    allowGenerationOnModel: boolean;
    creditPerPhoto: number;
  };
  classType: string;
};

export type AimodelRes = {
  status: number;
  data: {
    selectedPhotos: string[];
    audioURL: null | string;
    generationSettings: {
      bannedWords: string[];
      allowGenerationOnModel: boolean;
      creditPerPhoto: number;
    };
  };
  error: any;
};

export type Store = {
  documentName: string;
  documentImages: (string | null)[];
};

export type generationSettingsUnit = {
  generationSettings: {
    creditPerDerivative: number;
    creditPerMessage: number;
    allowGenerationOnPost: boolean;
  } | null;
};
