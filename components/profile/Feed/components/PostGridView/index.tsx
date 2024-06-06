import { Post } from "@/types/post";
import PostItem from "./components/PostItem";
import InfiniteScroll from "react-infinite-scroll-component";
import { CircularProgress, Grid } from "@mui/material";
import { NoDataFound } from "@/components/shared/NoDataFound";
import { postNotFoundSloth } from "@/utils/images";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

type GetPostsProps = {
  lastDocId?: string;
};

type Props = {
  posts: Post[];
  getPosts: ({ lastDocId }: GetPostsProps) => void;
  hasMorePost: boolean;
  setSelectedPostId: React.Dispatch<React.SetStateAction<string | null>>;
};

const responsiveGrid = {
  xl: 4,
  lg: 5,
  md: 5,
  sm: 10,
  xs: 10,
};

export const PostGridView = ({
  posts,
  getPosts,
  hasMorePost,
  setSelectedPostId,
}: Props) => {
  const fetchMorePost = async () => {
    if (posts.length > 0) {
      const lastDocId = posts[posts.length - 1].postId;
      getPosts({ lastDocId });
    }
  };

  return (
    <div id="postScrollableDiv" className="w-full overflow-y-auto h-full">
      {/* max-w-lg md:max-w-2xl lg:max-w-4xl xl:max-w-5xl 2xl:max-w-6xl */}
      <div className="w-full h-full  m-auto">
        <InfiniteScroll
          dataLength={posts.length}
          next={fetchMorePost}
          hasMore={hasMorePost}
          loader={
            <div className="mt-4 text-common-white text-center w-full overflow-hidden">
              <CircularProgress size={20} className="text-common-white" />
            </div>
          }
          scrollableTarget="postScrollableDiv"
          style={hasMorePost ? {} : { overflow: "hidden" }}
        >
          {/* <Masonry
            component="ul"
            columns={{ sm: 2, md: 3, lg: 4, xl: 4 }}
            spacing={2}
          > */}
          <Grid
            className="h-full overflow-auto p-5"
            container
            spacing={{ lg: 1.2, xl: 2 }}
            columns={20}
          >
            {posts.map((post, index) => (
              <Grid key={index} item {...responsiveGrid}>
                <div
                  onClick={() => {
                    setSelectedPostId(post.postId);
                  }}
                >
                  <PostItem post={post} key={index} />
                </div>
              </Grid>
            ))}
          </Grid>

          {/* </Masonry> */}
        </InfiniteScroll>
      </div>
    </div>
  );
};
