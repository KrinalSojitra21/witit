import { QuestionType } from "@/types/question";
import { Axios } from "../axiosConfig";

type Props = {
  user_id: string | undefined;
  creatorId: string | undefined;
  question: string | null;
};

type Res = {
  status: number;
  data: QuestionType | null;
  error: any;
};
const askQuestion = async ({ user_id, creatorId, question }: Props) => {
  const res: Res = {
    status: 0,
    data: null,
    error: "",
  };
  try {
    const response = await Axios.post(
      "/question",
      {
        creatorId,
        question,
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

export default askQuestion;
