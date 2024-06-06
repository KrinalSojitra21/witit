import { UpateOffering } from "@/types/offering";
import { Axios } from "../axiosConfig";

type Props = {
  user_id: string;
  body: {
    offerId: string;
    reportFor: string;
  };
};

type Res = {
  status: number;
  data: null;
  error: any;
};

export const reportOffer = async ({ user_id, body }: Props) => {
  let res: Res = { status: 0, data: null, error: "" };

  try {
    const result = await Axios.post("/offering/offer/report", body, {
      headers: {
        user_id,
      },
    });
    res.status = 200;
    res.data = result.data.data;
  } catch (error: any) {
    res.status = error.response.status;
    res.error = error.response.data.error;
  }

  return res;
};
