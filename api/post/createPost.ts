import { DefaultValues } from "@/types/createPostType";
import { Axios } from "../axiosConfig";
type Props = {
  postObject: Partial<DefaultValues>;
  user_id: string | undefined;
};
type Res = {
  status: number;
  data: null;
  error: any;
};
const createPost = async ({ postObject, user_id }: Props) => {
  const res: Res = {
    status: 0,
    data: null,
    error: "",
  };
  try {
    const result = await Axios.post("/post/create", postObject, {
      headers: {
        user_id,
      },
    });
    res.status = 200;
    res.data = result.data.data;
  } catch (error) {
    res.error = error;
  }
  return res;
};

export default createPost;
