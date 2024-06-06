import { Axios } from "../axiosConfig";

type Details = {
  credit: number;
  user_id: string | undefined;
};
type res = {
  status: number;
  error: any;
  data: string;
};
const withdrawCredit = async ({ credit, user_id }: Details) => {
  let res: res = {
    status: 0,
    error: "",
    data: "",
  };
  try {
    const result = await Axios.get(`stripe/withdraw_credit?credit=${credit}`, {
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

export default withdrawCredit;
