import { Axios } from "../axiosConfig";
import { AiApplication } from "@/types/ai";

type Props = {
  user_id: string;
  limit?: number;
  lastDocId?: string;
};

type Res = {
  status: number;
  data: AiApplication[];
  error: any;
};

export const getAiModelApplications = async ({
  user_id,
  limit,
  lastDocId,
}: Props) => {
  let res: Res = { status: 0, data: [], error: "" };

  try {
    const result = await Axios.get("/user/ai_model/applications", {
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
