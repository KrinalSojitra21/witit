import { PromptDetail, Post } from "@/types/post";
import { Axios } from "../axiosConfig";

type Props = {
  user_id: string;
  postId: string;
};

type Res = {
  status: number;
  data: PromptDetail | null;
  error: any;
};

export const getAccessToViewPromptOfPost = async ({
  postId,
  user_id,
}: Props) => {
  let res: Res = { status: 0, data: null, error: "" };

  try {
    const result = await Axios.get("/post/access-prompt", {
      params: {
        ...(postId && { postId }),
      },
      headers: {
        user_id,
      },
    });

    res.status = 200;
    res.data = result.data.data.promptDetails;
  } catch (error: any) {
    res.status = error.response.status;
    res.error = error.response.data.error;
  }

  return res;
};
