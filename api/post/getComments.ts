import { Post, PostComment } from "@/types/post";
import { Axios } from "../axiosConfig";

type Props = {
  user_id: string;
  limit: number;
  lastDocId?: string;
  postId?: string;
};

type Res = {
  status: number;
  data: PostComment[];
  error: any;
};

export const getComments = async ({
  limit,
  lastDocId,
  user_id,
  postId,
}: Props) => {
  let res: Res = { status: 0, data: [], error: "" };

  try {
    const result = await Axios.get("/post/comment", {
      params: {
        limit,
        ...(lastDocId && { lastDocId }),
        ...(postId && { postId }),
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
