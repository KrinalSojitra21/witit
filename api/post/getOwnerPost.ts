import { OwnerPost, Post, PostComment } from "@/types/post";
import { Axios } from "../axiosConfig";

type Props = {
  user_id: string;
  postId: string;
};

type Res = {
  status: number;
  data: OwnerPost | null;
  error: any;
};

export const getOwnerPost = async ({ user_id, postId }: Props) => {
  let res: Res = { status: 0, data: null, error: "" };

  try {
    const result = await Axios.get("post/owner", {
      params: {
        postId,
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
