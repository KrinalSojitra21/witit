import { Offer } from "@/types/offering";
import { Axios } from "../axiosConfig";

type Res = {
  status: number;
  data: Offer[];
  error: any;
};

type Props = {
  user_id: string;
  limit: number;
  lastDocId?: string;
  status?: "ACCEPTED" | "ALL";
};

export const getCreatedOffers = async ({
  user_id,
  limit,
  lastDocId,
  status,
}: Props) => {
  const res: Res = {
    status: 0,
    data: [],
    error: "",
  };

  try {
    const result = await Axios.get("/offering/user/offers", {
      params: {
        limit,
        ...(lastDocId && { lastDocId }),
        ...(status && { status }),
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
