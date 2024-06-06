import { DiscoverPost, Post } from "@/types/post";
import { Axios } from "../axiosConfig";

type Props = {
  user_id: string;
  limit: number;
  lastDocId?: string;
  category?: string[];
  rank?: number;
};

type Res = {
  status: number;
  data: Post[];
  error: any;
};

export const getCircleFeed = async ({
  limit,
  lastDocId,
  user_id,
  category,
  rank,
}: Props) => {
  let res: Res = { status: 0, data: [], error: "" };
  try {
    const result = await Axios.post(
      "/circle/feed",
      {
        limit,
        ...(lastDocId && { lastDocId }),
        ...(rank && { rank }),
        ...(category && { category }),
      },
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
