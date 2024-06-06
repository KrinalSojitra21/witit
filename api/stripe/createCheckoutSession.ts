import { Result } from "postcss";
import { Axios } from "../axiosConfig";
import { Session } from "@/types/stripe";

type props = {
  credit: number;
  url: string;
  userid: string | undefined;
};
type Data = {
  credit: number;
  redirectUrl: string;
};
type res = {
  status: number;
  data: Session;
  error: any;
};
const createCheckoutSession = async ({ credit, url, userid }: props) => {
  const data: Data = {
    credit,
    redirectUrl: url,
  };
  const res: res = {
    status: 0,
    data: {
      sessionId: "",
      sessionUrl: "",
    },
    error: "",
  };
  try {
    const result = await Axios.post("stripe/create_checkout_session", data, {
      headers: {
        user_id: userid,
      },
    });
    res.status = 200;
    res.data = result.data.data;
  }catch (error: any) {
    res.status = error.response.status;
    res.error = error.response.data.error;
  }

  return res;
};

export default createCheckoutSession;
