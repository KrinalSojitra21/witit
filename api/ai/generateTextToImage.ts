import { Axios } from "../axiosConfig";
import {
  AiCharges,
  CreationSettings,
  GetAiGeneration,
  RecreationSettings,
  SuperShoot,
} from "@/types/ai";

type GenerationBody = {
  prompt: string;
  modelId: number | string;
  numberOfGenerations: number;
  superShoot: boolean;
  negativePrompt: string[];
  creationSettings: CreationSettings;
  recreationSettings: RecreationSettings | null;
  postId: string | null;
  image: string | null;
};

type Props = {
  user_id: string;
  generationBody: GenerationBody;
};

type Res = {
  status: number;
  data: GetAiGeneration | null;
  error: any;
};

export const generateAiImage = async ({ user_id, generationBody }: Props) => {
  let res: Res = {
    status: 0,
    data: null,
    error: "",
  };

  try {
    const result = await Axios.post(
      "/ai/runpod/generate",
      {
        ...generationBody,
        ...(!generationBody.image && {
          image: undefined,
          postId: undefined,
          recreationSettings: undefined,
        }),
      },
      {
        headers: {
          user_id,
        },
      }
    );

    res.status = 200;
    res.data = result.data.data;
  } catch (error: any) {
    res.status = error.response.status;
    res.error = error.response.data.error;
  }

  return res;
};
