import { Axios } from "../axiosConfig";

type Res = { status: number; data: { url: string }; error: any };

type Props = {
  user_id: string | undefined;
  returnUrl: string;
  refreshUrl: string;
};
export const getBankSetupUrl = async ({
  user_id,
  returnUrl,
  refreshUrl,
}: Props) => {
  let res: Res = { status: 0, data: { url: "" }, error: "" };

  try {
    const result = await Axios.get(`/stripe/get_bank_satup_url`, {
      params: {
        returnUrl,
        refreshUrl,
      },
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
