import { ReduxUser } from "@/types/user";
import { Axios } from "../axiosConfig";

type Res = {
  status: number;
  data: ReduxUser | null;
  error: any;
};

type Props = {
  user_id: string;
  profilerId: string;
};

export const getOtherUser = async ({ user_id, profilerId }: Props) => {
  let res: Res = { status: 0, data: null, error: "" };

  try {
    const result = await Axios.get("/user/other-user-profile", {
      params: {
        ...(profilerId && { profilerId }),
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
