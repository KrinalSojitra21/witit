import { GetAiGeneration } from "./ai";
import { GeneratedFrom, Image, PromptDetail } from "./post";


type generationCreatePost = PromptDetail & {
  generationId:string
}

export type DefaultValues = {
  category: string[];
  caption: string | null;
  image: Partial<Image>[];
  generatedFrom: GeneratedFrom | null;
  promptDetails: Partial<PromptDetail> ;
  prompt:string | null
};
