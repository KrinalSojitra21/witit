import { QuestionType } from "@/types/question";
import { Axios } from "../axiosConfig";

type Props = {
  user_id: string | undefined;
  questionId: string | undefined;
  reply: string | null;
};

type Res = {
  status: number;
  data: QuestionType[] | null;
  error: any;
};
const updateReply = async ({ user_id, questionId, reply }: Props) => {
  const res: Res = {
    status: 0,
    data: null,
    error: "",
  };
  try {
    const response = await Axios.patch(
      "/question",
      {
        questionId,
        reply,
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

export default updateReply;
