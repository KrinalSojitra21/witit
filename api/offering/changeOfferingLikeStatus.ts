import { Axios } from "../axiosConfig";

type OfferingUpdateLikeData = {
  offeringId: string;
  isLike: boolean;
};
type Props = {
  offeringUpdateLikeData: OfferingUpdateLikeData;
  user_id: string | undefined;
};
type Res = {
  status: number;
  data: any;
  error: any;
};
const changeOfferingLikeStatus = async ({
  offeringUpdateLikeData,
  user_id,
}: Props) => {
  const res: Res = {
    status: 0,
    data: null,
    error: "",
  };
  try {
    const result = await Axios.post(
      "/offering/changeLikeStatus",
      offeringUpdateLikeData,
      {
        headers: {
          user_id,
        },
      }
    );
    res.status = 200;
    res.data = result.data.data;
  } catch (error) {
    res.error = error;
  }
  return res;
};

export default changeOfferingLikeStatus;
