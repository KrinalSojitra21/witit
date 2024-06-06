import React from "react";
import { RecentMessage } from "@/types/message";
import { profilePlaceholderImage } from "@/utils/images";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import dayjs from "dayjs";
import { CustomImagePreview } from "@/components/shared/CustomImagePreview";
import VerifiedIcon from "@/utils/icons/circle/VerifiedIcon";

type Props = {
  profileChat: RecentMessage;
};
const RecentMessageItem = ({ profileChat }: Props) => {
  const user = useSelector((state: RootState) => state.user);
  let type;
  if (profileChat.receiver.id !== user?.userId) {
    type = profileChat.receiver.userType;
  } else {
    type = profileChat.sender.userType;
  }
  return (
    <div className="flex items-center w-full gap-3 px-3 py-3 h-full ">
      <div className="relative w-[40px] h-[40px] rounded-lg  overflow-hidden bg-grey-600">
        <CustomImagePreview
          image={
            (profileChat.receiver.id !== user?.userId
              ? profileChat.receiver.profileImage
              : profileChat.sender.profileImage) ?? profilePlaceholderImage
          }
        />
      </div>
      <div className="flex-grow flex flex-col gap-1">
        <div className="w-full flex justify-between ">
          <p className=" text-sm font-light flex items-center">
            {profileChat.receiver.id !== user?.userId
              ? profileChat.receiver.userName
              : profileChat.sender.userName}
            {type === "VERIFIED" && (
              <span className="text-blue-light scale-[0.6] ">
                <VerifiedIcon />
              </span>
            )}{" "}
          </p>{" "}
          <p className=" text-xs text-grey-300 ">
            {dayjs(profileChat?.createdAt).format("hh:mm A")}
          </p>
        </div>
        {profileChat.receiver?.id === user?.userId &&
          profileChat.messageStatus === "READ" && (
            <p className="text-grey-300 font-light text-xs  tracking-wide   w-[300px] truncate">
              {profileChat.lastMessage}
            </p>
          )}
        {profileChat.receiver?.id === user?.userId &&
          profileChat.messageStatus === "SENT" && (
            <p className="text-common-white font-bold text-xs  tracking-wide  w-[300px] truncate">
              {profileChat.lastMessage}
            </p>
          )}
        {profileChat.sender?.id === user?.userId &&
          profileChat.messageStatus === "SENT" && (
            <p className="text-grey-300 font-light text-xs  tracking-wide   w-[300px] truncate">
              Sent
            </p>
          )}
        {profileChat.sender?.id === user?.userId &&
          profileChat.messageStatus === "READ" && (
            <p className="text-grey-300  text-xs  tracking-wide  w-[300px] truncate">
              Seen
            </p>
          )}
      </div>
    </div>
  );
};

export default RecentMessageItem;
