import { ReduxUser } from "@/types/user";
import { Axios } from "../axiosConfig";

type Params = {
  data: Record<string, any>;
  user_id: string;
};

type Res = {
  status: number;
  data: ReduxUser | null;
  error: string;
};

export const createUser = async ({ data, user_id }: Params) => {
  let res: Res = { status: 0, data: null, error: "" };
  const body = {
    userName: data?.userName,
    email: data?.email,
    phone: null,
    generalInfo: {
      firstName: data?.firstName,
      lastName: data?.lastName,
      profileImage: data?.image || null,
      bio: null,
      DOB: data?.DOB || null,
      describedWord: data?.describedWord,
    },
  };

  try {
    const result = await Axios.post("/user", body, {
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
