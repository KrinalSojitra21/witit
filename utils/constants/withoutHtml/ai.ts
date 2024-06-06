import { GenerationSetting, ImageSize } from "@/types/ai";
import PostIcon from "../../icons/navbar/PostIcon";

type ImageSizeItem = {
  name: string;
  tag: ImageSize;
};

export const initialGenerationSetting: GenerationSetting = {
  negativePrompt: [],
  creationSettings: {
    imageSize: "md",
    aspectRatio: "4:5",
    promptStrength: 7,
    definition: 50,
    restoreFace: false,
    preserveFaceDetails: null,
    preserveHandDetails: null,
  },
  recreationSettings: {
    recreationType: null,
    recreationTypeStrength: 0.6,
    recreationStrength: 0.6,
  },
  inPaintingSettings: {
    recreateMaskOnly: false,
  },
  hiResSettings: null,
};

export const imageSizes: ImageSizeItem[] = [
  {
    name: "Small",
    tag: "sm",
  },
  {
    name: "Medium",
    tag: "md",
  },
  {
    name: "Large",
    tag: "lg",
  },
];
