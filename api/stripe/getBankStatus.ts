import { Axios } from "../axiosConfig";

type Res = { status: number; data: { status: string }; error: any };

export const getBankStatus = async ({ user_id }: { user_id: string | undefined }) => {
  let res: Res = { status: 0, data: { status: "" }, error: "" };

  try {
    const result = await Axios.get(`/stripe/get_bank_status`, {
      headers: {
        user_id,
      },
    });

    res.status = 200;
    res.data = result.data.data;
  } catch (error: any) {
    res.status = error.response?.status;
    res.error = error.response?.data.error;
  }

  return res;
};
