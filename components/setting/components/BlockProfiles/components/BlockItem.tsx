import CustomButton from "@/components/shared/CustomButton";
import React from "react";
import { BlockedUser } from "@/types/user";
import dayjs from "dayjs";
import { CustomImagePreview } from "@/components/shared/CustomImagePreview";
import { profilePlaceholderImage } from "@/utils/images";

type Props = {
  blockedUser: BlockedUser;
  unblockUser: (data: { blockedUserId: string }) => Promise<void>;
};
const BlockItem = ({ blockedUser, unblockUser }: Props) => {
  return (
    <div className="w-full flex justify-between py-3  ">
      <div className="w-full flex items-center gap-5  ">
        <div className="relative w-[46px] h-[46px] rounded-md bg-grey-600">
          <CustomImagePreview
            image={
              blockedUser.blockedUserInfo.profileImage ??
              profilePlaceholderImage
            }
          />
        </div>
        <div className=" flex flex-col gap-1">
          <p className=" text-base font-light tracking-wider">karlshakur</p>
          <p className="text-grey-100 text-xs font-light tracking-wide">
            Blocked On {dayjs(blockedUser.createdAt).format("DD MMM, YYYY")}
          </p>
        </div>
      </div>
      <CustomButton
        className="w-[150px] px-10 text-sm bg-primary-main bg-opacity-0 hover:bg-opacity-100 hover:text-common-white border border-primary-main border-solid text-primary-main rounded-xl"
        name="Unblock"
        onClick={() =>
          unblockUser({
            blockedUserId: blockedUser.blockedUserInfo.userId,
          })
        }
      />
    </div>
  );
};

export default BlockItem;
