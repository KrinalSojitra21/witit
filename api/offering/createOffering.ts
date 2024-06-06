import { Axios } from "../axiosConfig";
import { CreateOffering, OfferingData } from "@/types/offering";

type Props = {
  offeringDetails: CreateOffering;
  user_id: string | undefined;
};
type Res = {
  status: number;
  data: OfferingData | null;
  error: any;
};
const createOffering = async ({ offeringDetails, user_id }: Props) => {
  const res: Res = {
    status: 0,
    data: null,
    error: "",
  };
  try {
    const result = await Axios.post("/offering", offeringDetails, {
      headers: {
        user_id,
      },
    });
    res.status = 200;
    res.data = result.data.data;
  } catch (error) {
    res.error = error;
  }
  return res;
};

export default createOffering;
