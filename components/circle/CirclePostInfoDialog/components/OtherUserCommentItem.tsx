import React from "react";
import { PostComment } from "@/types/post";
import { getRecentTimeFromTimeStamp } from "@/service/shared/getRecentTimeFromTimeStamp";
import appConstant from "@/utils/constants/withoutHtml/appConstant";
import { CustomImagePreview } from "@/components/shared/CustomImagePreview";
import { redirectTouserProfile } from "@/service/shared/redirectTouserProfile";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";  

type Props = {
  comment: PostComment;
};
const OtherUserCommentItem = ({ comment }: Props) => {
  const router = useRouter();
  const user = useSelector((state: RootState) => state.user);

  return (
    <div className="w-fit flex flex-row gap-3">
      <div className="w-[40px] h-[40px]  overflow-hidden">
        <div className=" relative w-[40px] h-[40px] bg-grey-600 rounded-md overflow-hidden">
          <CustomImagePreview
            image={
              comment?.commenter?.profileImage
                ? comment.commenter.profileImage
                : appConstant.defaultProfileImage
            }
          />
        </div>
      </div>

      <div className="flex-grow max-w-[89%]  flex  flex-col gap-1">
        <div className="flex gap-1.5 items-center  flex-grow-0">
          <p>{comment?.commenter?.userName}</p>
          <div className="flex items-center gap-1">
            <div className="bg-grey-300 rounded-full w-1 h-1"></div>
            <p className="text-grey-300 text-[0.65rem] font-light">
              {getRecentTimeFromTimeStamp(comment?.createdAt)}
            </p>
          </div>
        </div>

        <p className="w-fit text-grey-300 text-xs font-light tracking-wide bg-grey-800 p-3 rounded-lg ">
          {comment.comment.split(" ").map((word, index) => {
            const match = word.match(/@(\S+)/);

            if (
              match &&
              comment.tag.find((text) => text.userName === match[1])?.userId
            ) {
              const username = match[1];
              return (
                <span
                  key={index}
                  className=" text-grey-100 cursor-pointer"
                  onClick={() => {
                    comment?.tag?.map((tagInfo, index) => {
                      if (tagInfo.userName === username && tagInfo.userId) {
                        router.push(
                          redirectTouserProfile(tagInfo.userId, user?.userId)
                        );
                      }
                    });
                  }}
                >
                  {word}{" "}
                </span>
              );
            } else {
              return <span key={index}>{word} </span>;
            }
          })}
        </p>
      </div>
    </div>
  );
};

export default OtherUserCommentItem;
