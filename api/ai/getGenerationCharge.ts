import { Axios } from "../axiosConfig";
import {
  AiCharges,
  CreationSettings,
  GetAiGeneration,
  SuperShoot,
} from "@/types/ai";

type Props = {
  user_id: string;
  modelId: string;
  creationSettings: CreationSettings;
  postId: string | null;
};

type Res = {
  status: number;
  data: { charges: AiCharges; superShoot: SuperShoot } | null;
  error: any;
};

export const getGenerationCharge = async ({
  user_id,
  modelId,
  creationSettings,
  postId,
}: Props) => {
  let res: Res = {
    status: 0,
    data: null,
    error: "",
  };

  try {
    const result = await Axios.post(
      "/ai/cost_of_generation",
      { modelId, creationSettings, postId },
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
