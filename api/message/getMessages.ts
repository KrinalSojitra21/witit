import { Message } from "./../../types/message";
import { Axios } from "../axiosConfig";

type Props = {
  user_id: string | undefined;
  receiverId: string | undefined;
  limit: number;
  lastDocId?: string | null;
};
type res = {
  status: number;
  data: Message[] | null;
  error: any;
};

const getMessages = async ({
  receiverId,
  user_id,
  limit,
  lastDocId,
}: Props) => {
  const res: res | null = {
    status: 0,
    data: null,
    error: "",
  };
  try {
    const response = await Axios.get("message", {
      params: {
        receiverId,
        limit,
        ...(lastDocId && { lastDocId }),
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

export default getMessages;
