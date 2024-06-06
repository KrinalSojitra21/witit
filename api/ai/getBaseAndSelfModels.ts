import { Post } from "@/types/post";
import { Axios } from "../axiosConfig";
import { GetAiGeneration, BaseModel, UserModel } from "@/types/ai";

type Props = {
  user_id: string;
};

type Data = {
  baseModelList: BaseModel[];
  userModelList: UserModel[];
};

type Res = {
  status: number;
  data: Data;
  error: any;
};

export const getBaseAndSelfModels = async ({ user_id }: Props) => {
  let res: Res = {
    status: 0,
    data: { baseModelList: [], userModelList: [] },
    error: "",
  };

  try {
    const result = await Axios.get("/ai/models", {
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

  return res;
};
