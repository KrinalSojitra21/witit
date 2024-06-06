import { DiscoverPost, Post } from "@/types/post";
import { Axios } from "../axiosConfig";

type Props = {
  user_id: string;
  postId: string;
  description?: string;
  limit: number;
  lastDocId?: string;
  searchScore?: number;
};

type Res = {
  status: number;
  data: DiscoverPost[];
  error: any;
};

export const getSimilerFeed = async ({
  user_id,
  limit,
  lastDocId,
  searchScore,
  postId,
  description,
}: Props) => {
  let res: Res = { status: 0, data: [], error: "" };

  try {
    const result = await Axios.post(
      "/discover/similar_feed",
      {
        limit,
        ...(lastDocId && { lastDocId }),
        ...(searchScore && { searchScore }),
        ...(postId && { postId }),
        ...(description && { description }),
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
