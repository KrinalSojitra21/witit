import { CustomImagePreview } from "@/components/shared/CustomImagePreview";
import { FriendsList } from "@/types/circle";
import VerifiedIcon from "@/utils/icons/circle/VerifiedIcon";
import { profilePlaceholderImage } from "@/utils/images";
import React from "react";

type Props = {
  profileChat: FriendsList;
};
const SearchUserItem = ({ profileChat }: Props) => {


  return (
    <div className="flex  items-center  w-full gap-3  px-2 py-3">
      <div className="relative w-[40px] h-[40px] rounded-md  overflow-hidden bg-grey-600">
        <CustomImagePreview
          image={
            profileChat.profileImage
              ? profileChat.profileImage
              : profilePlaceholderImage
          }
        />
      </div>
      <div className="flex-grow flex flex-col">
        <div className="w-full flex justify-between ">
          <p className=" flex items-center text-sm font-light ">
            {profileChat.userName}
            {profileChat.userType === "VERIFIED" && (
              <span className="text-blue-light scale-[0.6] ">
                <VerifiedIcon />
              </span>
            )}
          </p>{" "}
        </div>
      </div>
    </div>
  );
};

export default SearchUserItem;
