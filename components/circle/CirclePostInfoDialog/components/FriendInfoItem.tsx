import { CustomImagePreview } from "@/components/shared/CustomImagePreview";
import { FriendsList } from "@/types/circle";
import { UserType } from "@/types/user";
import appConstant from "@/utils/constants/withoutHtml/appConstant";
import VerifiedIcon from "@/utils/icons/circle/VerifiedIcon";
import React from "react";

type Props = {
  friendInfo: FriendsList;
};
const FriendInfoItem = ({ friendInfo }: Props) => {
  return (
    <div className="flex gap-3 items-center ">
      <div className="min-w-[32px] h-8 rounded-md overflow-hidden relative bg-grey-600">
        <CustomImagePreview
          image={
            friendInfo.profileImage
              ? friendInfo.profileImage
              : appConstant.defaultProfileImage
          }
        />
      </div>
      <p className="text-sm tracking-wider flex gap-1">
        {friendInfo?.userName}
        {friendInfo?.userType === UserType.VERIFIED ? (
          <span className=" text-blue-light scale-[0.6]">
            <VerifiedIcon />
          </span>
        ) : null}
      </p>
    </div>
  );
};

export default FriendInfoItem;
