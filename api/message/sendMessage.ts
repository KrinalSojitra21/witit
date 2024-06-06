import {  Message } from "@/types/message";
import { Axios } from "../axiosConfig";
import { Image } from "@/types/post";

type res = {
  status: number;
  data: Message | null;
  error: any;
};
export type Props = {
  messageId: string;
  user_id: string | undefined;
  receiverId: string;
  message: string | null;
  image: Partial<Image>[] | null;
};

const sendMessage = async ({
  messageId,
  user_id,
  receiverId,
  message,
  image,
}: Props) => {
  const res: res = {
    status: 0,
    data: null,
    error: "",
  };
  try {
    const response = await Axios.post(
      "message",
      {
        messageId,
        receiverId,
        message,
        image,
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
    res.status = error.response.status;
    res.error = error.response.data.error;
  }
  return res;
};

export default sendMessage;
