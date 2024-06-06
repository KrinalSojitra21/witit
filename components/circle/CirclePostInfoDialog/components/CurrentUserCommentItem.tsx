import { useAuthContext } from "@/context/AuthContext";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import tempuser from "@/utils/images/tempuser.jpg";
import { PostComment } from "@/types/post";
import { type } from "os";
import { getRecentTimeFromTimeStamp } from "@/service/shared/getRecentTimeFromTimeStamp";
import { theme } from "@/theme";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { redirectTouserProfile } from "@/service/shared/redirectTouserProfile";

type Props = {
  comment: PostComment;
};
const CurrentUserCommentItem = ({ comment }: Props) => {
  const router = useRouter();
  const user = useSelector((state: RootState) => state.user);

  const [initialTime, setInitialTime] = useState("");

  useEffect(() => {
    setInitialTime(getRecentTimeFromTimeStamp(comment?.createdAt));
  }, [comment]);
  return (
    <div className="w-full  flex flex-col items-end gap-1">
      <div className="flex items-center gap-1">
        <div className="bg-grey-300 rounded-full w-1 h-1"></div>
        <p className="text-grey-300 text-[0.65rem] font-light">{initialTime}</p>
      </div>
      <p className="text-grey-300 text-xs font-light tracking-wide bg-grey-700 p-3 rounded-lg max-w-[85%]">
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
        {/* {comment.comment.split(" ").map((word, index) => {
          if (word.startsWith("@")) {
            return (
              <span
                key={index}
                className=" text-grey-100 cursor-pointer"
                onClick={() => {
                  comment?.tag?.map((tagInfo, index) => {
                    if (tagInfo.userName === word.split("@")[1]) {
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
        })} */}
      </p>
    </div>
    // <div className="w-full flex flex-row gap-3">
    //   <div className="w-[40px] h-[40px]  overflow-hidden">
    //     <Image
    //       fill
    //       src={
    //         comment?.commenter?.profileImage
    //           ? comment.commenter.profileImage
    //           : tempuser
    //       }
    //       alt=""
    //       className=" relative w-[40px] h-[40px] rounded-md"
    //     />
    //   </div>

    //   <div className="flex-grow max-w-[89%]  flex  flex-col gap-1">
    //     <div className="flex gap-1.5 items-center  flex-grow-0">
    //       <p>{comment?.commenter?.userName}</p>
    //       <div className="flex items-center gap-1">
    //         <div className="bg-grey-300 rounded-full w-1 h-1"></div>
    //         <p className="text-grey-300 text-[0.65rem] font-light">
    //           {getRecentTimeFromTimeStamp(comment?.createdAt)}
    //         </p>
    //       </div>
    //     </div>

    //     <p className="text-grey-300 text-xs font-light tracking-wide bg-grey-800 p-3 rounded-lg ">
    //       {comment.comment}
    //     </p>
    //   </div>
    //   {customDialogType === "CREDITS-VIEWPROMPT" ? <CreditDialog /> : null}
    // </div>
  );
};

export default CurrentUserCommentItem;
