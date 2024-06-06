import { Axios } from "../axiosConfig";

type Props = {
  user_id: string;
  postId: string;
  isLiked: boolean;
};

type Res = {
  status: number;
  data: null;
  error: any;
};

export const likePost = async ({ user_id, postId, isLiked }: Props) => {
  let res: Res = { status: 0, data: null, error: "" };

  try {
    const result = await Axios.post(
      "/post/changeLikeStatus",
      { postId, isLiked },
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
