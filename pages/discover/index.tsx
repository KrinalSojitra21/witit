import { Masonry } from "@mui/lab";
import Head from "next/head";
import React, { useEffect, useRef, useState } from "react";
import { getDiscoverFeed } from "@/api/discover/getDiscoverFeed";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { useAuthContext } from "@/context/AuthContext";
import { addDiscoverPost } from "@/redux/slices/discoverFeedSlice";
import FeedItem from "@/components/discover/FeedItem";
import InfiniteScroll from "react-infinite-scroll-component";
import { CircularProgress, Grid, IconButton } from "@mui/material";
import CategorySelection from "@/components/shared/CategorySelection";
import { DiscoverPost } from "@/types/post";
import { getDiscoverSearchPostByContent } from "@/api/discover/getDiscoverSearchPostByContent";
import NormalLeftArrowIcon from "@/utils/icons/shared/NormalLeftArrowIcon";
import { useRouter } from "next/router";
import { addSimilarDiscoverPost } from "@/redux/slices/discoverSimilarFeedSlice";
import { NoDataFound } from "@/components/shared/NoDataFound";
import { CustomImagePreview } from "@/components/shared/CustomImagePreview";
import { postNotFoundSloth } from "@/utils/images";

type Res = {
  status: number;
  data: DiscoverPost[];
  error: any;
};

type GetDiscoverProps = {
  lastDocId?: string;
  search?: string | null;
  res?: Res;
  referencePostDetail?: { postId: string; description: string };
};

const responsiveGrid = {
  xl: 3,
  lg: 4,
  md: 6,
  sm: 12,
  xs: 12,
};

const Discover = () => {
  const dispatch = useDispatch();
  const parentRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const user = useSelector((state: RootState) => state.user);
  const discoverPosts = useSelector((state: RootState) => state.discoverPosts);
  const viewedNsfwList = useSelector((state: RootState) => state.viewedNSFW);

  const { sendNotification, discoverSearch, setDiscoverSearch } =
    useAuthContext();

  const [hasMoreFeed, setHasMoreFeed] = useState(true);
  const [category, setCategory] = useState<string[]>();
  const [isFetched, setIsFetched] = useState(false);
  // <SimilarFeed clickedPost={clickedDiscovePost} />

  const [clickedDiscovePost, setClickedDiscovePost] =
    useState<DiscoverPost | null>(null);

  const getFeed = async ({ lastDocId }: GetDiscoverProps) => {
    if (!user) return;
    const res = await getDiscoverFeed({
      user_id: user.userId,
      limit: 20,
      ...(lastDocId && { lastDocId }),
      ...(category && { category }),
    });

    setFeed({ res, lastDocId });
  };

  const getSearchFeed = async ({ search, lastDocId }: GetDiscoverProps) => {
    if (!user) return;
    const res = await getDiscoverSearchPostByContent({
      user_id: user.userId,
      limit: 20,
      ...(lastDocId && { lastDocId }),
      ...(search && { search }),
    });

    setFeed({ res, lastDocId });
  };

  const setFeed = ({ lastDocId, res }: GetDiscoverProps) => {
    if (!res) return;

    if (res.status === 200) {
      if (res?.data.length < 20) {
        setHasMoreFeed(false);
      }
      if (res.data.length > 0) {
        if (lastDocId) {
          dispatch(addDiscoverPost([...discoverPosts, ...res.data]));
        } else {
          dispatch(addDiscoverPost(res.data));
        }
      }
    } else {
      sendNotification({ type: "ERROR", message: res.error });
    }
  };

  const fetchMorePost = async () => {
    const lastDocId = discoverPosts[discoverPosts.length - 1]?.postId;
    getFeed({ lastDocId });
    setIsFetched(false);
  };

  const handleCategoryFilter = (list: string[]) => {
    setIsFetched(false);
    if (list.length > 0) setCategory(list);
    else setCategory(undefined);
  };

  useEffect(() => {
    if (!discoverSearch) {
      dispatch(addDiscoverPost([]));
      getFeed({});
    }
  }, []);

  useEffect(() => {
    if (!discoverSearch.search) {
      dispatch(addDiscoverPost([]));
      getFeed({});
    }
  }, [category]);

  useEffect(() => {
    setHasMoreFeed(true);
    if (
      discoverSearch &&
      discoverSearch?.search &&
      discoverSearch?.search?.length > 2 &&
      discoverSearch?.isSearched === false
    ) {
      setClickedDiscovePost(null);

      dispatch(addDiscoverPost([]));
      getSearchFeed({ search: discoverSearch.search });
      setDiscoverSearch((prev) => ({
        ...prev,
        isSearched: true,
      }));
    }
  }, [discoverSearch]);

  useEffect(() => {
    if (discoverSearch?.search?.length === 0 && category === undefined) {
      dispatch(addDiscoverPost([]));
      getFeed({});
    }
  }, [discoverSearch, category]);

  useEffect(() => {
    if (clickedDiscovePost) {
      dispatch(addSimilarDiscoverPost([]));

      let url = window.location.protocol + "//" + window.location.host;
      url = url + "/discover/similarFeed?postId=" + clickedDiscovePost.postId;
      router.push(url);
    }
  }, [clickedDiscovePost]);

  return (
    <>
      <Head>
        <title>Witit - Discover</title>
      </Head>

      {!clickedDiscovePost && (
        <div className="flex w-full h-full pl-4" ref={parentRef}>
          <CategorySelection
            sendSelectedCategoryList={handleCategoryFilter}
            setEmpty={
              discoverSearch &&
              discoverSearch?.search &&
              discoverSearch?.search?.length > 0
                ? true
                : false
            }
          />
          {discoverPosts.length === 0 && !hasMoreFeed ? (
            <div className=" w-full h-full flex items-center justify-center">
              <NoDataFound
                title="No Result Found"
                image={
                  <div className="relative w-36 h-36 ">
                    <CustomImagePreview image={postNotFoundSloth} />
                  </div>
                }
                description="No results found for your search. Feel free to explore other topics!"
              />
            </div>
          ) : (
            <div
              id="discoverScrollableDiv"
              className="w-full  overflow-y-auto h-full "
            >
              <div className="w-full h-full max-w-lg md:max-w-2xl lg:max-w-4xl xl:max-w-5xl 2xl:max-w-6xl m-auto">
                <InfiniteScroll
                  dataLength={discoverPosts.length}
                  next={fetchMorePost}
                  hasMore={hasMoreFeed}
                  loader={
                    <div className="mt-4 text-common-white text-center w-full overflow-hidden">
                      <CircularProgress
                        size={20}
                        className="text-common-white"
                      />
                    </div>
                  }
                  scrollableTarget="discoverScrollableDiv"
                  style={hasMoreFeed ? {} : { overflow: "hidden" }}
                >
                  {/* <Masonry
                    component="ul"
                    columns={{ sm: 2, md: 3, lg: 4, xl: 4 }}
                    spacing={2}
                  > */}
                    <Grid
                      className="h-full overflow-auto px-5 py-4"
                      container
                      spacing={{ lg: 1.2, xl: 2 }}
                      columns={12}
                    >
                      {discoverPosts.map((post, index) => (
                        <Grid
                          key={index}
                          item
                          {...responsiveGrid}
                          onClick={() => {
                            const isViewdPost = viewedNsfwList.includes(
                              post.postId
                            );
                            if (!post.category.includes("NSFW")) {
                              setClickedDiscovePost(post);
                            } else if (
                              isViewdPost &&
                              post.category.includes("NSFW")
                            ) {
                              setClickedDiscovePost(post);
                            }
                          }}
                        >
                          <FeedItem post={post} key={index} />
                        </Grid>
                      ))}
                    </Grid>
                  {/* </Masonry> */}
                </InfiniteScroll>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default Discover;
