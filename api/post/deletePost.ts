import { Axios } from "../axiosConfig";

type Props = {
  user_id: string;
  postId: string;
};

type Res = {
  status: number;
  data: any;
  error: any;
};

export const deletePost = async ({ user_id, postId }: Props) => {
  let res: Res = { status: 0, data: null, error: "" };

  try {
    const result = await Axios.delete("/post/delete", {
      params: {
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
