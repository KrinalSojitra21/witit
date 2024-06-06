import { Axios } from "../axiosConfig";

type Data = {
  reportedUserId: string;
  reportFor: string;
};

type Props = {
  user_id: string;
  data: Data;
};

type Res = {
  status: number;
  data: null;
  error: any;
};

export const reportUser = async ({ user_id, data }: Props) => {
  let res: Res = { status: 0, data: null, error: "" };

  try {
    const result = await Axios.post("/report/user", data, {
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
