import appConstant from "@/utils/constants/withoutHtml/appConstant";
import axios from "axios";

export const Axios = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    api_key: process.env.NEXT_PUBLIC_API_KEY,
    is_mobile_app: true,
  },
});
