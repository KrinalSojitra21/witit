import { Image } from "./post";

export type Interaction = {
  type: string;
  description: string;
  isCheck: boolean | undefined;
  objectType: string;
};

