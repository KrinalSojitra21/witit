import { UpateOffering } from "@/types/offering";
import { Axios } from "../axiosConfig";

type Props = {
  user_id: string;
  body: {
    offerId: string;
    status: "CANCELLED_BY_USER";
  };
};

type Res = {
  status: number;
  data: null;
  error: any;
};

export const updateOfferAsUser = async ({ user_id, body }: Props) => {
  let res: Res = { status: 0, data: null, error: "" };

  try {
    const result = await Axios.patch("/offering/user/offer", body, {
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
