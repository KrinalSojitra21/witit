import React, { useEffect, useState } from "react";
import { getUserPosts } from "@/api/post/getUserPosts";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { addUserPost } from "@/redux/slices/userPostSlice";
import { PostGridView } from "./components/PostGridView";
import { useAuthContext } from "@/context/AuthContext";
import ProfileFeed from "./components/profileFeed";
import { NoDataFound } from "@/components/shared/NoDataFound";
import { postNotFoundSloth } from "@/utils/images";
import { useProfileContext } from "../Profile/context/ProfileContext";
import { CustomImagePreview } from "@/components/shared/CustomImagePreview";

type GetPostsProps = {
  lastDocId?: string;
};
type Props = {
  postId: string | null;
  setPostId: React.Dispatch<React.SetStateAction<string | null>>;
};

const Feed = ({ postId, setPostId }: Props) => {
  const dispatch = useDispatch();

  const { sendNotification } = useAuthContext();
  const { currentUser } = useProfileContext();

  const userPosts = useSelector((state: RootState) => state.userPosts);
  const user = useSelector((state: RootState) => state.user);

  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
  const [hasMorePost, setHasMorePost] = useState(true);

  const getPosts = async ({ lastDocId }: GetPostsProps) => {
    if (!user || !currentUser) return;

    const res = await getUserPosts({
      user_id: user.userId,
      limit: 20,
      ...(lastDocId && { lastDocId }),
      ...(currentUser.userId !== user.userId && {
        profilerId: currentUser?.userId,
      }),
    });

    if (res.status === 200 && res?.data) {
      if (res?.data.length < 20) {
        setHasMorePost(false);
      } else {
        setHasMorePost(true);
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

  useEffect(() => {
    setHasMorePost(true);
    setSelectedPostId(null);
    dispatch(addUserPost([]));
    getPosts({});
  }, [currentUser]);

  useEffect(() => {
    if (postId === null) {
      setSelectedPostId(null);
    }
  }, [postId]);

  useEffect(() => {
    setPostId(selectedPostId);
  }, [selectedPostId]);

  const handleClick = () => {
    //send it to Create post
  };

  if (
    !hasMorePost &&
    userPosts.length === 0 &&
    user?.userId === currentUser?.userId
  ) {
    return (
      <NoDataFound
        title="No Post Found"
        image={
          <div className="relative w-20 h-20 ">
            <CustomImagePreview image={postNotFoundSloth} />
          </div>
        }
        description="It looks like you haven't post anything. Let’s upload your first feed.."
        buttonName="Create Post"
        handleEvent={handleClick}
      />
    );
  }

  if (
    !hasMorePost &&
    userPosts.length === 0 &&
    user?.userId !== currentUser?.userId
  ) {
    return (
      <NoDataFound
        title="No Post Found"
        image={
          <div className="relative w-20 h-20 ">
            <CustomImagePreview image={postNotFoundSloth} />
          </div>
        }
        description="It looks like user haven't post anything."
      />
    );
  }

  return (
    <div className="h-full overflow-auto flex justify-center">
      {/* <div className="w-full h-full max-w-lg md:max-w-2xl lg:max-w-4xl xl:max-w-5xl 2xl:max-w-6xl"> */}
      {selectedPostId ? (
        <ProfileFeed
          selectedPostId={selectedPostId}
          hasMorePost={hasMorePost}
        />
      ) : (
        <PostGridView
          posts={userPosts}
          getPosts={getPosts}
          hasMorePost={hasMorePost}
          setSelectedPostId={setSelectedPostId}
        />
      )}
      {/* </div> */}
    </div>
  );
};

export default Feed;
