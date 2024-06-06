import { Post, PostComment } from "@/types/post";
import { Axios } from "../axiosConfig";
import { OfferingData } from "@/types/offering";

type Props = {
  user_id: string;
  limit: number;
  lastDocId?: string;
  lastPendingOffers?: number;
  otherUserId?: string;
};

type Res = {
  status: number;
  data: OfferingData[];
  error: any;
};

export const getOfferings = async ({
  limit,
  lastDocId,
  user_id,
  lastPendingOffers,
  otherUserId,
}: Props) => {
  let res: Res = { status: 0, data: [], error: "" };

  try {
    const result = await Axios.get("/offering/all", {
      params: {
        limit,
        ...(lastDocId && { lastDocId }),
        ...(lastPendingOffers && { lastPendingOffers }),
        ...(otherUserId && { otherUserId }),
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
