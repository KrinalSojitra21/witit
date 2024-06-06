import { QuestionType } from "@/types/question";
import { Axios } from "../axiosConfig";

type Props = {
  user_id: string;
  lastDocId?: string | undefined;
  otherUserId?: string;
  isLastReplyGiven?: boolean;
};

type Res = {
  status: number;
  data: QuestionType[] | null;
  error: any;
};
const getQuestions = async ({
  user_id,
  lastDocId,
  otherUserId,
  isLastReplyGiven,
}: Props) => {
  const res: Res = {
    status: 0,
    data: null,
    error: "",
  };
  try {
    const response = await Axios.get("question/all", {
      params: {
        limit: 10,
        ...(lastDocId && { lastDocId }),
        ...(otherUserId && { otherUserId }),
        ...(isLastReplyGiven && { isLastReplyGiven }),
      },
      headers: {
        user_id,
      },
    });
    res.status = 200;
    res.data = response.data.data;
  } catch (error: any) {
    res.status = error.response.status;
    res.error = error.response.data.error;
  }
  return res;
};

export default getQuestions;
