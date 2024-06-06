import React, { useEffect, useState } from "react";
import VerificationIcon from "@/utils/icons/circle/VerifiedIcon";
import SynchronizeIcon from "@/utils/icons/circle/SynchronizeIcon";
import CommentQuestionIcon from "@/utils/icons/shared/CommentQuestionIcon";
import CommentMessageIcon from "@/utils/icons/shared/CommentMessageIcon";
import AutomodeBlackIcon from "@/utils/icons/shared/AutomodeBlackIcon";
import { Checkbox, CircularProgress, Divider, IconButton } from "@mui/material";
import { theme } from "@/theme";
import { Favorite, FavoriteBorder } from "@mui/icons-material";
import { DropDownItem } from "@/types";
import ShareIcon from "@/utils/icons/shared/ShareIcon";
import OutLinedAlertIcon from "@/utils/icons/shared/OutLinedAlertIcon";
import { IconDropDown } from "../shared/dropDown/IconDropDown";
import { getRecentTimeFromTimeStamp } from "@/service/shared/getRecentTimeFromTimeStamp";
import { formatLargeNumber } from "@/service/shared/formatLargeNumber";
import ThreeVerticalDots from "@/utils/icons/circle/ThreeVerticalDots";
import appConstant from "@/utils/constants/withoutHtml/appConstant";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { CustomImagePreview } from "../shared/CustomImagePreview";
import { Blurhash } from "react-blurhash";
import { addViewedNSFWPost } from "@/redux/slices/viewedNSFWSlice";
import VisibilityOffIcon from "@/utils/icons/shared/VisibilityOffIcon";
import CustomButton from "../shared/CustomButton";
import DeleteIcon from "@/utils/icons/shared/DeleteIcon";
import { Post, PromptDetail } from "@/types/post";
import { UserBaseInfo } from "@/types/user";
import { useAuthContext } from "@/context/AuthContext";
import { set } from "react-hook-form";
import { useRouter } from "next/router";
import CopyIcon from "@/utils/icons/shared/CopyIcon";
import LinkCopyIcon from "@/utils/icons/shared/LinkCopyIcon";
import EditIcon from "@/utils/icons/shared/EditIcon";
import { redirectTouserProfile } from "@/service/shared/redirectTouserProfile";
import ReportDialog from "../shared/ReportDialog";

type Props = {
  postId?: string;
  selectedPost: Post;
  similarPostId?: string | null;
  setSelectedImageIndex: React.Dispatch<React.SetStateAction<number>>;
  setDeletingPostIndex: React.Dispatch<React.SetStateAction<string | null>>;
  setReportingPostIndex: React.Dispatch<React.SetStateAction<string | null>>;
  handleChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleRepost: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
  handleEdit?: (selectedPost: Post) => void;
  handlePostClicked: (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
    postId: string
  ) => void;
  setCreditDialogInfo: React.Dispatch<
    React.SetStateAction<{
      userInfo: UserBaseInfo;
      postId: string;
      isPostAccessed: boolean;
    } | null>
  >;
  creditDialogInfo: {
    userInfo: UserBaseInfo;
    postId: string;
    isPostAccessed: boolean;
  } | null;

  promptDetails: PromptDetail | null;
};

const CirclePost = ({
  handleEdit,
  handleChange,
  handleRepost,
  selectedPost,
  postId,
  setSelectedImageIndex,
  setReportingPostIndex,
  setDeletingPostIndex,
  setCreditDialogInfo,
  creditDialogInfo,
  promptDetails,
  handlePostClicked,
}: Props) => {
  const dispatch = useDispatch();
  const { sendNotification } = useAuthContext();
  const router = useRouter();

  const user = useSelector((state: RootState) => state.user);
  const viewedNsfwList = useSelector((state: RootState) => state.viewedNSFW);

  const isViewdPost = viewedNsfwList.find(
    (post) => post === selectedPost.postId
  );
  const [isNSFWVisible, setIsNSFWVisible] = useState<boolean>(false);
  const [menuList, setmenuList] = useState<DropDownItem[]>([]);
  const [recentInfo, setRecentInfo] = useState<{
    like: { isLiked: boolean; count: number };
    repost: { isReposted: boolean; count: number };
    postId: string;
  }>({
    like: {
      isLiked: selectedPost.userActivity.isLiked,
      count: selectedPost.counts.like,
    },
    repost: {
      isReposted: selectedPost.userActivity.isReposted,
      count: selectedPost.counts.repost,
    },
    postId: selectedPost.postId,
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(
      window.location.protocol +
        "//" +
        window.location.host +
        `/discover/post?postId=${selectedPost.postId}`
    );
    sendNotification({ type: "SUCCESS", message: "Post Coppied!!" });
  };

  const handleItemSelect = (type: string) => {
    if (selectedPost) {
      if (type === "EDIT") {
        if (handleEdit) {
          handleEdit(selectedPost);
        }
      }
      if (type === "DELETE") {
        setDeletingPostIndex(selectedPost.postId);
      }
      if (type === "COPY") {
        handleCopyLink();
      }
      if (type === "REPORT") {
        setReportingPostIndex(selectedPost.postId);
      }
    }
  };

  const handleLikeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRecentInfo((prev) => {
      return {
        isUpdated: true,
        postId: selectedPost.postId,
        like: {
          isLiked: !prev.like.isLiked ? true : false,
          count: !prev.like.isLiked
            ? prev.like.count + 1
            : prev.like.count !== 0
            ? prev.like.count - 1
            : 0,
        },
        repost: {
          isReposted: prev.repost.isReposted,
          count: prev.repost.count,
        },
      };
    });
    handleChange(e);
  };

  useEffect(() => {
    if (selectedPost) {
      if (isViewdPost) {
        setIsNSFWVisible(false);
      } else {
        setIsNSFWVisible(selectedPost.category.includes("NSFW"));
      }
    }
  }, [selectedPost, isViewdPost]);

  useEffect(() => {
    const baseMenu = [
      {
        startIcon: (
          <div className=" ">
            <LinkCopyIcon />
          </div>
        ),
        title: "Copy Post Link",
        actionType: "COPY",
      },
    ];
    if (selectedPost && selectedPost.postedBy.userId === user?.userId) {
      baseMenu.push({
        startIcon: <EditIcon />,
        title: "Edit",
        actionType: "EDIT",
      });
      baseMenu.push({
        startIcon: <DeleteIcon />,
        title: "Delete",
        actionType: "DELETE",
      });
    } else {
      baseMenu.push({
        startIcon: <OutLinedAlertIcon />,
        title: "Report",
        actionType: "REPORT",
      });
    }
    setmenuList(baseMenu);

    if (
      (selectedPost.userActivity.isLiked !== recentInfo.like.isLiked ||
        selectedPost.userActivity.isReposted !==
          recentInfo.repost.isReposted) &&
      selectedPost.postId !== ""
    ) {
      setRecentInfo(() => {
        return {
          postId: selectedPost.postId,
          like: {
            isLiked: selectedPost.userActivity.isLiked,
            count: selectedPost.counts.like,
          },

          repost: {
            isReposted: selectedPost.userActivity.isReposted,
            count: selectedPost.counts.repost,
          },
        };
      });
    }
  }, [selectedPost]);

  useEffect(() => {
    if (selectedPost.postId === recentInfo.postId) {
    }
  }, [selectedPost, recentInfo]);

  useEffect(() => {
    setIsLoading(false);
    if (promptDetails) {
    }
  }, [promptDetails]);

  useEffect(() => {
    if (creditDialogInfo) {
      if (creditDialogInfo === null && promptDetails === null) {
        setIsLoading(false);
      } else if (
        creditDialogInfo?.isPostAccessed === true &&
        creditDialogInfo &&
        promptDetails === null
      ) {
        setIsLoading(true);
      } else if (
        creditDialogInfo?.isPostAccessed === true &&
        creditDialogInfo &&
        promptDetails
      ) {
        setIsLoading(false);
      }
      if (
        creditDialogInfo?.isPostAccessed === false &&
        creditDialogInfo &&
        promptDetails === null
      ) {
        setIsLoading(false);
      }
    }
  }, [creditDialogInfo, promptDetails]);

  return (
    <>
      {selectedPost ? (
        <div className=" relative h-fit w-[600px] p-5  bg-grey-800 flex flex-col ter rounded-xl gap-4 text-common-white cursor-default">
          <div className="w-full flex gap-5 justify-between">
            <div className="flex items-center gap-3 ">
              <div
                className="relative w-11 h-11 rounded-md overflow-hidden  bg-grey-600  cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation();
                  router.push(
                    redirectTouserProfile(
                      selectedPost.postedBy.userId,
                      user?.userId
                    )
                  );
                }}
              >
                <CustomImagePreview
                  image={
                    selectedPost.postedBy.profileImage
                      ? selectedPost.postedBy.profileImage
                      : appConstant.defaultProfileImage
                  }
                />
              </div>

              <div className="">
                <div className="flex items-center  ">
                  <p
                    className=" text-sm cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation();
                      router.push(
                        redirectTouserProfile(
                          selectedPost.postedBy.userId,
                          user?.userId
                        )
                      );
                    }}
                  >
                    {selectedPost.postedBy.userName}
                  </p>
                  {selectedPost.postedBy.userType === "VERIFIED" ? (
                    <div className="cursor-pointer text-blue-light scale-[0.6]">
                      <VerificationIcon />
                    </div>
                  ) : null}
                </div>
                {selectedPost.repostedBy === null &&
                selectedPost.generatedFrom === null ? null : (
                  <div
                    className="flex gap-1"
                    onClick={(e) => {
                      e.stopPropagation();
                    }}
                  >
                    {selectedPost.generatedFrom?.postId !== null &&
                    selectedPost.generatedFrom !== null ? (
                      <div className="stroke-2  text-grey-300  scale-75">
                        <SynchronizeIcon />
                      </div>
                    ) : null}

                    <div className="text-grey-300 text-2sm font-light">
                      {selectedPost.repostedBy !== null ? (
                        <>
                          Reposted by{" "}
                          <span
                            className="underline cursor-pointer"
                            onClick={(e) => {
                              e.stopPropagation();
                              if (
                                selectedPost.repostedBy &&
                                selectedPost.repostedBy.userId !== user?.userId
                              ) {
                                router.push(
                                  redirectTouserProfile(
                                    selectedPost.repostedBy.userId,
                                    user?.userId
                                  )
                                );
                              } else {
                                if (user)
                                  //to returen same profile
                                  router.push("/profile");
                              }
                            }}
                          >
                            {selectedPost.repostedBy.userName}
                          </span>
                        </>
                      ) : null}
                      {selectedPost.generatedFrom?.postId !== null &&
                      selectedPost.generatedFrom !== null ? (
                        <>
                          Recreated from <span className="underline">Here</span>
                        </>
                      ) : null}
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="flex flex-col items-end text-sm font-light">
              <IconDropDown
                position={{ vertical: "top", horizontal: "left" }}
                listItems={menuList}
                Icon={
                  <div className="scale-75 rotate-90 p-0">
                    <ThreeVerticalDots />
                  </div>
                }
                handleItemSelect={handleItemSelect}
              />
              <div className="text-grey-300 text-xs">
                {getRecentTimeFromTimeStamp(selectedPost.createdAt)}
              </div>
            </div>
          </div>
          {selectedPost.caption && selectedPost.caption.length > 0 ? (
            <p className=" text-2sm text-grey-100 font-extralight text-left w-full">
              {selectedPost.caption}
            </p>
          ) : null}
          {/* <p className=" text-sm font-light text-left w-full">
            {selectedPost.caption}
          </p> */}
          <div
            className={`grid grid-cols-6 w-[555px] h-[450px] grid-rows-4 gap-1 relative cursor-pointer`}
            onClick={(e) => handlePostClicked(e, selectedPost.postId)}
          >
            {selectedPost.image.map((postImage, index) => {
              if (index < 5) {
                return (
                  <div
                    key={index}
                    onClick={(e) => {
                      setSelectedImageIndex(index);
                    }}
                    className={`${
                      selectedPost.image.length === 1
                        ? "col-span-6 row-span-4"
                        : selectedPost.image.length === 2
                        ? "col-span-3 row-span-4"
                        : selectedPost.image.length === 3
                        ? index === 0
                          ? "col-span-3 row-span-4"
                          : "col-span-3 row-span-2"
                        : selectedPost.image.length === 4
                        ? "col-span-3 row-span-2"
                        : selectedPost.image.length === 5
                        ? index === 0 || index === 1
                          ? "col-span-3 row-span-2"
                          : "col-span-2 row-span-2"
                        : index === 0 || index === 1
                        ? "col-span-3 row-span-2"
                        : "col-span-2 row-span-2"
                    } `}
                  >
                    <div className="w-full h-full relative overflow-hidden">
                      {selectedPost.image.length > 5 && index === 4 ? (
                        <div className="absolute z-20 w-full h-full flex justify-center items-center text-4xl">
                          +{selectedPost.image.length - 5}
                        </div>
                      ) : null}

                      <div
                        className={`relative object-cover rounded-md overflow-hidden w-full h-full  ${
                          index === 4 && selectedPost.image.length > 5
                            ? "opacity-30"
                            : "opacity-100"
                        }`}
                      >
                        <div className="w-full h-full absolute left-0 top-0 flex justify-center items-center">
                          <Blurhash
                            hash={postImage.blurhash}
                            width="100%"
                            height="100%"
                          />
                        </div>
                        {!isNSFWVisible ? (
                          <CustomImagePreview
                            image={postImage.url}
                            className="object-cover object-center"
                          />
                        ) : null}
                      </div>
                    </div>
                  </div>
                );
              }
            })}
            {isNSFWVisible ? (
              <div className="bg-grey-300 w-full h-full cursor-default">
                <div className="w-full h-full absolute left-0 top-0 flex justify-center items-center">
                  <Blurhash
                    hash={selectedPost.image[0].blurhash}
                    width="100%"
                    height="100%"
                  />
                </div>
                <div className="w-full h-full flex flex-col justify-center items-center  absolute top-0 left-0 gap-2">
                  <div className=" scale-125 pb-3">
                    <VisibilityOffIcon />
                  </div>
                  <p className="text-sm">NSFW</p>
                  <p className=" text-center font-light text-xs text-common-white text-opacity-70 tracking-wider w-[40%]">
                    Sensitive content, viewer discretion advised.
                  </p>
                  <CustomButton
                    name="View"
                    className="w-fit text-xs bg-transparent-main border border-solid border-common-white opacity-75 px-2 py-1 mt-1 hover:bg-grey-500 hover:bg-opacity-70 hover:opacity-100 "
                    onClick={(e: React.MouseEvent<HTMLElement>) => {
                      e.stopPropagation();
                      dispatch(addViewedNSFWPost({ postId: postId }));
                      setIsNSFWVisible(!isNSFWVisible);
                    }}
                  />
                </div>
              </div>
            ) : null}
          </div>

          <div className="w-full flex justify-between items-center ">
            <p className="text-grey-300 text-2sm">
              {formatLargeNumber(selectedPost.counts.view)} Views
            </p>
            {isLoading && creditDialogInfo?.postId === selectedPost.postId ? (
              <div className=" text-common-white overflow-hidden pr-1">
                <CircularProgress
                  size={14}
                  className="text-common-white p-0 m-0"
                />
              </div>
            ) : null}
            {(selectedPost.isPromptAvailable &&
              creditDialogInfo?.postId !== selectedPost.postId) ||
            (!isLoading && creditDialogInfo) ? (
              <IconButton
                className={`scale-75 p-0 ${
                  selectedPost.userActivity.isAccessToViewPrompt
                    ? " text-success-main"
                    : "text-common-white"
                }`}
                onClick={(e) => {
                  e.stopPropagation();
                  setIsLoading(true);

                  setCreditDialogInfo({
                    userInfo: selectedPost.postedBy,
                    postId: selectedPost.postId,
                    isPostAccessed: selectedPost.userActivity
                      .isAccessToViewPrompt
                      ? true
                      : false,
                  });
                }}
              >
                <CommentQuestionIcon />
              </IconButton>
            ) : null}
          </div>
          <Divider
            sx={{
              marginTop: "-0.1rem",
              marginBottom: "-0.1rem",
              borderColor: theme.palette.grey[500],
            }}
          />

          <div className="w-full flex justify-between items-center text-grey-300">
            <div className="flex gap-5">
              <div className="flex  items-center gap-2">
                <div className="scale-90">
                  <Checkbox
                    sx={{ padding: 0 }}
                    onClick={(e) => {
                      e.stopPropagation();
                    }}
                    onChange={handleLikeChange}
                    icon={<FavoriteBorder className=" text-common-white" />}
                    checkedIcon={<Favorite color="error" />}
                    checked={
                      selectedPost.postId === recentInfo.postId
                        ? recentInfo.like.isLiked
                        : selectedPost.userActivity.isLiked
                    }
                  />
                </div>
                <p
                  className={`${
                    selectedPost.postId === recentInfo.postId
                      ? recentInfo.like.isLiked
                        ? "text-common-white"
                        : "text-grey-300"
                      : selectedPost.userActivity.isLiked
                      ? "text-common-white"
                      : "text-grey-300"
                  } w-6 text-2sm`}
                >
                  {formatLargeNumber(
                    selectedPost.postId === recentInfo.postId
                      ? recentInfo.like.count
                      : selectedPost.counts.like
                  )}
                </p>
              </div>
              <div className="flex gap-2 items-center">
                <div
                  className={`scale-75 ${
                    selectedPost.userActivity.isCommented
                      ? " text-blue-light"
                      : "text-common-white"
                  }`}
                >
                  <CommentMessageIcon />
                </div>
                <p
                  className={`${
                    selectedPost.userActivity.isCommented
                      ? "text-common-white"
                      : "text-grey-300"
                  } w-6 text-2sm`}
                >
                  {formatLargeNumber(selectedPost.counts.comment)}
                </p>
              </div>

              {selectedPost.postedBy.userId !== user?.userId ? (
                <div
                  className="flex gap-2 items-center cursor-pointer"
                  onClick={handleRepost}
                >
                  <div
                    className={`scale-[0.8] ${
                      selectedPost.postId === recentInfo.postId
                        ? recentInfo.repost.isReposted
                          ? " text-success-main"
                          : "text-common-white"
                        : selectedPost.userActivity.isReposted
                        ? " text-success-main"
                        : "text-common-white"
                    }`}
                  >
                    <SynchronizeIcon />
                  </div>
                  <p
                    className={`${
                      selectedPost.postId === recentInfo.postId
                        ? recentInfo.repost.isReposted
                          ? " text-common-white"
                          : "text-grey-300"
                        : selectedPost.userActivity.isReposted
                        ? " text-common-white"
                        : "text-grey-300"
                    } w-6 text-2sm`}
                  >
                    {formatLargeNumber(
                      selectedPost.postId === recentInfo.postId
                        ? recentInfo.repost.count
                        : selectedPost.counts.repost
                    )}
                  </p>
                </div>
              ) : null}
            </div>
            {selectedPost.allowGenerations ? (
              <div className="flex gap-2 items-center">
                <div className=" scale-75">
                  <AutomodeBlackIcon />
                </div>
                {/* <p className=" text-grey-300 text-2sm">
                  {formatLargeNumber(selectedPost.counts.recreation)}
                </p> */}
              </div>
            ) : null}
          </div>
        </div>
      ) : null}
    </>
  );
};

export default CirclePost;
