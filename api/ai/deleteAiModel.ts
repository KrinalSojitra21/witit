import { Axios } from "../axiosConfig";

type Props = {
  user_id: string | undefined;
  modelId: number | string;
};
type Res = {
  status: number;
  data: string | null;
  error: any;
};

const deleteAiModel = async ({ user_id, modelId }: Props) => {
  const res: Res = {
    status: 0,
    data: null,
    error: "",
  };
  try {
    const result = await Axios.delete("/ai/model", {
      params: {
        modelId,
      },
      headers: {
        user_id,
      },
    });
    res.status = 200;
    res.data = result.data.message;
  } catch (error: any) {
    res.status = 200;
    res.error = error;
  }
  return res;
};

export default deleteAiModel;
