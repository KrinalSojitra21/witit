import { DiscoverPost, Post, PostComment } from "@/types/post";
import { Axios } from "../axiosConfig";

type Props = {
  user_id: string;
  postId: string;
  comment: string;
};

type Res = {
  status: number;
  data: PostComment | null;
  error: any;
};

export const postComment = async ({ user_id, postId, comment }: Props) => {
  let res: Res = { status: 0, data: null, error: "" };

  try {
    const result = await Axios.post(
      "/post/comment",
      {
        ...(postId && { postId }),
        ...(comment && { comment }),
      },
      {
        headers: {
          user_id,
        },
      }
    );

    res.status = 200;
    res.data = result.data.data;
  } catch (error: any) {
    res.status = error.response.status;
    res.error = error.response.data.error;
  }

  return res;
};
