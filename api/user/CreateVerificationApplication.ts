import React from "react";
import { Axios } from "../axiosConfig";
type Doc = {
  documentName: string;
  documentImages: (string | null)[];
};

type ResType = {
  status: number;
  data: Doc;
  error: any;
};

type Props = {
  data: Doc;
  user_id: string | undefined;
};
const createVerificationApplication = async ({ data, user_id }: Props) => {
  const res: ResType = {
    status: 0,
    data: {
      documentName: "",
      documentImages: [],
    },
    error: "",
  };
  try {
    const result = await Axios.post(
      "user/verification/create_application",
      data,
      {
        headers: {
          user_id,
        },
      }
    );
    res.status = 200;
    res.data = result.data.data;
  } catch (error: any) {
    res.status = error.response.status;
    res.error = error.response.data.error;
  }
  return res;
};

export default createVerificationApplication;
