import { DiscoverPost, Post } from "@/types/post";
import { Axios } from "../axiosConfig";
import { Category } from "@/types/common";

type Props = {
  user_id: string;
  limit: number;
  lastDocId?: string;
  category?: string[];
};

type Res = {
  status: number;
  data: DiscoverPost[];
  error: any;
};

export const getDiscoverFeed = async ({
  limit,
  lastDocId,
  user_id,
  category,
}: Props) => {
  let res: Res = { status: 0, data: [], error: "" };
  try {
    const result = await Axios.post(
      "/discover/feed",
      {
        limit,
        ...(lastDocId && { lastDocId }),
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
