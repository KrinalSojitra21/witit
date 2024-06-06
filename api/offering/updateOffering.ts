import { UpateOffering } from "@/types/offering";
import { Axios } from "../axiosConfig";

type Props = {
  user_id: string;
  UpdateOfferingData: UpateOffering;
};

type Res = {
  status: number;
  data: null;
  error: any;
};

export const updateOffering = async ({
  user_id,
  UpdateOfferingData,
}: Props) => {
  let res: Res = { status: 0, data: null, error: "" };

  try {
    const result = await Axios.patch("/offering", UpdateOfferingData, {
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
