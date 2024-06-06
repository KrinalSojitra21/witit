import { Axios } from "../axiosConfig";

type Props = {
  credit: number;
  actionType: "ADD" | "WITHDRAWAL";
  user_id: string | undefined;
};

type Res = { status: number; data: { amount: number }; error: any };

export const getAmountFromCredit = async ({
  credit,
  actionType,
  user_id,
}: Props) => {
  let res: Res = { status: 0, data: { amount: 0 }, error: "" };

  try {
    const result = await Axios.get(`/stripe/get_amount_from_credit`, {
      params: {
        credit: credit,
        actionType: actionType,
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
