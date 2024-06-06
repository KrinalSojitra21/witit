import { DropDownItem } from "@/types";
import PostIcon from "@/utils/icons/navbar/PostIcon";
import DownloadIcon from "@/utils/icons/setting/DownloadIcon";
import AutomodeBlackIcon from "@/utils/icons/shared/AutomodeBlackIcon";
import ShareIcon from "@/utils/icons/shared/ShareIcon";
import UpscaleIcon from "@/utils/icons/shared/UpscaleIcon";

export const GenerationActionList: DropDownItem[] = [
  {
    title: "Download",
    startIcon: (
      <div className="scale-75">
        <DownloadIcon />
      </div>
    ),
    actionType: "DOWNLOAD",
  },
  {
    title: "Recreate",
    startIcon: (
      <div className="scale-75">
        <AutomodeBlackIcon />
      </div>
    ),
    actionType: "RECREATE",
  },
  {
    startIcon: (
      <div className="scale-90">
        <PostIcon />
      </div>
    ),
    title: "Post",
    actionType: "POST",
  },
  {
    startIcon: (
      <div className="scale-90">
        <ShareIcon />
      </div>
    ),
    title: "Share",
    actionType: "SHARE",
  },
  {
    startIcon: (
      <div className="scale-75">
        <UpscaleIcon />
      </div>
    ),
    title: "Upscale",
    actionType: "UP_SCALE",
  },
];
