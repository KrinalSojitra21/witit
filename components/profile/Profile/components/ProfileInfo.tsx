import { joinOrLeaveCircle } from "@/api/cricle/joinOrLeaveCircle";
import { CustomImagePreview } from "@/components/shared/CustomImagePreview";
import { useAuthContext } from "@/context/AuthContext";
import { RootState } from "@/redux/store";
import { getFormatedSocialLinks } from "@/service/profile/getFormatedSocialLinks";
import { ReduxUser, UserType } from "@/types/user";
import SendIcon from "@/utils/icons/circle/SendIcon";
import VerifiedIcon from "@/utils/icons/circle/VerifiedIcon";
import OfferingIcon from "@/utils/icons/profile/OfferingIcon";
import InstagramIcon from "@/utils/icons/setting/socialMedia/InstagramIcon";
import TiktokIcon from "@/utils/icons/setting/socialMedia/TiktokIcon";
import TwitchIcon from "@/utils/icons/setting/socialMedia/TwitchIcon";
import TwitterIcon from "@/utils/icons/setting/socialMedia/TwitterIcon";
import YouTubeIcon from "@/utils/icons/setting/socialMedia/YouTubeIcon";
import { profilePlaceholderImage } from "@/utils/images";
import { join } from "path";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useProfileContext } from "../context/ProfileContext";

type Props = {
  contentType: "MEMBERS" | "OFFERING";
  setContentType: React.Dispatch<React.SetStateAction<"MEMBERS" | "OFFERING">>;
};

export const ProfileInfo = ({ setContentType, contentType }: Props) => {
  const { sendNotification } = useAuthContext();
  const { currentUser, setCurrentUser } = useProfileContext();

  const user = useSelector((state: RootState) => state.user);

  if (!currentUser) return <></>;
  if (!user) return <></>;

  const socialLinks = getFormatedSocialLinks(currentUser?.linkedAccounts);

  const handleJoinOrLeaveCircle = async () => {
    const res = await joinOrLeaveCircle({
      user_id: user?.userId,
      isJoiningCircle: currentUser.isMyFollowing ? false : true,
      friendId: currentUser.userId,
    });

    if (res.status === 200) {
      sendNotification({
        type: "SUCCESS",
        message: currentUser.isMyFollowing
          ? "You have successfully leave circle"
          : "You have successfully joined circle",
      });

      setCurrentUser((prev) => {
        if (prev) {
          return {
            ...prev,
            isMyFollowing: !prev.isMyFollowing,
          };
        } else {
          return null;
        }
      });

      return;
    }
    sendNotification({ type: "ERROR", message: res.error });
  };
  return (
    <>
      <div className="relative">
        <div className="relative w-[62px] h-[62px] rounded-xl border border-grey-500 bg-grey-600 overflow-hidden">
          <CustomImagePreview
            image={
              currentUser?.generalInfo.profileImage ?? profilePlaceholderImage
            }
          />
        </div>
        {/* <div className="w-[24px] h-[24px] flex items-center justify-center rounded-md p-[0.1rem] bg-primary-main absolute right-[-4px] bottom-[-4px]">
          <div className=" scale-[0.65]">
            <AutomodeBlackIcon />
          </div>
        </div> */}
      </div>
      <p className="text-base tracking-wider flex gap-1">
        {currentUser?.userName}
        {currentUser?.userType === UserType.VERIFIED ? (
          <span className=" text-blue-light scale-[0.6]">
            <VerifiedIcon />
          </span>
        ) : null}
      </p>
      {currentUser?.generalInfo.bio ? (
        <div className="text-center tracking-wider font-light w-[80%]">
          <p className="text-grey-300 line-clamp-5 leading-[18px] text-xs whitespace-pre-wrap">
            {currentUser?.generalInfo.bio}
          </p>
          {/* <span className="text-xs text-primary-light underline cursor-pointer">
            View More
          </span> */}
        </div>
      ) : null}
      <div className="flex items-center py-0.5">
        {socialLinks.map((link, index) => {
          return (
            // <Tooltip key={index} title={link.name} placement="top">
            <div
              key={index}
              className={`px-2 transition-colors cursor-pointer opacity-40  ${
                index < socialLinks.length - 1
                  ? "border-r-[1px] border-r-grey-200"
                  : ""
              } hover:text-primary-main hover:opacity-100 `}
            >
              {link.name === "Youtube" ? (
                <a href={link.value} target="_blank">
                  <YouTubeIcon />
                </a>
              ) : link.name === "Twitch" ? (
                <a href={link.value} target="_blank">
                  <TwitchIcon />
                </a>
              ) : link.name === "Instagram" ? (
                <a href={link.value} target="_blank">
                  <InstagramIcon />
                </a>
              ) : link.name === "Twitter" ? (
                <a href={link.value} target="_blank">
                  <TwitterIcon />
                </a>
              ) : (
                <a href={link.value} target="_blank">
                  <TiktokIcon />
                </a>
              )}
            </div>
            // </Tooltip>
          );
        })}
      </div>
      <div className="flex gap-2.5 w-full justify-center">
        <div
          className={`p-1 border ${
            contentType === "OFFERING"
              ? "bg-primary-main border-primary-main "
              : "border-grey-500 hover:bg-opacity-25 hover:border-opacity-25"
          }  rounded-lg relative h-full aspect-square flex items-center justify-center cursor-pointer hover:bg-primary-main hover:border-primary-main `}
          onClick={() => {
            setContentType("OFFERING");
          }}
        >
          <OfferingIcon />
        </div>
        <div
          className={` ${
            contentType === "MEMBERS"
              ? "bg-primary-main border-primary-main "
              : "border-grey-500 bg-grey-700 hover:bg-opacity-25 hover:border-opacity-25"
          } px-3 py-2 flex items-center gap-1 rounded-lg relative font-light text-sm border border-grey-500 cursor-pointer hover:bg-primary-main hover:border-primary-main `}
          onClick={() => {
            setContentType("MEMBERS");
          }}
        >
          <span className="font-semibold">
            {currentUser.counts.followerCount}
          </span>
          Members
        </div>{" "}
        {user?.userId !== currentUser.userId && (
          <div
            className="bg-grey-700 px-3 py-2 flex items-center gap-1 rounded-lg relative font-light text-sm border border-grey-500 cursor-pointer hover:bg-primary-main hover:border-primary-main hover:bg-opacity-25 hover:border-opacity-25 whitespace-nowrap"
            onClick={() => {
              handleJoinOrLeaveCircle();
            }}
          >
            {currentUser.isMyFollowing ? "Leave Circle" : "Join Circle"}
          </div>
        )}
        {user?.userId !== currentUser.userId && (
          <div
            className={`border  border-grey-500  rounded-lg relative h-full aspect-square flex items-center justify-center hover:bg-primary-main hover:border-primary-main hover:bg-opacity-25 hover:border-opacity-25 cursor-pointer`}
          >
            <div className=" scale-75">
              <SendIcon />
            </div>
          </div>
        )}
      </div>
    </>
  );
};
