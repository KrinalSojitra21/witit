import { generationSettingsUnit } from "@/types/user";
import { Axios } from "../axiosConfig";


type Props = {
    creatorId:string,
    user_id:string | undefined
}
type Res = {
    status:number;
    data : generationSettingsUnit | null
    error:any
}

const getGenerationSetting = async({ creatorId,user_id }:Props) => {
  let res: Res = { status: 0, data: null,error:""}

  try {
    const result = await Axios.get("user/generation-setting", {
      params: {
        creatorId,
      },
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

export default getGenerationSetting;
