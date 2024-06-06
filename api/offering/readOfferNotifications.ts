import { Axios } from "../axiosConfig";
import { Activity } from "@/types/activity";

type Res = {
  status: number;
  data: string | null;
  error: any;
};

type Props = {
  user_id: string;
  offerId: string;
};

export const readOfferNotifications = async ({ user_id, offerId }: Props) => {
  const res: Res = {
    status: 0,
    data: null,
    error: "",
  };

  try {
    const result = await Axios.post(
      "/offering/offer/read",
      { offerId },
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
