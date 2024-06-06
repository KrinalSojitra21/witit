import { Axios } from "../axiosConfig";
import { BaseModel, FriendModel, UserModel } from "@/types/ai";

type LastDoc = {
  lastDocId: string;
  searchScore: number;
};

type Props = {
  user_id: string;
  search?: string;
  lastDoc?: LastDoc;
  limit: number;
};

type Data = {
  friendsModelList: FriendModel[];
};

type Res = {
  status: number;
  data: Data;
  error: any;
};

export const getFriendAiModels = async ({
  user_id,
  search,
  limit,
  lastDoc,
}: Props) => {
  let res: Res = {
    status: 0,
    data: { friendsModelList: [] },
    error: "",
  };

  try {
    const result = await Axios.get("/ai/friends", {
      params: {
        search: search && search.length > 2 ? search : "",
        ...(lastDoc && lastDoc),
        limit,
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
