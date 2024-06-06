import { Axios } from "../axiosConfig";
import { Activity } from "@/types/activity";

type Props = {
  user_id: string;
  limit: number;
  lastDocId?: string;
};

type Res = {
  status: number;
  data: Activity[];
  error: any;
};

export const getActivity = async ({ limit, lastDocId, user_id }: Props) => {
  let res: Res = { status: 0, data: [], error: "" };

  try {
    const result = await Axios.get("/activity", {
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
    console.log(error);
    res.status = error.response.status;
    res.error = error.response.data.error;
  }

  return res;
};
