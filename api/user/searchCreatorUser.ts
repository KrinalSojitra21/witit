import { SearchCreator } from "@/types/user";
import { Axios } from "../axiosConfig";

type Res = {
  status: number;
  data: SearchCreator[];
  error: any;
};

type Props = {
  user_id: string;
  search?: string;
  limit?: number;
  paginationInfo?: {
    lastDocId: string;
    searchScore: number;
    followerCount: number;
  };
};
export const searchCreatorUser = async ({
  user_id,
  search,
  paginationInfo,
  limit,
}: Props) => {
  let res: Res = { status: 0, data: [], error: "" };
  try {
    const result = await Axios.get("/discover/user", {
      params: {
        search,
        ...(paginationInfo && {
          lastDocId: paginationInfo.lastDocId,
          searchScore: paginationInfo.searchScore,
          followerCount: paginationInfo.followerCount,
        }),

        ...(limit && { limit }),
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
