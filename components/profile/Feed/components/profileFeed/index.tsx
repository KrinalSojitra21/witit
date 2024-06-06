import React, { useEffect, useState } from "react";
import { Post, PromptDetail } from "@/types/post";
import { RootState } from "@/redux/store";
import { useDispatch, useSelector } from "react-redux";
import { useAuthContext } from "@/context/AuthContext";
import InfiniteScroll from "react-infinite-scroll-component";
import { CircularProgress } from "@mui/material";
import { deletePost } from "@/api/post/deletePost";
import { likePost } from "@/api/post/likePost";
import { doRepost } from "@/api/post/doRepost";
import { ReduxUser, UserBaseInfo } from "@/types/user";
import { getPromptOfPost } from "@/api/post/getPromptOfPost";
import { viewPost } from "@/api/post/viewPost";
import CirclePost from "@/components/circle/CirclePost";
import CirclePostInfoDialog from "@/components/circle/CirclePostInfoDialog";
import ViewPromptDrawer from "@/components/discover/ViewPromptDrawer";
import ConfirmationDialog from "@/components/shared/ConfirmationDialog";
import CreditViewPrompt from "@/components/shared/credit/CreditViewPrompt";
import Creadit from "@/components/shared/credit/Index";
import { getUserPosts } from "@/api/post/getUserPosts";
import {
  addUserPost,
  deleteUserPost,
  updateUserPostCommentCount,
  updateUserPostLikeStatus,
  updateUserPostRepostStatus,
  updateUserPostView,
  updateUserPostViewPrompt,
} from "@/redux/slices/userPostSlice";
import { getUser } from "@/api/user/getUser";
import { useRouter } from "next/router";
import ReportDialog from "@/components/shared/ReportDialog";
import { reportPost } from "@/api/post/reportPost";
import EditPostDialog from "@/components/shared/CustomEditPostDialog/index";
import EditGenerationPostPrompt from "@/components/shared/CustomEditPostFromGenetation/index";

type LikePostProps = { postId: string; isLiked: boolean; res?: Res };

type Res = {
  status: number;
  data: Post[];
  error: any;
};
type GetPostsProps = {
  lastDocId?: string;
  search?: string | null;
  res?: Res;
};

type Props = {
  selectedPostId: string | null;
  hasMorePost: boolean;
};
const ProfileFeed = ({ selectedPostId, hasMorePost }: Props) => {
  const dispatch = useDispatch();
  const { asPath } = useRouter();
  const router = useRouter();

  const { sendNotification } = useAuthContext();

  const userPosts = useSelector((state: RootState) => state.userPosts);
  const user = useSelector((state: RootState) => state.user);
  const viewedNsfwList = useSelector((state: RootState) => state.viewedNSFW);

  const [hasMoreFeed, setHasMoreFeed] = useState(hasMorePost);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [deletingPostIndex, setDeletingPostIndex] = useState<string | null>(
    null
  );
  const [isOpenEditPost, setIsOpenEditPost] = useState<boolean>(true);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [creditDialogInfo, setCreditDialogInfo] = useState<{
    userInfo: UserBaseInfo;
    postId: string;
    isPostAccessed: boolean;
  } | null>(null);
  const [promptDetails, setPromptDetails] = useState<PromptDetail | null>(null);
  const [reportingPostIndex, setReportingPostIndex] = useState<string | null>(
    null
  );
  const [currentUser, setCurrentUser] = useState<ReduxUser | null>(null);
  const [editPostValue, setEditPostValue] = useState<Post | null>(null);

  const getUserData = async () => {
    const userId = router.query.user;

    if (userId) {
      const res = await getUser(userId as string);
      if (res.status === 200) {
        setCurrentUser(res.data);
      } else {
        sendNotification({ type: "ERROR", message: res.error });
      }
    } else {
      setCurrentUser(user);
    }
  };

  useEffect(() => {
    getUserData();
  }, [asPath]);

  const handleLikePost = async ({ postId, isLiked }: LikePostProps) => {
    if (!user) return;
    const res = await likePost({
      user_id: user.userId,
      postId,
      isLiked,
    });

    if (!res) return;
    if (res.status === 200) {
      dispatch(updateUserPostLikeStatus({ postId }));
    } else {
      sendNotification({ type: "ERROR", message: res.error });
    }
  };

  const handleRepost = async (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
    postId: string,
    isReposted: boolean
  ) => {
    event.stopPropagation();
    if (!user) return;
    sendNotification({ type: "LOADING" });
    let res;
    if (isReposted) {
      res = await deletePost({
        user_id: user.userId,
        postId,
      });
    } else {
      res = await doRepost({
        user_id: user.userId,
        postId,
      });
    }
    if (!res) return;
    if (res.status === 200) {
      sendNotification({
        type: "SUCCESS",
        message: isReposted
          ? "Post Deleted Successfully"
          : "Reposted Successfully",
      });
      dispatch(updateUserPostRepostStatus({ postId }));
    } else {
      sendNotification({ type: "ERROR", message: res.error });
    }
  };

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    postId: string
  ) => {
    handleLikePost({
      postId: postId,
      isLiked: event.target.checked,
    });
  };

  const getuserPosts = async ({ lastDocId }: GetPostsProps) => {
    if (!user) return;

    const res = await getUserPosts({
      user_id: user.userId,
      limit: 20,
      ...(lastDocId && { lastDocId }),
    });
    setSimilarFeed({ res, lastDocId });
  };

  const setSimilarFeed = ({ lastDocId, res }: GetPostsProps) => {
    if (!res) return;

    if (res.status === 200) {
      if (res?.data.length < 20) {
        setHasMoreFeed(false);
      } else {
        setHasMoreFeed(true);
      }
      if (res.data.length > 0) {
        if (lastDocId) {
          dispatch(addUserPost([...userPosts, ...res.data]));
        } else {
          dispatch(addUserPost(res.data));
        }
      }
    } else {
      sendNotification({ type: "ERROR", message: res.error });
    }
  };

  const handleCommentCount = (postId: string) => {
    dispatch(updateUserPostCommentCount({ postId }));
  };

  const fetchMorePost = async () => {
    const lastDocId = userPosts[userPosts.length - 1]?.postId;
    getuserPosts({ lastDocId });
  };

  const handleDeletePostFromMenu = async (postId: string) => {
    if (!user) return;
    const selectedPost = userPosts.find((post) => post.postId === postId);
    if (!selectedPost) return;

    sendNotification({ type: "LOADING" });
    const res = await deletePost({
      user_id: user.userId,
      postId,
    });

    if (res.status === 200) {
      dispatch(deleteUserPost({ postId: selectedPost?.postId }));

      sendNotification({
        type: "SUCCESS",
        message: "Post Deleted Successfully",
      });
    } else {
      sendNotification({ type: "ERROR", message: res.error });
    }
    setHasMoreFeed(false);
  };

  const getPromptDetails = async () => {
    if (!user) return;
    if (!creditDialogInfo) return;
    const res = await getPromptOfPost({
      user_id: user.userId,
      postId: creditDialogInfo.postId,
    });

    if (res.status === 200) {
      setPromptDetails(res.data);
    } else {
      sendNotification({ type: "ERROR", message: res.error });
    }
  };

  const viewPostCount = async (postId: string) => {
    if (!user) return;
    const res = await viewPost({
      user_id: user.userId,
      postId,
    });
    if (res.status === 200) {
      dispatch(updateUserPostView({ postId }));
    } else {
      sendNotification({ type: "ERROR", message: res.error });
    }
  };

  const handlePostClicked = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
    postId: string
  ) => {
    event.stopPropagation();

    const clickedPost = userPosts.find((post) => post.postId === postId);
    if (clickedPost) {
      const isViewdPost = viewedNsfwList.includes(clickedPost.postId);
      if (!clickedPost.category.includes("NSFW")) {
        setSelectedPost(clickedPost);
      } else if (isViewdPost && clickedPost.category.includes("NSFW")) {
        setSelectedPost(clickedPost);
      }
    }
  };

  const submitReport = async (inputText: string) => {
    if (!user) return;
    if (!reportingPostIndex) return;

    const res = await reportPost({
      user_id: user.userId,
      data: { reportFor: inputText, postId: reportingPostIndex },
    });

    if (res.status === 200) {
      setReportingPostIndex(null);

      sendNotification({
        type: "SUCCESS",
        message: "Report Submitted Successfully",
      });
    } else {
      sendNotification({ type: "ERROR", message: res.error });
    }
  };

  useEffect(() => {
    if (userPosts)
      setSelectedPost((prev) => {
        const matchedPost = userPosts.find(
          (post) => post.postId === prev?.postId
        );
        return matchedPost ? matchedPost : null;
      });
  }, [userPosts]);

  useEffect(() => {
    if (creditDialogInfo?.isPostAccessed) {
      getPromptDetails();
    }
  }, [creditDialogInfo]);

  // get visible post on screen
  useEffect(() => {
    if (!userPosts) {
      return;
    }

    const options = {
      root: null,
      rootMargin: "0px",
      threshold: 1,
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          if (
            !userPosts.filter((post) => post.postId === entry.target.id)[0]
              .userActivity.isViewed
          ) {
            viewPostCount(entry.target.id);
          }
        }
      });
    }, options);

    document.querySelectorAll(".post-item").forEach((postElement) => {
      observer.observe(postElement);
    });

    return () => {
      observer.disconnect();
    };
  }, [userPosts]);

  useEffect(() => {
    //open perticular post invisible scrolling "auto"
    if (selectedPostId !== null) {
      const card = document.getElementById(selectedPostId);
      if (card != null) card.scrollIntoView({ behavior: "auto" });
    }
  }, [selectedPostId]);

  useEffect(() => {
    if (currentUser) {
      setDeletingPostIndex(null);
      setPromptDetails(null);
      setCreditDialogInfo(null);
    }
  }, [currentUser]);

  useEffect(() => {
    if (promptDetails) {
      setCreditDialogInfo(null);
      dispatch(
        updateUserPostViewPrompt({ postId: selectedPost?.postId || "" })
      );
    }
  }, [promptDetails]);

  const handleEdit = (selectedPost: Post) => {
    setIsOpenEditPost(true);
    if (selectedPost) {
      setEditPostValue(selectedPost);
    }
  };

  return (
    <div className="h-full w-full">
      {userPosts.length === 0 && !hasMoreFeed ? (
        <div className=" h-full w-full flex justify-center items-center">
          No Similar Post found
        </div>
      ) : (
        <div
          className={`relative w-full h-full flex flex-col  items-center ${
            selectedPost ? "overflow-hidden pr-1" : "overflow-auto"
          }  pl-6 py-4 gap-5 `}
          id="similarFeedScrollableDiv"
        >
          <InfiniteScroll
            dataLength={userPosts.length}
            next={fetchMorePost}
            hasMore={hasMoreFeed}
            loader={
              <div className="mt-4 text-common-white text-center w-full overflow-hidden">
                <CircularProgress size={20} className="text-common-white" />
              </div>
            }
            scrollableTarget="similarFeedScrollableDiv"
            style={hasMoreFeed ? {} : { overflow: "hidden" }}
          >
            <div className="relative flex flex-col gap-5">
              {userPosts.map((post, index) => {
                return (
                  <div key={post.postId} id={post.postId} className="post-item">
                    <CirclePost
                      handleEdit={handleEdit}
                      handleChange={(
                        event: React.ChangeEvent<HTMLInputElement>
                      ) => {
                        handleChange(event, post.postId);
                      }}
                      handleRepost={(
                        event: React.MouseEvent<HTMLDivElement, MouseEvent>
                      ) => {
                        handleRepost(
                          event,
                          post.postId,
                          post.userActivity.isReposted
                        );
                      }}
                      selectedPost={post}
                      setSelectedImageIndex={setSelectedImageIndex}
                      setDeletingPostIndex={setDeletingPostIndex}
                      setCreditDialogInfo={setCreditDialogInfo}
                      handlePostClicked={handlePostClicked}
                      promptDetails={promptDetails}
                      creditDialogInfo={creditDialogInfo}
                      setReportingPostIndex={setReportingPostIndex}
                    />
                  </div>
                );
              })}
            </div>
          </InfiniteScroll>
        </div>
      )}

      {selectedPost ? (
        <CirclePostInfoDialog
          handleEdit={handleEdit}
          handleCommentCount={handleCommentCount}
          handleChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            handleChange(event, selectedPost.postId);
          }}
          handleRepost={(
            event: React.MouseEvent<HTMLDivElement, MouseEvent>
          ) => {
            handleRepost(
              event,
              selectedPost.postId,
              selectedPost.userActivity.isReposted
            );
          }}
          selectedPost={selectedPost}
          selectedImageIndex={selectedImageIndex}
          setSelectedPost={setSelectedPost}
          setDeletingPostIndex={setDeletingPostIndex}
          setCreditDialogInfo={setCreditDialogInfo}
          promptDetails={promptDetails}
          creditDialogInfo={creditDialogInfo}
          setReportingPostIndex={setReportingPostIndex}
        />
      ) : null}
      {deletingPostIndex ? (
        <ConfirmationDialog
          isOpen={deletingPostIndex ? true : false}
          onCancel={() => {
            setDeletingPostIndex(null);
          }}
          onConform={() => {
            handleDeletePostFromMenu(deletingPostIndex);
            setDeletingPostIndex(null);
          }}
          title={{
            titleMain: "Delete Post?",
            title1: "Sure You Want to Delete This Offer From Your Account?",
            title2: " You will not be able to recover them again.",
            confirmButton: "Delete",
          }}
        />
      ) : null}
      {reportingPostIndex ? (
        <ReportDialog
          isOpen={reportingPostIndex ? true : false}
          title="Report"
          buttonName="Report"
          inputField={{
            limit: 10,
            tag: "Why is this inappropriate for Witit?",
            placeholder: "What seems to be the problem...",
          }}
          onConform={(inputText) => submitReport(inputText)}
          onCancel={() => {
            setReportingPostIndex(null);
          }}
        />
      ) : null}
      {creditDialogInfo && !creditDialogInfo.isPostAccessed ? (
        <Creadit
          creditDialogInfo={creditDialogInfo}
          setCreditDialogInfo={setCreditDialogInfo}
        >
          <CreditViewPrompt
            postedBy={creditDialogInfo}
            promptDetails={promptDetails}
            setPromptDetails={setPromptDetails}
          />
        </Creadit>
      ) : null}

      {promptDetails ? (
        <ViewPromptDrawer
          setPromptDetails={setPromptDetails}
          promptDetails={promptDetails}
        />
      ) : null}
      {editPostValue && editPostValue.generatedFrom && (
        <EditGenerationPostPrompt
          editedValue={editPostValue}
          isOpenEditPost={isOpenEditPost}
          setIsOpenEditPost={setIsOpenEditPost}
        />
      )}
      {editPostValue?.generatedFrom === null ? (
        <EditPostDialog
          editedValue={editPostValue}
          isOpenEditPost={isOpenEditPost}
          setIsOpenEditPost={setIsOpenEditPost}
        />
      ) : null}
    </div>
  );
};

export default ProfileFeed;
