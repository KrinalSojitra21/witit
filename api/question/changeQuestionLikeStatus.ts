import { Axios } from "../axiosConfig";

type Props = {
  user_id: string | undefined;
  questionId: string | undefined;
  isLike: boolean;
};

type Res = {
  status: number;
  data: null;
  error: any;
};
const changeQuestionLikeStatus = async ({
  user_id,
  questionId,
  isLike,
}: Props) => {
 
  const res: Res = {
    status: 0,
    data: null,
    error: "",
  };
  try {
    const response = await Axios.post(
      "/question/changeLikeStatus",
      {
        questionId,
        isLike,
      },
      {
        headers: {
          user_id,
        },
      }
    );
    res.status = 200;
    res.data = response.data.data;
  } catch (error: any) {
    res.status = error.status;
    res.error = error.response.data.error;
  }
  return res;
};

export default changeQuestionLikeStatus;
