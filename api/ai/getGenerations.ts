import { Post } from "@/types/post";
import { Axios } from "../axiosConfig";
import { GetAiGeneration } from "@/types/ai";

type Props = {
  user_id: string;
  limit?: number;
  lastDocId?: string;
};

type Res = {
  status: number;
  data: GetAiGeneration[];
  error: any;
};

export const getGenerations = async ({ user_id, limit, lastDocId }: Props) => {
  let res: Res = { status: 0, data: [], error: "" };

  try {
    const result = await Axios.get("/ai/generations", {
      params: {
        limit,
        ...(lastDocId && { lastDocId }),
      },
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
