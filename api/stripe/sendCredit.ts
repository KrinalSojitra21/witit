import { Message } from "@/types/message";
import { Axios } from "../axiosConfig";

type CreditDetails = {
  creatorId: string;
  messageId: string;
  user_id: string | undefined;
  credit: number;
};
type res = {
  status: number;
  data: Message | null;
  error: any;
};

const sendCredit = async ({
  creatorId,
  messageId,
  user_id,
  credit,
}: CreditDetails) => {
  const res: res = {
    status: 0,
    data: null,
    error: "",
  };
  try {
    const result = await Axios.post(
      "message/send_credit",
      {
        creatorId: creatorId,
        messageId: messageId,
        credit: credit,
      },
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

export default sendCredit;
