import exp from "constants";
import { Image } from "./post";
import { UserType } from "./user";

export type AiApplication = {
  applicationId: string;
  userId: string;
  applicationStatus: "APPROVED" | "REJECTED" | "PENDING" | "TRAINING";
  modelName: string;
  message: string | null;
  createdAt: string;
};

type Creator = {
  id: string;
  userName: string;
};

type GeneratedFrom = {
  id: string | null;
  image: string | null;
};

type ModelDetails = {
  id: string;
  type: string;
  name: string;
};

export type FaceDetails = {
  definition: number;
  preservationStrength: number;
};

export type HandDetails = {
  definition: number;
  preservationStrength: number;
};

export type ImageSize = "sm" | "md" | "lg";

export type AspectRatio = "2:3" | "5:4" | "1:1" | "3:2" | "4:5";

export type Resolution = 1 | 1.5 | 2;

export type CreationSettings = {
  imageSize: ImageSize;
  aspectRatio: AspectRatio;
  promptStrength: number;
  definition: number;
  restoreFace: boolean;
  preserveFaceDetails: FaceDetails | null;
  preserveHandDetails: HandDetails | null;
};

export type RecreationSettings = {
  recreationType: string | null;
  recreationTypeStrength: number | null;
  recreationStrength: number;
};

export type GenerationSetting = {
  negativePrompt: string[];
  creationSettings: CreationSettings;
  recreationSettings: RecreationSettings | null;
  inPaintingSettings: InPaintingSettings | null;
  hiResSettings: HiResSettings | null;
};

export type HiResSettings = {
  definition: number;
  similarityStrength: number;
  increaseResolution: Resolution;
};
export type InPaintingSettings = { recreateMaskOnly: boolean };

export type GetAiGeneration = {
  Id: string;
  userId: string;
  prompt: string;
  negativePrompt: string[];
  generationId: string[];
  status: "SUCCESS" | "PENDING" | "FAILURE";
  message: string;
  creator: Creator | null;
  generatedFrom: GeneratedFrom | null;
  modelDetails: ModelDetails;
  remainingGeneration: number;
  superShoot: boolean;
  isAccessible: boolean;
  creationSettings: CreationSettings;
  recreationSettings: RecreationSettings | null;
  inPaintingSettings: InPaintingSettings | null;
  hiResSettings: HiResSettings | null;
  generationImages: Image[];
  createdAt: string;
  updatedAt: string;
};

export type PostAiGeneration = {
  prompt: string;
  modelId: number | string;
  negativePrompt: string[];
  postId: string | null;
  numberOfGenerations: number;
  superShoot: boolean;
  image: string | null;
  creationSettings: CreationSettings;
  recreationSettings: RecreationSettings | null;
  inPaintingSettings: InPaintingSettings | null;
  hiResSettings: HiResSettings | null;
};

type WithOutSuperShoot = {
  creditPerGeneration: number;
};

type WithSuperShoot = {
  creditPerGeneration: number;
};

export type AiCharges = {
  numberOfGeneration: number;
  withOutSuperShoot: WithOutSuperShoot;
  withSuperShoot: WithSuperShoot;
};

export type SuperShoot = {
  multiplierConstant: number;
  discountConstant: number;
};

export type BaseModel = {
  modelName: string;
  modelId: number | string;
  isActive: boolean;
};

type Counts = {
  generatedImages: number;
  creditEarn: number;
};

export type ClassType = "Man" | "Woman" | "Style" | "Base";

type GenerationSettings = {
  bannedWords: string[];
  allowGenerationOnModel: boolean;
  creditPerPhoto: number;
};

export type UserModel = {
  modelName: string;
  classType: ClassType;
  generationSettings: GenerationSettings;
  counts: Counts;
  isActive: boolean;
  createdAt: string;
  modelId: number | string;
  selectedPhotos: string[];
};

export type Model = {
  modelName: string;
  classType: ClassType;
  modelId: number | string;
};

export type FriendModel = {
  userName: string;
  userType: UserType;
  userId: string;
  profileImage: string | null;
  models: Model[];
  searchScore: number;
};

export type ModelContainer = {
  baseModelList: BaseModel[];
  userModelList: UserModel[];
  friendModelList: FriendModel[];
};
