import { Axios } from "../axiosConfig";
import {
  AiCharges,
  CreationSettings,
  GetAiGeneration,
  RecreationSettings,
  SuperShoot,
} from "@/types/ai";

type Props = {
  user_id: string;
  isJoiningCircle: boolean;
  friendId: string;
};

type Res = {
  status: number;
  data: null;
  error: any;
};

export const joinOrLeaveCircle = async ({
  user_id,
  friendId,
  isJoiningCircle,
}: Props) => {
  let res: Res = {
    status: 0,
    data: null,
    error: "",
  };

  try {
    const result = await Axios.post(
      "/circle/join-or-leave",
      {
        friendId,
        isJoiningCircle,
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
