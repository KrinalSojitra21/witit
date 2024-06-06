import { FriendsList } from "@/types/circle";
import { Axios } from "../axiosConfig";

type Props = {
  search: string;
  user_id: string | undefined;
  searchScore?: number;
  lastDocId?: string;
  limit: number;
};

type data = {
  friends: FriendsList[];
};

type res = {
  status: number;
  data: data | null;
  error: any;
};
const getAllFriends = async ({
  search,
  searchScore,
  lastDocId,
  user_id,
  limit,
}: Props) => {
  let res: res = {
    status: 0,
    data: null,
    error: "",
  };

  try {
    const response = await Axios.get("circle/friends", {
      params: {
        limit,
        search,
        ...(lastDocId && { lastDocId }),
        ...(searchScore && { searchScore }),
      },
      headers: {
        user_id,
      },
    });
    res.status = 200;
    res.data = response.data.data;
  } catch (error: any) {
    res.status = error.response.status;
    res.error = error.response.data.error;
  }
  return res;
};

export default getAllFriends;
