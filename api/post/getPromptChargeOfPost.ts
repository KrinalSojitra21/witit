import { PromptDetail, Post } from "@/types/post";
import { Axios } from "../axiosConfig";

type Props = {
  user_id: string;
  postId: string;
};

type Res = {
  status: number;
  data: string;
  error: any;
};

export const getPromptChargeOfPost = async ({ postId, user_id }: Props) => {
  let res: Res = { status: 0, data: "", error: "" };

  try {
    const result = await Axios.get("/post/prompt/charge", {
      params: {
        ...(postId && { postId }),
      },
      headers: {
        user_id,
      },
    });

    res.status = 200;
    res.data = result.data.data.creditPerPromptView;
  } catch (error: any) {
    res.status = error.response.status;
    res.error = error.response.data.error;
  }

  return res;
};
