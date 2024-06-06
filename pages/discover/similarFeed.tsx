import React, { useEffect, useRef, useState } from "react";
import CirclePost from "../../components/circle/CirclePost";
import { DiscoverPost, Post, PromptDetail } from "@/types/post";
import { getSimilerFeed } from "@/api/discover/getSimilerFeed";
import {
  addDiscoverPost,
  deleteDiscoverPost,
} from "@/redux/slices/discoverFeedSlice";
import { RootState } from "@/redux/store";
import { useDispatch, useSelector } from "react-redux";
import { useAuthContext } from "@/context/AuthContext";
import {
  addSimilarDiscoverPost,
  deleteSimilarDiscoverPost,
  updateSimilarDiscoverCommentCount,
  updateSimilarDiscoverLikeStatus,
  updateSimilarDiscoverPostView,
  updateSimilarDiscoverPostViewPrompt,
  updateSimilarDiscoverRepostStatus,
} from "@/redux/slices/discoverSimilarFeedSlice";
import InfiniteScroll from "react-infinite-scroll-component";
import { CircularProgress } from "@mui/material";
import CirclePostInfoDialog from "../../components/circle/CirclePostInfoDialog";
import ConfirmationDialog from "../../components/shared/ConfirmationDialog";
import { deletePost } from "@/api/post/deletePost";
import { likePost } from "@/api/post/likePost";
import { doRepost } from "@/api/post/doRepost";
import Creadit from "../../components/shared/credit/Index";
import CreditViewPrompt from "../../components/shared/credit/CreditViewPrompt";
import { UserBaseInfo } from "@/types/user";
import ViewPromptDrawer from "../../components/discover/ViewPromptDrawer";
import { getPromptOfPost } from "@/api/post/getPromptOfPost";
import { viewPost } from "@/api/post/viewPost";
import { useRouter } from "next/router";
import ReportDialog from "@/components/shared/ReportDialog";
import { reportPost } from "@/api/post/reportPost";
import EditPostDialog from "@/components/shared/CustomEditPostDialog/index";
import EditGenerationPostPrompt from "@/components/shared/CustomEditPostFromGenetation/index";

type LikePostProps = { postId: string; isLiked: boolean; res?: Res };

type Res = {
  status: number;
  data: DiscoverPost[];
  error: any;
};
type GetDiscoverProps = {
  lastDocId?: string;
  search?: string | null;
  res?: Res;
  postId: string;
  description?: string | null;
  searchScore?: number;
};
const SimilarFeed = () => {
  const dispatch = useDispatch();
  const { asPath, push, pathname } = useRouter();
  const similarFeedScrollableDivRef = useRef(null);
  const currentPath = useRef(asPath);
  const router = useRouter();

  const user = useSelector((state: RootState) => state.user);
  const viewedNsfwList = useSelector((state: RootState) => state.viewedNSFW);
  const similarPosts = useSelector(
    (state: RootState) => state.discoverSimilarPosts
  );
  const discoverPosts = useSelector((state: RootState) => state.discoverPosts);

  const { sendNotification, setCustomDialogType, customDialogType } =
    useAuthContext();
  const [hasMoreFeed, setHasMoreFeed] = useState(true);
  const [clickedPost, setClickedPost] = useState<DiscoverPost | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [deletingPostIndex, setDeletingPostIndex] = useState<string | null>(
    null
  );
  const [isOpenEditPost, setIsOpenEditPost] = useState(false);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [isFetched, setIsFetched] = useState(false);
  const [editedValue, setEditedValue] = useState<Post | null>(null);
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
      dispatch(updateSimilarDiscoverLikeStatus({ postId }));
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
      dispatch(updateSimilarDiscoverRepostStatus({ postId }));
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

  const getSimilarPosts = async ({
    searchScore,
    description,
    postId,
    lastDocId,
  }: GetDiscoverProps) => {
    if (!user) return;

    const res = await getSimilerFeed({
      user_id: user.userId,
      limit: 20,
      ...(lastDocId && { lastDocId }),
      ...(searchScore && { searchScore }),
      ...(description && { description }),
      postId,
    });

    setIsFetched(true);
    setSimilarFeed({ res, lastDocId, postId });
  };

  const setSimilarFeed = ({ lastDocId, res }: GetDiscoverProps) => {
    if (!res) return;

    if (res.status === 200) {
      if (res?.data.length < 20) {
        setHasMoreFeed(false);
      } else {
        setHasMoreFeed(true);
      }
      if (res.data.length > 0) {
        if (lastDocId) {
          dispatch(addSimilarDiscoverPost([...similarPosts, ...res.data]));
        } else {
          dispatch(addSimilarDiscoverPost(res.data));
        }
      }
    } else {
      sendNotification({ type: "ERROR", message: res.error });
    }
  };

  const handleCommentCount = (postId: string) => {
    dispatch(updateSimilarDiscoverCommentCount({ postId }));
  };

  const fetchMorePost = async () => {
    const lastDocId = similarPosts[similarPosts.length - 1]?.postId;
    const searchScore = similarPosts[similarPosts.length - 1]?.searchScore;
    if (clickedPost)
      getSimilarPosts({
        lastDocId,
        searchScore,
        postId: clickedPost.postId,
        description: clickedPost.image[0].description,
      });
    setIsFetched(false);
  };

  const handleDeletePostFromMenu = async (postId: string) => {
    if (!user) return;
    const selectedPost = similarPosts.find((post) => post.postId === postId);
    if (!selectedPost) return;

    sendNotification({ type: "LOADING" });
    const res = await deletePost({
      user_id: user.userId,
      postId,
    });

    if (res.status === 200) {
      dispatch(deleteSimilarDiscoverPost({ postId: selectedPost?.postId }));
      if (clickedPost)
        dispatch(deleteDiscoverPost({ postId: clickedPost.postId }));

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
      dispatch(updateSimilarDiscoverPostView({ postId }));
    } else {
      sendNotification({ type: "ERROR", message: res.error });
    }
  };

  const handlePostClicked = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
    postId: string
  ) => {
    event.stopPropagation();

    const clickedPost = similarPosts.find((post) => post.postId === postId);
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
    const postId = router.query.postId;

    if (postId) {
      const post = discoverPosts.find((p) => p.postId === (postId as string));

      if (post) {
        setClickedPost(post);
      } else {
        setClickedPost(null);
      }
    } else {
      router.push("/discover");
    }
    // discoverPosts.filter;
  }, []);

  useEffect(() => {
    if (similarPosts)
      setSelectedPost((prev) => {
        const matchedPost = similarPosts.find(
          (post) => post.postId === prev?.postId
        );
        return matchedPost ? matchedPost : null;
      });
  }, [similarPosts]);

  useEffect(() => {
    dispatch(addSimilarDiscoverPost([]));
    if (clickedPost)
      getSimilarPosts({
        postId: clickedPost.postId,
        description: clickedPost.image[0].description,
      });
  }, [clickedPost]);

  useEffect(() => {
    if (creditDialogInfo?.isPostAccessed) {
      getPromptDetails();
    }
  }, [creditDialogInfo]);

  useEffect(() => {
    if (promptDetails) {
      setCreditDialogInfo(null);
      dispatch(
        updateSimilarDiscoverPostViewPrompt({
          postId: selectedPost?.postId || "",
        })
      );
    }
  }, [promptDetails]);

  // get visible post on screen
  useEffect(() => {
    if (!similarPosts) {
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
            !similarPosts.filter((post) => post.postId === entry.target.id)[0]
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
  }, [similarPosts]);

  const handleEdit = (selectedPost: Post) => {
    setEditedValue(selectedPost);
    setIsOpenEditPost(true);
  };

  return (
    <div className="h-full">
      {similarPosts.length === 0 && isFetched ? (
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
            dataLength={similarPosts.length}
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
            <div
              ref={similarFeedScrollableDivRef}
              className="relative flex flex-col gap-5"
            >
              {similarPosts.map((post, index) => {
                return (
                  <div key={post.postId} id={post.postId} className="post-item">
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
                      similarPostId={clickedPost && clickedPost.postId}
                      selectedPost={post}
                      setSelectedImageIndex={setSelectedImageIndex}
                      setDeletingPostIndex={setDeletingPostIndex}
                      setCreditDialogInfo={setCreditDialogInfo}
                      handleEdit={handleEdit}
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
          setDeletingPostIndex={setDeletingPostIndex}
          setCreditDialogInfo={setCreditDialogInfo}
          promptDetails={promptDetails}
          handleEdit={handleEdit}
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
  );
};

export default SimilarFeed;
