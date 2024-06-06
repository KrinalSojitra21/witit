import React from "react";
import Image from "next/image";
import temp1 from "@/utils/images/tempboy.jpg";
import VerifiedIcon from "@/utils/icons/circle/VerifiedIcon";
import { SearchCreator } from "@/types/user";
import { CustomImagePreview } from "@/components/shared/CustomImagePreview";
import appConstant from "@/utils/constants/withoutHtml/appConstant";
import { useRouter } from "next/router";
import { redirectTouserProfile } from "@/service/shared/redirectTouserProfile";
import { RootState } from "@/redux/store";
import { useSelector } from "react-redux";

type Props = {
  creator: SearchCreator;
};
const CreatorItem = ({ creator }: Props) => {
  const router = useRouter();
  const user = useSelector((state: RootState) => state.user);

  return (
    <div
      className="flex justify-between items-center cursor-pointer"
      onClick={() => {
        router.push(redirectTouserProfile(creator.userId, user?.userId));
      }}
    >
      <div className="flex items-center  gap-3 ">
        <div className="relative w-9 h-9 rounded-md overflow-hidden bg-grey-600">
          {/* <div className="relative  w-[50px] h-[50px] rounded-md overflow-hidden  bg-grey-700 ">
                <CustomImagePreview
                  image={
                    selectedPost.postedBy.profileImage
                      ? selectedPost.postedBy.profileImage
                      : appConstant.defaultProfileImage
                  }
                />
              </div> */}
          <CustomImagePreview
            image={
              creator.generalInfo.profileImage
                ? creator.generalInfo.profileImage
                : appConstant.defaultProfileImage
            }
          />
        </div>

        <div className="">
          <div className="flex items-center">
            <p className="text-base font-light">{creator.userName}</p>
            {creator.userType === "VERIFIED" ? (
              <div className=" text-blue-light scale-[0.6]">
                <VerifiedIcon />
              </div>
            ) : null}
          </div>
          <p className="text-grey-200 text-xs font-light tracking-wide">
            {creator.counts.followerCount} Members{" "}
          </p>
        </div>
      </div>
      {/* <div className="  w-[26px] h-[26px] flex justify-center items-center bg-primary-main rounded-full border-[#212226] border-[3px] text-common-white">
      <p className="absolute z-40 text-xs ">1</p>
    </div> */}
    </div>
  );
};

export default CreatorItem;
