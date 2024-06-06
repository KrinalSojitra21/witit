import CirclePost from "@/components/circle/CirclePost";
import CirclePostInfoDialog from "@/components/circle/CirclePostInfoDialog";
import { useAuthContext } from "@/context/AuthContext";
import Head from "next/head";
import CategorySelection from "@/components/shared/CategorySelection";
import { RootState } from "@/redux/store";
import { useDispatch, useSelector } from "react-redux";
import { useCallback, useEffect, useRef, useState } from "react";
import { Post, PromptDetail } from "@/types/post";
import { getCircleFeed } from "@/api/circle/getCircleFeed";
import {
  addCirclePost,
  deleteCirclePost,
  updateCircleCommentCount,
  updateCircleLikeStatus,
  updateCirclePostView,
  updateCirclePostViewPrompt,
  updateCircleRepostStatus,
} from "@/redux/slices/circleFeedSlice";
import InfiniteScroll from "react-infinite-scroll-component";
import { CircularProgress } from "@mui/material";
import { likePost } from "@/api/post/likePost";
import { deletePost } from "@/api/post/deletePost";
import { doRepost } from "@/api/post/doRepost";
import ConfirmationDialog from "@/components/shared/ConfirmationDialog";
import { UserBaseInfo } from "@/types/user";
import Creadit from "@/components/shared/credit/Index";
import CreditViewPrompt from "@/components/shared/credit/CreditViewPrompt";
import ViewPromptDrawer from "@/components/discover/ViewPromptDrawer";
import { getPromptOfPost } from "@/api/post/getPromptOfPost";
import { viewPost } from "@/api/post/viewPost";
import ReportDialog from "@/components/shared/ReportDialog";
import { reportUser } from "@/api/user/reportUser";
import { reportPost } from "@/api/post/reportPost";
import EditPostDialog from "@/components/shared/CustomEditPostDialog/index";
import EditGenerationPostPrompt from "@/components/shared/CustomEditPostFromGenetation/index";

type Res = {
  status: number;
  data: Post[];
  error: any;
};

type GetCircleProps = {
  rank?: number;
  lastDocId?: string;
  res?: Res;
};

type LikePostProps = { postId: string; isLiked: boolean; res?: Res };

const Circle = () => {
  const { sendNotification } = useAuthContext();
  const dispatch = useDispatch();
  const circleScrollableDivRef = useRef(null);

  const user = useSelector((state: RootState) => state.user);
  const circlePosts = useSelector((state: RootState) => state.circlePosts);
  const viewedNsfwList = useSelector((state: RootState) => state.viewedNSFW);
  const [isOpenEditPost, setIsOpenEditPost] = useState(false);
  const [hasMoreFeed, setHasMoreFeed] = useState(true);
  const [category, setCategory] = useState<string[]>();
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [editedValue, setEditedValue] = useState<Post | null>(null);
  const [deletingPostIndex, setDeletingPostIndex] = useState<string | null>(
    null
  );
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [isFetched, setIsFetched] = useState(false);
  const [creditDialogInfo, setCreditDialogInfo] = useState<{
    userInfo: UserBaseInfo;
    postId: string;
    isPostAccessed: boolean;
  } | null>(null);
  const [promptDetails, setPromptDetails] = useState<PromptDetail | null>(null);
  const [reportingPostIndex, setReportingPostIndex] = useState<string | null>(
    null
  );

  const handleLikePost = async ({ postId, isLiked }: LikePostProps) => {
    if (!user) return;
    const res = await likePost({
      user_id: user.userId,
      postId,
      isLiked,
    });

    if (!res) return;
    if (res.status === 200) {
      dispatch(updateCircleLikeStatus({ postId }));
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
      dispatch(updateCircleRepostStatus({ postId }));
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

  const getFeed = async ({ lastDocId, rank }: GetCircleProps) => {
    if (!user) return;
    const res = await getCircleFeed({
      user_id: user.userId,
      limit: 20,
      ...(lastDocId && { lastDocId }),
      ...(category && { category }),
      ...(rank && { rank }),
    });
    setIsFetched(true);
    setFeed({ res, lastDocId });
  };

  const viewPostCount = async (postId: string) => {
    if (!user) return;
    const res = await viewPost({
      user_id: user.userId,
      postId,
    });
    if (res.status === 200) {
      dispatch(updateCirclePostView({ postId }));
    } else {
      sendNotification({ type: "ERROR", message: res.error });
    }
  };

  const setFeed = ({ lastDocId, res }: GetCircleProps) => {
    if (!res) return;

    if (res.status === 200) {
      if (res?.data.length < 20) {
        setHasMoreFeed(false);
      } else {
        setHasMoreFeed(true);
      }
      if (res.data.length > 0) {
        if (lastDocId) {
          dispatch(addCirclePost([...circlePosts, ...res.data]));
        } else {
          dispatch(addCirclePost(res.data));
        }
      }
    } else {
      sendNotification({ type: "ERROR", message: res.error });
    }
  };

  const handleCommentCount = (postId: string) => {
    dispatch(updateCircleCommentCount({ postId }));
  };

  const fetchMorePost = async () => {
    const lastPost = circlePosts[circlePosts.length - 1];
    const lastDocId = lastPost?.postId;
    const rank = lastPost?.rank;

    getFeed({ lastDocId, rank });
    setIsFetched(false);
  };

  const handleCategoryFilter = (list: string[]) => {
    setIsFetched(false);
    if (list.length > 0) setCategory(list);
    else setCategory(undefined);
  };

  const handleDeletePostFromMenu = async (postId: string) => {
    if (!user) return;
    const selectedPost = circlePosts.find((post) => post.postId === postId);
    if (!selectedPost) return;

    sendNotification({ type: "LOADING" });
    const res = await deletePost({
      user_id: user.userId,
      postId,
    });

    if (!res) return;
    if (res.status === 200) {
      dispatch(deleteCirclePost({ postId: selectedPost?.postId }));

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
      dispatch(
        updateCirclePostViewPrompt({ postId: selectedPost?.postId || "" })
      );
    } else {
      sendNotification({ type: "ERROR", message: res.error });
    }
  };

  const handlePostClicked = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
    postId: string
  ) => {
    event.stopPropagation();

    const clickedPost = circlePosts.find((post) => post.postId === postId);
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
    dispatch(addCirclePost([]));
    getFeed({});
  }, [category]);

  useEffect(() => {
    if (circlePosts)
      setSelectedPost((prev) => {
        const matchedPost = circlePosts.find(
          (post) => post.postId === prev?.postId
        );
        return matchedPost ? matchedPost : null;
      });
  }, [circlePosts]);

  useEffect(() => {
    if (creditDialogInfo?.isPostAccessed) {
      getPromptDetails();
    }
  }, [creditDialogInfo]);

  useEffect(() => {
    if (promptDetails) {
      setCreditDialogInfo(null);
    }
  }, [promptDetails]);

  // get visible post on screen
  useEffect(() => {
    if (!circlePosts) {
      return;
    }

    const options = {
      root: null,
      rootMargin: "0px",
      threshold: 1,
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        // dispatch(removetempAll());

        if (entry.isIntersecting) {
          if (
            !circlePosts.filter((post) => post.postId === entry.target.id)[0]
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
  }, [circlePosts]);

  const handleEdit = (selectedPost: Post) => {
    setEditedValue(selectedPost);
    setIsOpenEditPost(true);
  };
  return (
    <>
      <Head>
        <title>Witit - Circle</title>
      </Head>

      <div
        className={`w-full h-full relative ${
          promptDetails ? " overflow-hidden  " : "overflow-auto  "
        } flex-grow  flex pl-6 py-4`}
      >
        <CategorySelection sendSelectedCategoryList={handleCategoryFilter} />
        {circlePosts.length === 0 && isFetched ? (
          <div className="  w-full h-full flex justify-center items-center">
            no post found Here
          </div>
        ) : (
          <div
            className=" h-full  flex-grow flex flex-col items-center gap-2 overflow-auto"
            id="circleScrollableDiv"
          >
            <InfiniteScroll
              dataLength={circlePosts.length}
              next={fetchMorePost}
              hasMore={hasMoreFeed}
              loader={
                <div className="mt-4 text-common-white text-center w-full overflow-hidden">
                  <CircularProgress size={20} className="text-common-white" />
                </div>
              }
              scrollableTarget="circleScrollableDiv"
              style={hasMoreFeed ? {} : { overflow: "hidden" }}
            >
              <div ref={circleScrollableDivRef} className="gap-5 flex flex-col">
                {circlePosts.map((post, index) => {
                  return (
                    <div
                      key={post.postId}
                      id={post.postId}
                      className=" post-item"
                    >
                      <CirclePost
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
                        handleEdit={handleEdit}
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
            handleEdit={handleEdit}
            setDeletingPostIndex={setDeletingPostIndex}
            setCreditDialogInfo={setCreditDialogInfo}
            creditDialogInfo={creditDialogInfo}
            promptDetails={promptDetails}
            setReportingPostIndex={setReportingPostIndex}
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
        {isOpenEditPost && !editedValue?.generatedFrom && (
          <EditPostDialog
            editedValue={editedValue}
            isOpenEditPost={isOpenEditPost}
            setIsOpenEditPost={setIsOpenEditPost}
          />
        )}
        {editedValue?.generatedFrom && isOpenEditPost && (
          <EditGenerationPostPrompt
            editedValue={editedValue}
            isOpenEditPost={isOpenEditPost}
            setIsOpenEditPost={setIsOpenEditPost}
          />
        )}
      </div>
    </>
  );
};

export default Circle;
