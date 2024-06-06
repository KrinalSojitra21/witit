import { Axios } from "../axiosConfig";
import { Activity } from "@/types/activity";

type Props = {
  user_id: string;
};

type Res = {
  status: number;
  data: Activity[];
  error: any;
};

export const readActivity = async ({ user_id }: Props) => {
  let res: Res = { status: 0, data: [], error: "" };

  try {
    const result = await Axios.post("/activity/read", {
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
