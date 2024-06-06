import { UserModel } from "@/types/ai";
import { Axios } from "../axiosConfig";

type Res = {
  status: number;
  data: string;
  error: any;
};

type Props = {
  user_id: string;
  data: Partial<UserModel>;
};

export const updateAiModelDetails = async ({ user_id, data }: Props) => {
  let res: Res = { status: 0, data: "", error: "" };

  try {
    const result = await Axios.patch("/ai/model", data, {
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
