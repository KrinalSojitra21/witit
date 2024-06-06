import React, { useEffect, useRef, useState } from "react";
import { CircularProgress } from "@mui/material";
import appConstant from "@/utils/constants/withoutHtml/appConstant";
import { useAuthContext } from "@/context/AuthContext";
import MessageItem from "./components/MessageItem";
import ImageItem from "./components/ImageItem";
import SendCreditItem from "./components/SendCreditItem";
import { Message } from "@/types/message";
import getMessages from "@/api/message/getMessages";
import { RootState } from "@/redux/store";
import { useDispatch, useSelector } from "react-redux";
import ChatTopbar from "./components/ChatTopbar";
import ChatBottomBar from "./components/ChatBottomBar";
import InfiniteScroll from "react-infinite-scroll-component";
import { io } from "socket.io-client";
import { useMessageContext } from "../context/MessageContext";
import { NoDataFound } from "@/components/shared/NoDataFound";
import { messageNotFound } from "@/utils/images/message";
import { getOtherUser } from "@/api/user/getOtherUser";
import { ReduxUser } from "@/types/user";
import { CustomImagePreview } from "@/components/shared/CustomImagePreview";
import ConfirmationDialog from "@/components/shared/ConfirmationDialog";
import { blockOrUnblockUser } from "@/api/user/blockOrUnblockUser";
import { blockUserIllustrator } from "@/utils/images";
import ReportDialog from "@/components/shared/ReportDialog";
import { reportUser } from "@/api/user/reportUser";

const PersonalChat = () => {
  const [hasMoreMessage, setHasMoreMessage] = useState(true);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isBlockDialogOpen, setIsBlockDialogOpen] = useState(false);
  const [otherUserDetails, setOtherUserDetails] = useState<ReduxUser | null>(
    null
  );
  const [isDataLoading, setIsDataLoading] = useState(false);
  const [isUnBlock, setisUnBlock] = useState<boolean>(true);
  const [reportingPostIndex, setReportingPostIndex] = useState<boolean>(false);
  const { sendNotification } = useAuthContext();
  const { selectedUser } = useMessageContext();
  const user = useSelector((state: RootState) => state.user);
  const ref = useRef<HTMLDivElement | null>(null);

  const getMessageList = async (lastDocId?: string) => {
    if (!selectedUser) {
      return <></>;
    }

    const response = await getMessages({
      user_id: user?.userId,
      receiverId: selectedUser.id,
      limit: 10,
      ...(lastDocId && { lastDocId }),
    });

    if (response.status === 200 && response.data) {
      if (response.data.length < 10) {
        setHasMoreMessage(false);
      } else {
        setHasMoreMessage(true);
      }

      if (response.data.length > 0) {
        if (lastDocId) {
          setMessages([...messages, ...response.data]);
          return;
        }
      }

      setMessages(response.data);
      return;
    }

    sendNotification({ type: "ERROR", message: response.error });
  };

  const fetchMoreGeneration = async () => {
    const lastDocId = messages[messages.length - 1].messageId;

    getMessageList(lastDocId);
  };

  useEffect(() => {
    if (!user) return;

    const socket = io(appConstant.backendUrl, {
      path: "/socket.io",
      query: {
        userId: user.userId,
      },
      transports: ["websocket", "polling"],
    });

    console.log("message socket connected", socket);

    socket.on("MessageResponse", (response: Message) => {
      if (!selectedUser) {
        return <></>;
      }

      if (
        response.receiverId === user.userId &&
        selectedUser.id === response.senderId
      ) {
        setMessages((message) => {
          if (message.find((d) => d.messageId === response.messageId)) {
            return message;
          }
          return [response, ...message];
        });

        const data = {
          senderId: response.senderId,
          receiverId: response.receiverId,
        };

        socket.emit("ReadMessage", data, (error: any) => {
          console.log("Message sent successfully");
          if (error) {
            console.error("Error sending message:", error);
          }
        });
      }
    });

    return () => {
      socket.disconnect();
    };
  }, [selectedUser]);

  useEffect(() => {
    if (otherUserDetails?.blockedBy) {
    } else {
      getMessageList();
    }

    fetchOtherUser();
  }, [selectedUser, isUnBlock, isBlockDialogOpen]);

  const fetchOtherUser = async () => {
    if (!selectedUser || !user) {
      return;
    }
    setIsDataLoading(true);

    const response = await getOtherUser({
      user_id: user.userId,
      profilerId: selectedUser.id,
    });
    setIsDataLoading(false);
    if (response.status === 200 && user) {
      setOtherUserDetails(response.data);
      return;
    }
    sendNotification({ type: "ERROR", message: response.error });
  };

  const blockUser = async () => {
    if (!user) return;
    if (!selectedUser) return;

    const res = await blockOrUnblockUser({
      user_id: user?.userId,
      data: {
        isBlock: true,
        blockedUserId: selectedUser.id,
      },
    });
    if (res.status === 200) {
      sendNotification({ type: "SUCCESS", message: "User Blocked" });
      setIsBlockDialogOpen(false);
      return;
    }
    sendNotification({ type: "ERROR", message: res.error });
  };

  const unblockUser = async () => {
    if (!user || !selectedUser) {
      return;
    }

    const res = await blockOrUnblockUser({
      user_id: user.userId,
      data: {
        isBlock: false,
        blockedUserId: selectedUser?.id,
      },
    });

    if (res.status === 200) {
      setisUnBlock(!isUnBlock);
      sendNotification({ type: "SUCCESS", message: "User UnBlocked" });
      return;
    }
    sendNotification({ type: "ERROR", message: res.error });
  };

  const submitReport = async (inputText: string) => {
    if (!user || !selectedUser) return;

    const res = await reportUser({
      user_id: user.userId,
      data: { reportFor: inputText, reportedUserId: selectedUser.id },
    });

    if (res.status === 200) {
      sendNotification({
        type: "SUCCESS",
        message: "Report Submitted Successfully",
      });
      setReportingPostIndex(false);
    } else {
      sendNotification({ type: "ERROR", message: res.error });
    }
  };

  return (
    <>
      <div
        className=" bg-grey-900  flex-grow flex flex-col "
        // onDragOver={handleDragOver}
        // onDrop={handleDrop}
        // onDragLeave={handleLeave}
      >
        <ChatTopbar
          otherUserDetails={otherUserDetails}
          isDataLoading={isDataLoading}
          setIsBlockDialogOpen={setIsBlockDialogOpen}
          setReportingPostIndex={setReportingPostIndex}
        />
        {isBlockDialogOpen ? (
          <ConfirmationDialog
            isOpen={isBlockDialogOpen}
            onCancel={() => {
              setIsBlockDialogOpen(false);
            }}
            onConform={() => {
              blockUser();
            }}
            title={{
              titleMain: "Block " + selectedUser?.userName + "?",
              title2:
                selectedUser?.userName +
                " won't be able to send you messages, see your posts, connect with members, or join your circle. They won't receive a notification that you've blocked them.",
              confirmButton: "Block",
            }}
          />
        ) : null}
        {selectedUser?.id !== user?.userId &&
          otherUserDetails?.blockedBy &&
          otherUserDetails?.blockedBy !== user?.userId && (
            <NoDataFound
              image={
                <div className="relative w-20 h-20 ">
                  <CustomImagePreview image={blockUserIllustrator} />
                </div>
              }
              title="User has blocked you"
              description="it looks like you are unable to view a profile of this user because they blocked you."
            />
          )}
        {selectedUser?.id !== user?.userId &&
        otherUserDetails?.blockedBy &&
        otherUserDetails.blockedBy === user?.userId ? (
          <NoDataFound
            image={
              <div className="relative w-28 h-28 ">
                <CustomImagePreview image={blockUserIllustrator} />
              </div>
            }
            title="You have blocked the user"
            description="it looks like you are unable to view a profile of this user because you blocked this user."
            buttonName="Unblock"
            handleEvent={unblockUser}
          />
        ) : null}{" "}
        {!otherUserDetails?.blockedBy && (
          <>
            <div className=" overflow-auto flex-grow flex flex-col">
              {messages.length > 1 && (
                <div
                  id="MessagesScrollableDiv"
                  className="px-5 pt-5 overflow-auto h-full flex flex-col-reverse w-full"
                  ref={ref}
                >
                  <InfiniteScroll
                    inverse={true}
                    next={fetchMoreGeneration}
                    dataLength={messages.length}
                    hasMore={hasMoreMessage}
                    loader={
                      <div className="mb-4 text-common-black text-center w-full overflow-hidden">
                        <CircularProgress
                          size={20}
                          className="text-common-white"
                        />
                      </div>
                    }
                    style={{ display: "flex", flexDirection: "column-reverse" }}
                    scrollableTarget="MessagesScrollableDiv"
                  >
                    {messages.map((msg, index) => {
                      return (
                        <div
                          key={index}
                          className=" flex flex-col gap-3 w-full "
                        >
                          {msg.type === "MESSAGE" && <MessageItem msg={msg} />}
                          {(msg.type === "IMAGE" || msg.type === "MWITHI") && (
                            <ImageItem msg={msg} />
                          )}
                          {msg.type === "CREDIT" && (
                            <SendCreditItem msg={msg} />
                          )}
                        </div>
                      );
                    })}
                  </InfiniteScroll>
                </div>
              )}
              {messages.length < 2 && !hasMoreMessage && (
                <div className="h-full w-full flex justify-center items-center">
                  <NoDataFound
                    image={
                      <div className="relative h-[60px] w-[60px]">
                        <CustomImagePreview image={messageNotFound} />
                      </div>
                    }
                    title="No Chat Found"
                    description="Start Chatting with your witit friends!"
                  />
                </div>
              )}
            </div>

            <ChatBottomBar
              user={user}
              setMessages={setMessages}
              messages={messages}
              otherUserDetails={otherUserDetails}
            />
          </>
        )}
      </div>
      {reportingPostIndex && (
        <ReportDialog
          isOpen={reportingPostIndex}
          title="Report"
          buttonName="Report"
          inputField={{
            limit: 10,
            tag: "Why is this inappropriate for Witit?",
            placeholder: "What seems to be the problem...",
          }}
          onConform={(inputText) => submitReport(inputText)}
          onCancel={() => {
            setReportingPostIndex(false);
          }}
        />
      )}
    </>
  );
};

export default PersonalChat;
{
  /* {/* {isDragging ? (
        <div className=" bg-secondary-main opacity-[0.88] h-full w-full absolute top-0 left-0 z-20 p-5">
          <div
            className={`h-full w-full border-dashed ${
              croppingImage.image.src === "" ? "" : "border"
            } border-grey-300 rounded-md overflow-hidden`}
          >
            <InputCropSingleImage
              type="MESSAGE"
              aspect={"1/1"}
              finalImage={finalMsgImage}
              setFinalImage={setFinalMsgImage}
              // clearError={clearErrors}
              placeholder={{
                placeholderImg: (
                  <div>
                    <Lottie
                      animationData={ImagePlaceholderLottie}
                      className=" w-[200px]"
                    />
                  </div>
                ),
                placeholderTitle: (
                  <>
                    <h2 className="text-center md:pt-5 pt-3">
                      Drag profile pic here,
                    </h2>
                    <h2 className="  text-center">
                      or <span className="text-primary-main">browse</span>
                    </h2>
                  </>
                ),
              }}
            />
          </div>
        </div> */
}

{
  /* ) : null} */
}

// const [isDragging, setisDragging] = useState(false);
// const [finalMsgImage, setFinalMsgImage] = useState<{
//   image: ImageInfo;
//   index: number;
// }>(defaultImageConstant);
// const {
//   setCustomDialogType,
//   customDialogType,
//   croppingImage,
//   setCroppingImage,
// } = useAuthContext();
// const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
//   event.preventDefault();
//   setisDragging(true);
// };
// const handleLeave = (event: React.DragEvent<HTMLDivElement>) => {
//   event.preventDefault();
//   setisDragging(false);
//   setCustomDialogType(null);
// };

// const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
//   event.preventDefault();
//   setisDragging(false);
//   const file = event.dataTransfer.files[0];
//   displaySingleImage(file, setCroppingImage);
// };
