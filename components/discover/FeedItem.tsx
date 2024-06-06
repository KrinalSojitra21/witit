import { DiscoverPost } from "@/types/post";
import TravelCategoryIcon from "@/utils/icons/createPost/selectCategoryIcons/TravelCategoryIcon";
import { ListItem, Grid, Tooltip } from "@mui/material";
import React, { useEffect, useState } from "react";
import ImagePreviewBox from "./ImagePreviewBox";
import { CustomTooltip } from "../shared/CustomTooltip";
import { CategoryList } from "@/utils/constants/withHtml/CategoryList";
type Props = {
  post: DiscoverPost;
  height?: number;
};

const FeedItem = ({ post, height }: Props) => {
  const [isImageHovered, setisImageHovered] = useState(false);
  // const aspectRatio = post.image[0].width / post.image[0].height;

  // useEffect(() => {
  //   setTimeout(() => {
  //     setIsShowImage(true);
  //   }, 1000);
  // }, []);

  return (
    <ListItem
      className={`text-common-white relative rounded-lg overflow-hidden p-0 aspect-[4/5] `}
      // style={{ aspectRatio }}
    >
      {/* {isShowImage ? (
        <> */}
      {post.category.includes("NSFW") ? (
        <ImagePreviewBox
          image={post.image[0]}
          isNSFW={true}
          postId={post.postId}
        />
      ) : (
        <div
          className="w-full h-full cursor-pointer"
          onMouseEnter={() => {
            setisImageHovered(true);
          }}
          onMouseLeave={() => {
            setisImageHovered(false);
          }}
        >
          <ImagePreviewBox
            image={post.image[0]}
            isNSFW={false}
            postId={post.postId}
          />

          {isImageHovered && post.category.length > 0 ? (
            <div className="w-full h-full absolute top-0 left-0 z-50 flex justify-end gap-1.5 p-1.5 ">
              {post.category.slice(0, 3).map((catName, index) => {
                const icon = CategoryList.filter(
                  (category) => category.name === catName
                );
                const isLastCat =
                  post.category.length <= 3
                    ? index === post.category.length - 1
                    : index === 2;
                return (
                  <CustomTooltip
                    key={index}
                    title={catName}
                    placement={isLastCat ? "bottom-end" : "bottom"}
                  >
                    <div
                      className=" cursor-default w-8 h-8 p-[9px] gap-1 bg-common-black bg-opacity-60 hover:bg-common-black hover:bg-opacity-80 transition-all flex justify-center items-center rounded-lg"
                      key={index}
                    >
                      {icon.length > 0 ? (
                        icon[0].startIcon
                      ) : (
                        <TravelCategoryIcon />
                      )}
                    </div>
                  </CustomTooltip>
                );
              })}
            </div>
          ) : null}

          {/* {isImageHovered ? (
                <Grid md={2} className="bg-grey-300 w-full h-full">
                  <div className="w-full h-full  absolute top-0 left-0 z-50 bg-gradient-to-t from-[#121315] via-[#17181b00] to-[#17181b00] flex flex-col justify-between ">
                    <div className="flex w-full justify-end gap-1 p-1">
                      {post.category.map((cat_name, index) => {
                        return (
                          <>
                            {index < 3 ? (
                              <Tooltip title={cat_name}>
                                <div
                                  className=" w-7 h-7 bg-common-black  hover:bg-primary-main flex justify-center items-center rounded-lg cursor-pointer "
                                  key={index}
                                >
                                  <div className="flex items-center p-1 gap-1">
                                    <div className=" scale-50">
                                      <TravelCategoryIcon />
                                    </div>
                                  </div>
                                </div>
                              </Tooltip>
                            ) : null}
                          </>
                        );
                      })}
                    </div>
                    <div className="flex w-full items-center xl:p-4 p-3 gap-3">
                      <Image
                        fill
                        src={temp1}
                        alt=""
                        className="relative xl:w-[40px] xl:h-[40px] w-[36px] h-[36px] rounded-full"
                      />
                      <p className="xl:text-base text-sm">Jenny Wilson</p>
                    </div>
                  </div>
                </Grid>
              ) : null} */}
        </div>
      )}
      {/* </>
      ) : null} */}
    </ListItem>
  );
};

export default FeedItem;
