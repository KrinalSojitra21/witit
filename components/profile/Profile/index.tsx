import React, { useEffect, useState } from "react";
import { useAuthContext } from "@/context/AuthContext";
import CustomButton from "@/components/shared/CustomButton";
import { Box, CircularProgress, Divider } from "@mui/material";
import { RootState } from "@/redux/store";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { blockOrUnblockUser } from "@/api/user/blockOrUnblockUser";
import { theme } from "@/theme";
import Moments from "../Moments";
import { Questionnaries } from "../Questionnaires";
import ProfileLeftSection from "./components/ProfileLeftSection";
import { getOtherUser } from "@/api/user/getOtherUser";
import { NoDataFound } from "@/components/shared/NoDataFound";
import { addUserPost } from "@/redux/slices/userPostSlice";
import FeedIcon from "@/utils/icons/profile/FeedIcon";
import MomentsIcon from "@/utils/icons/profile/MomentsIcon";
import { QuestionnariesIcon } from "@/utils/icons/profile/QuestionnariesIcon";
import { blockUserIllustrator } from "@/utils/images";
import { useProfileContext } from "./context/ProfileContext";
import Feed from "../Feed";
import { CustomImagePreview } from "@/components/shared/CustomImagePreview";
import OfferingIcon from "@/utils/icons/profile/OfferingIcon";
import Offering from "./components/Offering";

type ContentType = "FEED" | "QUESTIONNAIRES" | "MOMENTS" | "OFFERING";

type ProfileTab = {
  name: string;
  type: ContentType;
  startIcon: JSX.Element;
};

const profileTabs: ProfileTab[] = [
  {
    name: "Feed",
    type: "FEED",
    startIcon: <FeedIcon />,
  },
  {
    name: "Offering",
    type: "OFFERING",
    startIcon: <OfferingIcon />,
  },
  {
    name: "Questionnaires",
    type: "QUESTIONNAIRES",
    startIcon: <QuestionnariesIcon />,
  },
  {
    name: "Moments",
    type: "MOMENTS",
    startIcon: <MomentsIcon />,
  },
];
const Profile = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { asPath } = useRouter();

  const { sendNotification } = useAuthContext();
  const { currentUser, setCurrentUser } = useProfileContext();
  const [contentType, setcontentType] = useState<ContentType>("FEED");
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);

  let user = useSelector((state: RootState) => state.user);

  const [userId, setUserId] = useState<string | null>(null);

  const getUserData = async (userId: string) => {
    if (!user) return;
    const res = await getOtherUser({
      user_id: user.userId,
      profilerId: userId,
    });
    if (res.status === 200) {
      setCurrentUser(res.data);
      return;
    }
    sendNotification({ type: "ERROR", message: res.error });
  };

  const handleUserData = () => {
    if (!userId) return;

    getUserData(userId);
  };

  const unblockUser = async () => {
    if (!user) return;
    if (!userId) return;

    const res = await blockOrUnblockUser({
      user_id: user.userId,
      data: {
        isBlock: false,
        blockedUserId: userId,
      },
    });

    setCurrentUser(null);
    if (res.status === 200) {
      setCurrentUser(null);
      getUserData(userId);
      return;
    }
    sendNotification({ type: "ERROR", message: res.error });
  };

  useEffect(() => {
    // This runs after the component has mounted
    if (router.isReady) {
      const userIdFromRouter = router.query.user as string;
      setUserId(userIdFromRouter);
    }
  }, [router.isReady, asPath]);

  // useEffect(() => {
  //   setUserId(router.query.user as string);
  //   setCurrentUser(null);
  //   if (userId && userId !== user?.userId) {
  //     getUserData(userId);
  //   } else {
  //     setCurrentUser(user);
  //   }
  // }, [asPath]);

  // const handleUserRequest = async () => {
  //   const userName = router.asPath.slice(1, router.asPath.length);

  //   if (userName.length > 0) {
  //     const dynamicLinkData = await getUserByUserName(userName);

  //     if (dynamicLinkData.status === 200) {
  //       const link = dynamicLinkData.data.dynamicProfileLink;

  //       if (link) {
  //         window.location.href = link;
  //         console.log("redirecterd to:- ", link);
  //         return;
  //       }
  //     }
  //   }
  // };

  useEffect(() => {
    setCurrentUser(null);
    dispatch(addUserPost([]));

    if (userId !== null) {
      if (userId && userId !== user?.userId) {
        getUserData(userId);
      } else {
        setCurrentUser(user);
      }
    }
  }, [userId]);

  if (currentUser === null) {
    return (
      <div className=" bg-grey-900 absolute top-0 left-0 w-full h-full flex justify-center items-center">
        <CircularProgress size={20} className="text-common-white " />
      </div>
    );
  }

  if (currentUser.userId !== user?.userId && currentUser.blockedBy) {
    if (currentUser.blockedBy === user?.userId) {
      return (
        <NoDataFound
          image={
            <div className="relative w-20 h-20 ">
              <CustomImagePreview image={blockUserIllustrator} />
            </div>
          }
          title="You have blocked the user"
          description="it looks like you are unable to view a profile of this user because you blocked this user."
          buttonName="Unblock"
          handleEvent={unblockUser}
        />
      );
    }

    if (currentUser.blockedBy !== user?.userId) {
      return (
        <NoDataFound
          image={
            <div className="relative w-20 h-20 ">
              <CustomImagePreview image={blockUserIllustrator} />
            </div>
          }
          title="User has blocked you"
          description="it looks like you are unable to view a profile of this user because they blocked you."
        />
      );
    }
  }
  return (
    <div className="h-full flex">
      <div className="py-3 pl-3">
        <ProfileLeftSection handleUser={handleUserData} />
      </div>
      <div className="flex-grow h-hull flex flex-col ">
        <div className="px-5 pt-3 flex flex-col gap-3 z-10">
          <div className="flex gap-2">
            {profileTabs.map((tab, index) => {
              return (
                <CustomButton
                  key={index}
                  handleEvent={() => {
                    setcontentType(tab.type);
                    setSelectedPostId(null);
                  }}
                  className={`w-fit rounded-3xl px-4 py-2 font-light text-sm tracking-wider ${
                    contentType.includes(tab.type)
                      ? ""
                      : "bg-secondary-main text-grey-100 hover:bg-primary-main hover:bg-opacity-25"
                  }`}
                  name={tab.name}
                  startIcon={tab.startIcon}
                />
              );
            })}
          </div>

          <Divider
            sx={{
              borderColor: theme.palette.grey[500],
            }}
          />
        </div>

        {contentType === "FEED" ? (
          <Feed postId={selectedPostId} setPostId={setSelectedPostId} />
        ) : contentType === "QUESTIONNAIRES" ? (
          <Questionnaries />
        ) : contentType === "MOMENTS" ? (
          <Moments />
        ) : contentType === "OFFERING" ? (
          <Offering />
        ) : null}
      </div>
    </div>
  );
};

export default Profile;
