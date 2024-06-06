import { deletePost } from "@/api/post/deletePost";
import { doRepost } from "@/api/post/doRepost";
import { getPromptOfPost } from "@/api/post/getPromptOfPost";
import { getSinglePostById } from "@/api/post/getSinglePostById";
import { likePost } from "@/api/post/likePost";
import { reportPost } from "@/api/post/reportPost";
import { viewPost } from "@/api/post/viewPost";
import CirclePost from "@/components/circle/CirclePost";

import CirclePostInfoDialog from "@/components/circle/CirclePostInfoDialog";
import ViewPromptDrawer from "@/components/discover/ViewPromptDrawer";
import ConfirmationDialog from "@/components/shared/ConfirmationDialog";
import ReportDialog from "@/components/shared/ReportDialog";
import CreditViewPrompt from "@/components/shared/credit/CreditViewPrompt";
import Creadit from "@/components/shared/credit/Index";
import { useAuthContext } from "@/context/AuthContext";
import { RootState } from "@/redux/store";
import { Post, PromptDetail } from "@/types/post";
import { UserBaseInfo } from "@/types/user";
import { CircularProgress } from "@mui/material";
import { useRouter } from "next/router";
import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";

type Res = {
  status: number;
  data: null;
  error: any;
};
type LikePostProps = { postId: string; isLiked: boolean; res?: Res };

const PostPage = () => {
  const { asPath } = useRouter();
  const currentPath = useRef(asPath);
  const { sendNotification } = useAuthContext();
  const router = useRouter();

  const user = useSelector((state: RootState) => state.user);
  const viewedNsfwList = useSelector((state: RootState) => state.viewedNSFW);

  const [post, setPost] = useState<Post | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [deletingPostIndex, setDeletingPostIndex] = useState<string | null>(
    null
  );
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [creditDialogInfo, setCreditDialogInfo] = useState<{
    userInfo: UserBaseInfo;
    postId: string;
    isPostAccessed: boolean;
  } | null>(null);
  const [promptDetails, setPromptDetails] = useState<PromptDetail | null>(null);
  const [isFetched, setIsFetched] = useState(false);
  const [reportingPostIndex, setReportingPostIndex] = useState<string | null>(
    null
  );

  const getPost = async (postId: string) => {
    if (!user) return;
    const res = await getSinglePostById({
      user_id: user.userId,
      postId,
    });
    setIsFetched(true);
    if (res.status === 200 && res.data) {
      setPost(res.data);
    } else {
      sendNotification({ type: "ERROR", message: res.error });
    }
  };

  const handleLikePost = async ({ postId, isLiked }: LikePostProps) => {
    if (!user) return;
    const res = await likePost({
      user_id: user.userId,
      postId,
      isLiked,
    });

    if (!res) return;
    if (res.status === 200) {
      setPost((prev) => {
        if (!prev) return null;

        return {
          ...prev,
          counts: {
            ...prev.counts,
            like: prev.userActivity.isLiked
              ? prev.counts.like - 1
              : prev.counts.like + 1,
          },
          userActivity: {
            ...prev.userActivity,
            isLiked: !prev.userActivity.isLiked,
          },
        };
      });
    } else {
      sendNotification({ type: "ERROR", message: res.error });
    }
  };

  const handleDeletePostFromMenu = async (postId: string) => {
    if (!user) return;

    sendNotification({ type: "LOADING" });
    const res = await deletePost({
      user_id: user.userId,
      postId,
    });

    if (!res) return;
    if (res.status === 200) {
      sendNotification({
        type: "SUCCESS",
        message: "Post Deleted Successfully",
      });

      router.push("/discover");
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

      setPost((prev) => {
        if (!prev) return null;

        return {
          ...prev,
          counts: {
            ...prev.counts,
            repost: prev.userActivity.isReposted
              ? prev.counts.repost - 1
              : prev.counts.repost + 1,
          },
          repostedBy: prev.userActivity.isReposted ? null : prev.repostedBy,
          userActivity: {
            ...prev.userActivity,
            isReposted: !prev.userActivity.isReposted,
          },
        };
      });
    } else {
      sendNotification({ type: "ERROR", message: res.error });
    }
  };

  const handleCommentCount = () => {
    setPost((prev) => {
      if (!prev) return null;

      return {
        ...prev,
        counts: {
          ...prev.counts,
          comment: prev.counts.comment + 1,
        },
        userActivity: {
          ...prev.userActivity,
          isCommented: true,
        },
      };
    });
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

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    postId: string
  ) => {
    handleLikePost({
      postId: postId,
      isLiked: event.target.checked,
    });
  };
  const viewPostCount = async (postId: string) => {
    if (!user) return;
    const res = await viewPost({
      user_id: user.userId,
      postId,
    });
    if (res.status === 200) {
      setPost((prev) => {
        if (!prev) return null;

        return {
          ...prev,
          userActivity: {
            ...prev.userActivity,
            isViewed: true,
          },
        };
      });
    } else {
      sendNotification({ type: "ERROR", message: res.error });
    }
  };

  const handlePostClicked = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
    postId: string
  ) => {
    event.stopPropagation();

    if (post) {
      const isViewdPost = viewedNsfwList.includes(post.postId);
      if (!post.category.includes("NSFW")) {
        setSelectedPost(post);
      } else if (isViewdPost && post.category.includes("NSFW")) {
        setSelectedPost(post);
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
      getPost(postId as string);
    } else {
      router.push("/discover");
    }
  }, [currentPath.current]);

  useEffect(() => {
    if (creditDialogInfo?.isPostAccessed) {
      getPromptDetails();
    }
  }, [creditDialogInfo]);

  useEffect(() => {
    if (promptDetails) {
      setCreditDialogInfo(null);

      setPost((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          isPromptAvailable: true,
          userActivity: {
            ...prev.userActivity,
            isAccessToViewPrompt: true,
          },
        };
      });
    }
  }, [promptDetails]);

  useEffect(() => {
    if (post && !post.userActivity.isViewed) {
      viewPostCount(post.postId);
    }
    if (selectedPost) setSelectedPost(post);
  }, [post]);

  return (
    <div className="flex h-full justify-center items-center">
      {post ? (
        <div
          onClick={(e) => {
            e.stopPropagation();
            setSelectedPost(post);
          }}
        >
          <CirclePost
            handleChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              handleChange(event, post.postId);
            }}
            handleRepost={(
              event: React.MouseEvent<HTMLDivElement, MouseEvent>
            ) => {
              handleRepost(event, post.postId, post.userActivity.isReposted);
            }}
            selectedPost={post}
            setSelectedImageIndex={setSelectedImageIndex}
            setDeletingPostIndex={setDeletingPostIndex}
            setCreditDialogInfo={setCreditDialogInfo}
            promptDetails={promptDetails}
            creditDialogInfo={creditDialogInfo}
            handlePostClicked={handlePostClicked}
            setReportingPostIndex={setReportingPostIndex}
          />
        </div>
      ) : (
        <>
          {isFetched ? (
            <div className="w-full h-full flex justify-center items-center">
              <div className="text-3xl font-bold">Post Not Found</div>
            </div>
          ) : (
            <div className="mt-4 text-common-white text-center w-full overflow-hidden">
              <CircularProgress size={20} className="text-common-white" />
            </div>
          )}
        </>
      )}
      {selectedPost ? (
        <CirclePostInfoDialog
          handleCommentCount={handleCommentCount}
          // selectedPost={selectedPost}
          // selectedImageIndex={selectedImageIndex}
          // setSelectedPost={setSelectedPost}
          // setDeletingPostIndex={setDeletingPostIndex}
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
          creditDialogInfo={creditDialogInfo}
          promptDetails={promptDetails}
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
    </div>
  );
};

export default PostPage;
