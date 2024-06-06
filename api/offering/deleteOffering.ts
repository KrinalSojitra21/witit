import { Axios } from "../axiosConfig";

type Props = {
  user_id: string | undefined;
  offeringId: number | string;
};
type Res = {
  status: number;
  data: string | null;
  error: any;
};

const deleteOffering = async ({ user_id, offeringId }: Props) => {
  const res: Res = {
    status: 0,
    data: null,
    error: "",
  };
  try {
    const result = await Axios.delete("/offering", {
      params: {
        offeringId,
      },
      headers: {
        user_id,
      },
    });
    res.status = 200;
    res.data = result.data.message;
  } catch (error: any) {
    res.status = 200;
    res.error = error;
  }
  return res;
};

export default deleteOffering;
