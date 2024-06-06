import { Aimodel, AimodelRes } from "@/types/user";
import { Axios } from "../axiosConfig";

type Props = {
  data: Aimodel;
  user_id: string | undefined;
};

const createAImodelApplication = async ({ data, user_id }: Props) => {
  const res: AimodelRes = {
    status: 0,
    data: {
      selectedPhotos: [],
      audioURL: null,
      generationSettings: {
        bannedWords: [],
        allowGenerationOnModel: false,
        creditPerPhoto: 0,
      },
    },
    error: "",
  };
  try {
    const result = await Axios.post("user/ai_model/create_application", data, {
      headers: {
        user_id,
      },
    });

    res.status = 200;
    res.data = result.data.data;
  } catch (error: any) {
    res.status = error.response.status;
    res.error = error.response.data.error;
  }
  return res
};

export default createAImodelApplication;
