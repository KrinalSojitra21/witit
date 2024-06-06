import { Axios } from "../axiosConfig";

type Data = {
  dynamicProfileLink: string;
};

type Res = {
  status: number;
  data: Data;
  error: string;
};

export const getProfileDynamicLink = async (userName: string) => {
  let res: Res = { status: 0, data: { dynamicProfileLink: "" }, error: "" };

  try {
    const result = await Axios.get("/getProfileLink?userName=" + userName);

    res.status = 200;
    res.data = result.data.data;
  } catch (error: any) {
    res.status = error.response.status;
    res.error = error.response.data.error;
  }

  return res;
};
