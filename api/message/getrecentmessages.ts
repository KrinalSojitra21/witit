import { RecentMessage } from "@/types/message";
import { Axios } from "../axiosConfig";

type Props = {
  user_id: string | undefined;
  lastDocId: string | undefined;
};

type res = {
  status: number;
  data: RecentMessage[];
  error: any;
};
const getrecentmessages = async ({ user_id, lastDocId }: Props) => {
  const res: res = {
    status: 0,
    data: [],
    error: "",
  };
  try {
    const response = await Axios.get("message/recent_messages", {
      headers: {
        user_id,
        ...(lastDocId && { lastDocId }),
      },
    });
    res.status = 200;
    res.data = response?.data?.data;
  } catch (error: any) {
    res.status = error.response.status;
    res.error = error.response.data.error;
  }
  return res;
};

export default getrecentmessages;
