import { UserBaseInfo } from "@/types/user";
import { Axios } from "../axiosConfig";

type Props = {
  user_id: string;
  search?: string;
  limit?: number;
  lastDocId?: string;
  searchScore?: number;
};

type InitialData = {
  followings: UserBaseInfo[];
};

type Res = {
  status: number;
  data: InitialData;
  error: any;
};

export const getFollowings = async ({
  user_id,
  search,
  limit,
  lastDocId,
  searchScore,
}: Props) => {
  let res: Res = { status: 0, data: { followings: [] }, error: "" };

  try {
    const result = await Axios.get("/circle/followings", {
      params: {
        search: !search || search.length < 3 ? "" : search,
        ...(lastDocId && { lastDocId, searchScore }),
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
