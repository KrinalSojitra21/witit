import { DefaultValues } from "@/types/createPostType";
import { Axios } from "../axiosConfig";

type Data = {
  category: string[];
  postId: string;
  caption: string | null;
};

type Props = {
  user_id: string | undefined;
  data: Data;
};

type Res = {
  status: number;
  data: null;
  error: any;
};

export const updatePost = async ({ user_id, data }: Props) => {
  let res: Res = { status: 0, data: null, error: "" };

  try {
    const result = await Axios.patch(
      "/post/update",
      data ,
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
