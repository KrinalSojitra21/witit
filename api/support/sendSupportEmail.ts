import { Axios } from "../axiosConfig";

type data = {
  message: string;
  subject: string;
};
type Props = {
  user_Id: string;
  data: data;
};

type res = {
  status: number;
};
const sendSupportEmail = async ({ data, user_Id }: Props) => {
  const res = {
    status: 0,
    data: null,
    error: "",
  };
  try {
    const response = await Axios.post("support/contact", data, {
      headers: {
        user_Id,
      },
    });
    res.status = 200;
    res.data = response.data.message;
  } catch (err: any) {
    res.error = err;
  }
  return res;
};

export default sendSupportEmail;
