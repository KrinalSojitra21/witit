import { ReduxUser } from "@/types/user";
import { Axios } from "../axiosConfig";

type Res = {
  status: number;
  data: ReduxUser | null;
  error: any;
};

export const getUser = async (user_id: string) => {
  let res: Res = { status: 0, data: null, error: "" };

  try {
    const result = await Axios.get("/user", {
      headers: {
        user_id,
      },
    });

    res.status = 200;
    res.data = result.data.data;
  } catch (error: any) {
    console.log(error, "error");
    res.status = error.response.status;
    res.error = error.response.data.error;
  }

  return res;
};
