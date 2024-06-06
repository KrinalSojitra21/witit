import { Axios } from "../axiosConfig";

export const checkUsernameExist = async (userName: string) => {
  let res = { status: 0, data: { isAvailable: false }, error: "" };

  try {
    const result = await Axios.get("/checkUserNameExist?userName=" + userName);

    res.status = 200;
    res.data = result.data.data;
  } catch (error: any) {
    res.status = error.response.status;
    res.error = error.response.data.error;
  }

  return res;
};
