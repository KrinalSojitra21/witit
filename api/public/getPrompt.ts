import { Axios } from "../axiosConfig";
import { Activity } from "@/types/activity";

type Props = {
  path: "Man" | "Woman" | "Base" | "Style";
};

type Res = {
  status: number;
  data: { prompt: string };
  error: any;
};

export const getPrompt = async ({ path }: Props) => {
  let res: Res = { status: 0, data: { prompt: "" }, error: "" };

  try {
    const result = await Axios.get("/prompt/" + path.toLowerCase());

    res.status = 200;
    res.data = result.data.data;
  } catch (error: any) {
    res.status = error.response.status;
    res.error = error.response.data.error;
  }

  return res;
};
