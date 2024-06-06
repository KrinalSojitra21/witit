import { RootState } from "@/redux/store";
import { Message } from "@/types/message";
import dayjs from "dayjs";
import React, { useEffect } from "react";
import { useSelector } from "react-redux";
type Props = {
  msg: Message;
};
const MessageItem = ({ msg }: Props) => {
  const user = useSelector((state: RootState) => state.user);
  let bgColor: string = "bg-primary-main";
  let position: string = "justify-end";
  let borderStyle = "rounded-br-lg rounded-t-lg";

  if (msg.receiverId !== user?.userId) {
    bgColor = "bg-primary-main";
    position = "items-end";
    borderStyle = "rounded-bl-lg rounded-lg overflow-hidden";
  } else {
    bgColor = "bg-grey-700";
    position = "items-start";
    borderStyle = "rounded-br-lg rounded-lg overflow-hidden";
  }

  return (
    <div className={`w-full flex flex-col gap-2 mt-4 ${position}`}>
      <div className={`w-full  flex flex-col  ${position}`}>
        <p
          className={`${bgColor} ${borderStyle} text-sm font-light max-w-[60%]  px-3 py-2  break-words`}
        >
          {msg.message}
        </p>
      </div>
      <p className="text-grey-400 text-xs">
        {dayjs(msg?.createdAt).format("hh:mm A")}{" "}
      </p>
    </div>
  );
};

export default MessageItem;
