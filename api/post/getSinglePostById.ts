import { Post } from "@/types/post";
import { Axios } from "../axiosConfig";

type Props = {
  user_id: string;
  postId: string;
};

type Res = {
  status: number;
  data: Post | null;
  error: any;
};

export const getSinglePostById = async ({ postId, user_id }: Props) => {
  let res: Res = { status: 0, data: null, error: "" };

  try {
    const result = await Axios.get("/post/single", {
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
