import React, { useState } from "react";
import ImagePreviewBox from "@/components/discover/ImagePreviewBox";
import TravelCategoryIcon from "@/utils/icons/createPost/selectCategoryIcons/TravelCategoryIcon";
import { Post } from "@/types/post";
import { CategoryList } from "@/utils/constants/withHtml/CategoryList";
import { CustomTooltip } from "@/components/shared/CustomTooltip";
import SynchronizeIcon from "@/utils/icons/circle/SynchronizeIcon";
import { useProfileContext } from "@/components/profile/Profile/context/ProfileContext";
import { RootState } from "@/redux/store";
import { useSelector } from "react-redux";

type Props = {
  post: Post;
};

const PostItem = ({ post }: Props) => {
  const { currentUser } = useProfileContext();

  const user = useSelector((state: RootState) => state.user);
  const [isImageHovered, setisImageHovered] = useState(false);

  // const aspectRatio = post.image[0].width / post.image[0].height;

  const handleHover = (isHover: boolean) => {
    if (post.category.length > 0 && !post.category.includes("NSFW")) {
      setisImageHovered(isHover);
    }
  };

  return (
    <div
      className="text-common-white relative rounded-xl overflow-hidden aspect-[4/5] bg-grey-600 "
      // style={{ aspectRatio }}
      onMouseEnter={() => {
        handleHover(true);
      }}
      onMouseLeave={() => {
        handleHover(false);
      }}
    >
      <ImagePreviewBox
        image={post.image[0]}
        isNSFW={post.category.includes("NSFW")}
        postId={post.postId}
      />
      {isImageHovered && post.category.length > 0 ? (
        <div className="w-full h-full absolute top-0 left-0 z-50 flex justify-end gap-1.5 p-1.5 cursor-pointer">
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
                  className=" w-8 h-8 p-[9px] gap-1 bg-common-black bg-opacity-60 hover:bg-common-black hover:bg-opacity-80 transition-all flex justify-center items-center rounded-xl"
                  key={index}
                >
                  {icon.length > 0 ? icon[0].startIcon : <TravelCategoryIcon />}
                </div>
              </CustomTooltip>
            );
          })}
        </div>
      ) : null}

      {post.userActivity.isReposted && user?.userId === currentUser?.userId && (
        <div className=" absolute right-0 bottom-0 z-10 bg-primary-main rounded-tl-md px-2 py-2.5">
          <SynchronizeIcon size={20} />
        </div>
      )}
    </div>
  );
};

export default PostItem;
