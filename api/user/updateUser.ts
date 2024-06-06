import { ReduxUser } from "@/types/user";
import { Axios } from "../axiosConfig";

type Props = {
  data: Partial<ReduxUser>;
  user_id: string | undefined;
};

type Res = {
  status: number;
  data:  ReduxUser | null;
  error: any;
};

export const updateUser = async ({ data, user_id }: Props) => {
  let res: Res = { status: 0, data: null, error: "" };

  try {
    const result = await Axios.patch("/user", data, {
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
