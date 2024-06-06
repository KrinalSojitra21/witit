import React, { useEffect, useRef, useState } from "react";
import VerificationIcon from "@/utils/icons/circle/VerifiedIcon";
import CommentQuestionIcon from "@/utils/icons/shared/CommentQuestionIcon";
import CommentMessageIcon from "@/utils/icons/shared/CommentMessageIcon";
import AutomodeBlackIcon from "@/utils/icons/shared/AutomodeBlackIcon";
import { Checkbox, CircularProgress, Divider, IconButton } from "@mui/material";
import CustomInputTextField from "@/components/shared/CustomInputTextField";
import SendIcon from "@/utils/icons/circle/SendIcon";
import { theme } from "@/theme";
import CustomDialog from "@/components/shared/dialog/CustomDialog";
import SynchronizeIcon from "@/utils/icons/circle/SynchronizeIcon";
import Slider from "react-slick";
import { Favorite, FavoriteBorder } from "@mui/icons-material";
import { DropDownItem } from "@/types";
import OutLinedAlertIcon from "@/utils/icons/shared/OutLinedAlertIcon";
import ShareIcon from "@/utils/icons/shared/ShareIcon";
import { useAuthContext } from "@/context/AuthContext";
import { IconDropDown } from "@/components/shared/dropDown/IconDropDown";
import { Post, PostComment, PromptDetail } from "@/types/post";
import { getRecentTimeFromTimeStamp } from "@/service/shared/getRecentTimeFromTimeStamp";
import ThreeVerticalDots from "@/utils/icons/circle/ThreeVerticalDots";
import { getComments } from "@/api/post/getComments";
import { RootState } from "@/redux/store";
import { useDispatch, useSelector } from "react-redux";
import OtherUserCommentItem from "./components/OtherUserCommentItem";
import CurrentUserCommentItem from "./components/CurrentUserCommentItem";
import appConstant from "@/utils/constants/withoutHtml/appConstant";
import { postComment } from "@/api/post/postComment";
import InfiniteScroll from "react-infinite-scroll-component";
import { formatLargeNumber } from "@/service/shared/formatLargeNumber";
import { CustomImagePreview } from "@/components/shared/CustomImagePreview";
import DeleteIcon from "@/utils/icons/shared/DeleteIcon";
import { UserBaseInfo } from "@/types/user";
import { useRouter } from "next/router";
import LinkCopyIcon from "@/utils/icons/shared/LinkCopyIcon";
import EditIcon from "@/utils/icons/shared/EditIcon";
import { redirectTouserProfile } from "@/service/shared/redirectTouserProfile";
import { NoDataFound } from "@/components/shared/NoDataFound";
import { noCommentFound } from "@/utils/images";
import { useDebounceEffect } from "@/hooks/useDebounceEffect";
import getAllFriends from "@/api/cricle/getAllFriends";
import { FriendsList } from "@/types/circle";
import FriendInfoItem from "./components/FriendInfoItem";
import OutsideClickHandler from "react-outside-click-handler";

type Res = {
  status: number;
  data: PostComment[];
  error: any;
};
type GetCommentsProps = {
  lastDocId?: string;
  res?: Res;
  postId?: string;
};
type PostCommentRes = {
  status: number;
  data: PostComment;
  error: any;
};

type Props = {
  selectedPost: Post;
  selectedImageIndex?: number;
  handleEdit?: (selectedPost: Post) => void;
  setSelectedPost: React.Dispatch<React.SetStateAction<Post | null>>;
  setDeletingPostIndex: React.Dispatch<React.SetStateAction<string | null>>;
  setReportingPostIndex: React.Dispatch<React.SetStateAction<string | null>>;
  handleChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleRepost: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
  handleCommentCount: (postId: string) => void;
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

const CirclePostInfoDialog = ({
  selectedPost,
  selectedImageIndex,
  setSelectedPost,
  setDeletingPostIndex,
  handleChange,
  handleRepost,
  handleEdit,
  handleCommentCount,
  setCreditDialogInfo,
  setReportingPostIndex,
  promptDetails,
  creditDialogInfo,
}: Props) => {
  const router = useRouter();

  const user = useSelector((state: RootState) => state.user);

  const { sendNotification } = useAuthContext();
  const ref = useRef<HTMLDivElement | null>(null);

  const [menuList, setmenuList] = useState<DropDownItem[]>([]);
  const [currentslide, setCurrentslide] = useState(1);
  const [comments, setComments] = useState<PostComment[]>([]);
  const [hasMoreComments, setHasMoreComments] = useState(true);
  const [hasMoreFriends, setHasMoreFriends] = useState(true);
  const [friendsList, setFriendsList] = useState<FriendsList[]>([]);

  const [inputComment, setInputComment] = useState("");
  const [lastWord, setLastWord] = useState<{
    word: string | null;
    tagged: boolean;
  } | null>({ word: null, tagged: false });

  const [isCommentButtonEnabled, setIsCommentButtonEnabled] = useState(true);
  const [isCommentsFetched, setIsCommentsFetched] = useState(false);
  const [recentInfo, setRecentInfo] = useState<{
    like: { isLiked: boolean; count: number };
    postId: string;
    repost: { isReposted: boolean; count: number };
  }>({
    like: {
      isLiked: selectedPost.userActivity.isLiked,
      count: selectedPost.counts.like,
    },
    postId: selectedPost.postId,
    repost: {
      isReposted: selectedPost.userActivity.isReposted,
      count: selectedPost.counts.repost,
    },
  });
  const [isLoading, setIsLoading] = useState(false);

  var sliderSettings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    afterChange: (currentSlide: number) => {
      setCurrentslide(currentSlide + 1); // +1 since slide indexing starts from 0
    },

    prevArrow: (
      <div className="">
        <svg
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            opacity="0.8"
            fillRule="evenodd"
            clipRule="evenodd"
            d="M10 0C4.47715 0 0 4.47715 0 10C0 15.5228 4.47715 20 10 20C15.5228 20 20 15.5228 20 10C20 4.47715 15.5228 0 10 0ZM11.7071 6.70711C12.0976 6.31658 12.0976 5.68342 11.7071 5.29289C11.3166 4.90237 10.6834 4.90237 10.2929 5.29289L7 8.58579C6.21895 9.36684 6.21895 10.6332 7 11.4142L10.2929 14.7071C10.6834 15.0976 11.3166 15.0976 11.7071 14.7071C12.0976 14.3166 12.0976 13.6834 11.7071 13.2929L8.41421 10L11.7071 6.70711Z"
            fill="#ffffffcc"
          />
        </svg>
      </div>
    ),
    nextArrow: (
      <div>
        <svg
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            opacity="0.8"
            fillRule="evenodd"
            clipRule="evenodd"
            d="M10 20C15.5228 20 20 15.5228 20 10C20 4.47715 15.5228 0 10 0C4.47715 0 0 4.47715 0 10C0 15.5228 4.47715 20 10 20ZM8.29289 13.2929C7.90237 13.6834 7.90237 14.3166 8.29289 14.7071C8.68342 15.0976 9.31658 15.0976 9.70711 14.7071L13 11.4142C13.7811 10.6332 13.781 9.36683 13 8.58579L9.70711 5.29289C9.31658 4.90237 8.68342 4.90237 8.29289 5.29289C7.90237 5.68342 7.90237 6.31658 8.29289 6.70711L11.5858 10L8.29289 13.2929Z"
            fill="#ffffffcc"
          />
        </svg>
      </div>
    ),
  };

  const handleLikeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRecentInfo((prev) => {
      return {
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

  const fetchComments = async ({ postId, lastDocId }: GetCommentsProps) => {
    if (!user) return;
    const res = await getComments({
      user_id: user.userId,
      limit: 20,
      ...(lastDocId && { lastDocId }),
      ...(postId && { postId }),
    });

    setIsCommentsFetched(true);
    saveComments({ res, lastDocId });
  };

  const saveComments = ({ lastDocId, res }: GetCommentsProps) => {
    if (!res) return;
    if (res.status === 200) {
      if (res?.data.length < 20) {
        setHasMoreComments(false);
      } else {
        setHasMoreComments(true);
      }
      if (res.data.length > 0) {
        setComments((prev) => {
          if (lastDocId) {
            return prev.concat(res.data);
          } else {
            return res.data;
          }
        });
      }
    } else {
      sendNotification({ type: "ERROR", message: res.error });
    }
  };

  const fetchMoreComments = async () => {
    const lastDocId = comments[comments.length - 1]?.commentId;
    fetchComments({ lastDocId, postId: selectedPost?.postId });
    setIsCommentsFetched(false);
  };

  const sendComment = async () => {
    if (!user) return;

    if (isCommentButtonEnabled) {
      const res = await postComment({
        user_id: user.userId,
        postId: selectedPost?.postId,
        comment: inputComment,
      });
      if (res.status === 200) {
        setInputComment("");
        fetchComments({ postId: selectedPost?.postId });
        increaseCommentsTotal();
      } else {
        sendNotification({ type: "ERROR", message: res.error });
      }
    }
  };

  const increaseCommentsTotal = () => {
    if (selectedPost) handleCommentCount(selectedPost.postId);
  };

  const handleItemSelect = (type: string) => {
    if (selectedPost) {
      if (type === "DELETE") {
        setDeletingPostIndex(selectedPost.postId);
      }
      if (type === "EDIT") {
        if (handleEdit) {
          handleEdit(selectedPost);
        }
      }
      if (type === "COPY") {
        handleCopyLink();
      }
      if (type === "REPORT") {
        setReportingPostIndex(selectedPost.postId);
      }
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(
      window.location.protocol +
        "//" +
        window.location.host +
        `/discover/post?postId=${selectedPost.postId}`
    );
    sendNotification({ type: "SUCCESS", message: "Post Coppied!!" });
  };

  const getFriendsList = async (searchScore?: number, lastDocId?: string) => {
    if (!lastWord?.word) return;
    const response = await getAllFriends({
      user_id: user?.userId,
      search: lastWord.word,
      searchScore: searchScore,
      lastDocId: lastDocId,
      limit: 20,
    });

    if (response.status === 200 && response.data) {
      if (response.data.friends.length < 20) {
        setHasMoreFriends(false);
      } else {
        setHasMoreFriends(true);
      }

      setFriendsList((prevFriends) => [
        ...prevFriends,
        ...(response.data?.friends || []),
      ]);
      return;
    }

    sendNotification({ type: "ERROR", message: response.error });
  };

  const fetchMoreFriends = async () => {
    const searchScore = friendsList[friendsList.length - 1].searchScore;
    const lastDocId = friendsList[friendsList.length - 1].userId;
    getFriendsList(searchScore, lastDocId);
  };

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
    if (selectedPost && selectedPost.counts.comment != 0) {
      fetchComments({ postId: selectedPost.postId });
    }

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
    if (inputComment.includes("@") && inputComment.length === 1) {
      setFriendsList([]);
      setHasMoreFriends(true);
      setLastWord({ word: null, tagged: false });
    }
    if (inputComment.length > 2) setIsCommentButtonEnabled(true);
    const words = inputComment.split(" ");
    const word = words[words.length - 1];

    if (word.includes("@") && word.length > 2) {
      const lastWordWithoutAt = word.replace("@", "");

      if (!lastWord?.tagged) {
        setLastWord({ word: lastWordWithoutAt, tagged: false });
      } else {
        setLastWord({ word: null, tagged: false });
      }
    } else {
      setLastWord({ word: null, tagged: false });
    }
  }, [inputComment]);

  useEffect(() => {
    if (lastWord) {
      getFriendsList();
    } else {
      setFriendsList([]);
      setHasMoreFriends(true);
      setLastWord({ word: null, tagged: false });
    }
  }, [lastWord]);

  useEffect(() => {
    if (selectedImageIndex) setCurrentslide(selectedImageIndex + 1);
  }, [selectedImageIndex]);

  useEffect(() => {
    setIsLoading(false);
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

  // useEffect(() => {
  //   if (debouncedComment.includes("@") && debouncedComment.length > 2) {
  //     getFriendsList();
  //   } else {
  //     setFriendsList([]);
  //   }
  // }, [debouncedComment]);

  return (
    <>
      {selectedPost ? (
        <CustomDialog
          className="h-auto  w-[900px]"
          isOpen={selectedPost.postId ? true : false}
          onCancel={() => {
            setSelectedPost(null);
          }}
        >
          <div className="h-full  w-full  flex flex-col items-center gap-4 py-5  pl-5">
            <div className="w-full flex gap-4 pr-5 justify-between">
              <div className="flex items-center gap-3">
                <div
                  className="relative  w-11 h-11 rounded-md overflow-hidden bg-grey-600 cursor-pointer"
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
                  <div className="flex items-center gap-1   ">
                    <p
                      className="text-sm cursor-pointer"
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
                      <div className="cursor-pointer  text-blue-light scale-[0.6] ">
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
                                  selectedPost.repostedBy.userId !==
                                    user?.userId
                                ) {
                                  router.push(
                                    redirectTouserProfile(
                                      selectedPost.repostedBy.userId,
                                      user?.userId
                                    )
                                  );
                                } else {
                                  if (user) router.push("/profile");
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
                            Recreated from{" "}
                            <span className="underline">Here</span>
                          </>
                        ) : null}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex flex-col items-end text-sm font-light">
                <IconDropDown
                  position={{ vertical: "top", horizontal: "right" }}
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
              <p className=" text-2sm tracking-wide  text-grey-100 font-extralight w-full text-left">
                {selectedPost.caption}
              </p>
            ) : null}

            <div className=" flex-grow h-[552px]  w-full flex overflow-hidden gap-7">
              <div className="flex flex-col gap-5 justify-between ">
                <div className=" relative  max-w-[350px] w-full  h-[445px]   overflow-hidden">
                  <Slider
                    initialSlide={selectedImageIndex}
                    ref={(slider) => (slider = slider)}
                    {...sliderSettings}
                    className=" slick_slider_arrow w-[342px] h-[445px]  flex flex-row justify-start items-center  rounded-md overflow-hidden"
                  >
                    {selectedPost.image.map((postImage, index) => {
                      return (
                        <div
                          key={index}
                          className="flex justify-center w-full h-full relative  overflow-hidden"
                        >
                          <CustomImagePreview
                            image={postImage.url}
                            className="relative w-full h-full object-cover "
                          />
                        </div>
                      );
                    })}
                  </Slider>

                  {selectedPost.image.length > 1 ? (
                    <p className=" absolute top-2 right-2 text-[0.6rem] text-common-white bg-secondary-light py-1 px-2 rounded-md">
                      {currentslide} of {selectedPost.image.length}
                    </p>
                  ) : null}
                </div>
                <div className="flex flex-col gap-4">
                  <div className="w-full flex justify-between items-center   ">
                    <p className="text-grey-300 text-2sm">
                      {formatLargeNumber(selectedPost.counts.view)} Views
                    </p>

                    {isLoading ? (
                      <div className=" text-common-white overflow-hidden pr-1">
                        <CircularProgress
                          size={14}
                          className="text-common-white p-0 m-0"
                        />
                      </div>
                    ) : null}
                    {selectedPost.isPromptAvailable && !isLoading ? (
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
                          // setCustomDialogType("CREDITS-VIEWPROMPT");
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
                  <div className="w-full flex justify-between ">
                    <div className="flex gap-5">
                      <div className="flex items-center  gap-2 ">
                        <div className="scale-90">
                          <Checkbox
                            sx={{ padding: 0 }}
                            onClick={(e) => {
                              e.stopPropagation();
                            }}
                            onChange={handleLikeChange}
                            icon={
                              <FavoriteBorder className=" text-common-white" />
                            }
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
                      <div className="flex items-center gap-2">
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
                    </div>{" "}
                    {selectedPost.allowGenerations ? (
                      <div className="flex items-center gap-2 stroke-2">
                        <div className=" scale-75">
                          <AutomodeBlackIcon />
                        </div>
                        {/* <p className="text-grey-300 text-2sm">
                          {formatLargeNumber(selectedPost.counts.recreation)}
                        </p> */}
                      </div>
                    ) : null}
                  </div>
                </div>
              </div>
              <div className=" w-full flex-grow overflow-hidden flex flex-col ">
                <div className=" flex flex-col gap-3 pr-5">
                  <div className="flex items-center gap-1">
                    <p className=" text-sm font-light text-left">Comments</p>
                    <p className=" text-grey-300 text-xs font-light">
                      ({formatLargeNumber(selectedPost.counts.comment)})
                    </p>
                  </div>
                  <Divider
                    sx={{
                      borderColor: theme.palette.grey[500],
                    }}
                  />
                </div>
                <div className="flex-grow overflow-hidden flex flex-col gap-5 ">
                  <div className="flex-grow overflow-hidden justify-end flex flex-col ">
                    {selectedPost.counts.comment === 0 ||
                    (comments.length === 0 && isCommentsFetched) ? (
                      <div className="  w-full h-full flex justify-center items-center">
                        {/* change size of nocommentfound image */}
                        <NoDataFound
                          image={
                            <div className="relative w-24 h-24 ">
                              <CustomImagePreview image={noCommentFound} />
                            </div>
                          }
                          title="No Comments Yet"
                          description="Begin the conversation.."
                        />
                      </div>
                    ) : (
                      <div
                        className="h-full overflow-auto flex pr-5 pt-5  flex-col-reverse "
                        id="commentsScrollableDiv"
                        ref={ref}
                      >
                        <InfiniteScroll
                          inverse={true}
                          dataLength={comments.length}
                          next={fetchMoreComments}
                          hasMore={hasMoreComments}
                          loader={
                            <div className="pt-4 text-common-black text-center w-full  overflow-hidden">
                              <CircularProgress
                                size={20}
                                className="text-common-white"
                              />
                            </div>
                          }
                          style={{
                            display: "flex",
                            flexDirection: "column-reverse",
                            gap: "1.25rem",
                          }}
                          scrollableTarget="commentsScrollableDiv"
                        >
                          {comments.map((comment, index) => {
                            return (
                              <div key={index}>
                                {comment.commenter.userId === user?.userId ? (
                                  <CurrentUserCommentItem comment={comment} />
                                ) : (
                                  <OtherUserCommentItem comment={comment} />
                                )}
                              </div>
                            );
                          })}
                        </InfiniteScroll>
                      </div>
                    )}
                  </div>
                  <div className=" pr-5 relative">
                    {lastWord?.word ? (
                      <div className="w-full absolute bottom-[100%] pr-5 ">
                        <OutsideClickHandler
                          onOutsideClick={() => {
                            setFriendsList([]);
                            setLastWord({ word: null, tagged: false });
                            setHasMoreFriends(true);
                          }}
                        >
                          {" "}
                          <div
                            className="bg-grey-700  rounded-t-md p-5 max-h-[200px] overflow-auto"
                            id="friendListScrollableDiv"
                          >
                            {friendsList.length === 0 && !hasMoreFriends ? (
                              <NoDataFound description="No Friends Found" />
                            ) : (
                              <div className=" h-full  flex-grow flex flex-col gap-2">
                                <InfiniteScroll
                                  dataLength={friendsList.length}
                                  next={fetchMoreFriends}
                                  hasMore={hasMoreFriends}
                                  loader={
                                    <div className="mt-4 text-common-white text-center w-full overflow-hidden">
                                      <CircularProgress
                                        size={20}
                                        className="text-common-white"
                                      />
                                    </div>
                                  }
                                  scrollableTarget="friendListScrollableDiv"
                                  style={
                                    hasMoreFriends ? {} : { overflow: "hidden" }
                                  }
                                >
                                  <div className="gap-5 flex flex-col">
                                    {friendsList.map((friend, index) => (
                                      <div
                                        key={index}
                                        className="cursor-pointer"
                                        onClick={() => {
                                          const segments =
                                            inputComment.split("@");
                                          const lastSegment =
                                            segments[segments.length - 1];
                                          const newComment =
                                            inputComment.replace(
                                              `@${lastSegment}`,
                                              `@${friend.userName}`
                                            );
                                          setInputComment(newComment);
                                          setFriendsList([]);
                                          setLastWord({
                                            word: null,
                                            tagged: false,
                                          });
                                          setHasMoreFriends(true);
                                          setLastWord((prev) => {
                                            if (!prev) return null;
                                            return { ...prev, tagged: true };
                                          });
                                          // setHasMoreFriends(true);
                                        }}
                                      >
                                        <FriendInfoItem friendInfo={friend} />
                                      </div>
                                    ))}
                                  </div>
                                </InfiniteScroll>
                              </div>
                            )}
                          </div>
                        </OutsideClickHandler>
                      </div>
                    ) : null}

                    <CustomInputTextField
                      multiline
                      maxRows={3}
                      value={inputComment}
                      placeholder="Write Your Comment"
                      EndIcon={
                        <div
                          className={`${
                            inputComment.length > 2
                              ? "text-primary-main"
                              : "text-grey-300 cursor-default"
                          }`}
                        >
                          <SendIcon />
                        </div>
                      }
                      EndIconStyle=" cursor-pointer text-grey-100"
                      className={` border-none  ${
                        lastWord?.word ? "rounded-t-none " : ""
                      } `}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        setInputComment(e.target.value);
                      }}
                      EndIconHandleEvent={() => {
                        if (inputComment.length > 2) {
                          sendComment();
                          setIsCommentButtonEnabled(false);
                        }
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CustomDialog>
      ) : null}
    </>
  );
};

export default CirclePostInfoDialog;
