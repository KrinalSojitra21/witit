import { BlockedUser, UserBaseInfo } from "@/types/user";
import { Axios } from "../axiosConfig";

type Props = {
  user_id: string;
  limit?: number;
  lastDocId?: string;
};

type Res = {
  status: number;
  data: BlockedUser[];
  error: any;
};

export const getBlocklist = async ({ user_id, limit, lastDocId }: Props) => {
  let res: Res = { status: 0, data: [], error: "" };

  try {
    const result = await Axios.get("/block", {
      params: {
        ...(lastDocId && { lastDocId }),
        ...(limit && { limit }),
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
