import React from "react";
import CreditIcon from "@/utils/icons/topbar/CreditIcon";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import dayjs from "dayjs";
import { Message } from "@/types/message";
import { useMessageContext } from "../../context/MessageContext";

type Props = {
  msg: Message;
};
const SendCreditItem = ({ msg }: Props) => {
  const { selectedUser } = useMessageContext();
  const user = useSelector((state: RootState) => state.user);

  let bgColor: string = "bg-primary-main";
  let position: string = "justify-end";
  let creditPosition: string = "flex-row-reverse";
  let borderStyle = "rounded-br-lg rounded-t-lg";

  if (msg.receiverId !== user?.userId) {
    bgColor = "bg-primary-main";
    creditPosition = "flex-row-reverse";
    position = "items-end";
    borderStyle = "rounded-bl-lg rounded-t-lg overflow-hidden ";
  } else {
    bgColor = "bg-grey-700";
    position = "items-start";
    creditPosition = "flex-row-reverse";
    borderStyle = "rounded-br-lg rounded-t-lg overflow-hidden ";
  }

  return (
    <div className={` flex flex-col gap-1  mt-4 w-full ${position}`}>
      <div
        className={`flex bg-grey-700  w-fit ${borderStyle} ${creditPosition}`}
      >
        <div className=" flex flex-col text-sm justify-center items-start px-5 gap-1">
          {msg.receiverId === user?.userId && (
            <p>Hurray!! Credits Sent to You.</p>
          )}
          {msg.receiverId !== user?.userId && (
            <>
              <p>Oops!! You send Credits.</p>
              <p className=" text-xs text-grey-200">
                To {selectedUser?.userName}
              </p>
            </>
          )}
        </div>
        <div className="flex bg-primary-main items-center p-5 gap-2">
          <CreditIcon /> <p className=" text-xl">{msg.credit}</p>
        </div>
      </div>
      <p className="text-grey-400 text-xs">
        {dayjs(msg?.createdAt).format("hh:mm A")}
      </p>
    </div>
  );
};

export default SendCreditItem;
