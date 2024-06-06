import { Axios } from "../axiosConfig";

type Props = {
  user_id: string | undefined;
  questionId: string | undefined;
};

type Res = {
  status: number;
  data: null;
  error: any;
};
const deleteQuestion = async ({ user_id, questionId }: Props) => {
  const res: Res = {
    status: 0,
    data: null,
    error: "",
  };
  try {
    const response = await Axios.delete(
      "/question",

      {
        params: { questionId },
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

export default deleteQuestion;
