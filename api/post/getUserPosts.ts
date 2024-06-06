import { OtherUserPost, Post } from "@/types/post";
import { Axios } from "../axiosConfig";

type Props = {
  user_id: string;
  limit: number;
  lastDocId?: string;
  profilerId?: string;
};

type Res = {
  status: number;
  data: Post[];
  error: any;
};

export const getUserPosts = async ({
  limit,
  lastDocId,
  user_id,
  profilerId,
}: Props) => {
  let res: Res = { status: 0, data: [], error: "" };

  let url = "/post/user/all";

  if (profilerId) {
    url = "/post/other-user/all";
  }

  try {
    const result = await Axios.get(url, {
      params: {
        limit,
        ...(lastDocId && { lastDocId }),
        ...(profilerId && { profilerId }),
      },
      headers: {
        user_id,
      },
    });

    res.status = 200;
    if (result.data.data.length >= 0) {
      res.data = result.data.data;
    } else {
      res.data = result.data.data.postData;
    }
  } catch (error: any) {
    res.status = error.response.status;
    res.error = error.response.data.error;
  }

  return res;
};
