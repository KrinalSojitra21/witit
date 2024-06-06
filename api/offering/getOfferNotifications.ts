import { Axios } from "../axiosConfig";
import { Activity } from "@/types/activity";

type Res = {
  status: number;
  data: Activity[];
  error: any;
};

type Props = {
  user_id: string;
  limit: number;
  offerId: string;
};

export const getOfferNotifications = async ({
  user_id,
  limit,
  offerId,
}: Props) => {
  const res: Res = {
    status: 0,
    data: [],
    error: "",
  };

  try {
    const result = await Axios.get("/offering/offer/notifications", {
      params: {
        limit,
        offerId: offerId,
      },
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
