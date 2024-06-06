import { DiscoverPost, Post } from "@/types/post";
import { Axios } from "../axiosConfig";

type Props = {
  user_id: string;
  limit: number;
  lastDocId?: string;
  search?: string;
};

type Res = {
  status: number;
  data: DiscoverPost[];
  error: any;
};

export const getDiscoverSearchPostByContent = async ({
  limit,
  lastDocId,
  user_id,
  search,
}: Props) => {
  let res: Res = { status: 0, data: [], error: "" };

  try {
    const result = await Axios.get(
      "/discover/content",

      {
        params: {
          limit,
          search: search && search.length > 2 ? search : "",

          ...(lastDocId && { lastDocId }),
          // ...(search && { search }),
        },
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
