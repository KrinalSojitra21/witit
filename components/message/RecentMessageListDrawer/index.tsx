import React, { useEffect, useRef, useState } from "react";
import SendIcon from "@/utils/icons/circle/SendIcon";
import { CircularProgress, Divider, IconButton } from "@mui/material";
import { useAuthContext } from "@/context/AuthContext";
import { theme } from "@/theme";
import appConstant, {
  defaultImageConstant,
} from "@/utils/constants/withoutHtml/appConstant";
import RecentMessageItem from "./components/RecentMessageItem";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import getrecentmessages from "@/api/message/getrecentmessages";
import InfiniteScroll from "react-infinite-scroll-component";
import { io } from "socket.io-client";
import RecentMessageSearch from "./components/search";
import TwoUserIcon from "@/utils/icons/message/TwoUserIcon";
import { useMessageContext } from "../context/MessageContext";
import { RecentMessage } from "@/types/message";
import { NoDataFound } from "@/components/shared/NoDataFound";
import { CustomImagePreview } from "@/components/shared/CustomImagePreview";
import { searchUserNotFound } from "@/utils/images/message";

type Props = {
  setIsMessageBoxOpen: React.Dispatch<React.SetStateAction<Boolean>>;
};
const RecentMessageListDrawer = ({ setIsMessageBoxOpen }: Props) => {
  const [recentMessages, setRecentMessages] = useState<RecentMessage[]>([]);
  const [hasMoreMessage, setHasMoreMessage] = useState(true);
  const [isOpenSearchBar, setisOpenSearchBar] = useState<Boolean>(false);

  const { sendNotification } = useAuthContext();
  const { setSelectedUser, } = useMessageContext();
  const { setCroppingImage } = useAuthContext();
  const user = useSelector((state: RootState) => state.user);
  const ref = useRef<HTMLDivElement | null>(null);

  const getRecentMessageList = async (lastDocId?: string | undefined) => {
    const response = await getrecentmessages({
      user_id: user?.userId,
      lastDocId,
    });

    if (response.status === 200) {
      if (response.data.length < 10) {
        setHasMoreMessage(false);
      } else {
        setHasMoreMessage(true);
      }
      if (response.data.length >= 0) {
        if (lastDocId) {
          setRecentMessages([...recentMessages, ...response.data]);
          return;
        }
      }

      setRecentMessages(response?.data);
      return;
    }

    sendNotification({ type: "ERROR", message: response.error });
  };

  const fetchMoreMessage = () => {
    const lastDocId = recentMessages[recentMessages.length - 1].receiver.id;
    getRecentMessageList(lastDocId);
  };

  useEffect(() => {
    getRecentMessageList();
  }, []);

  useEffect(() => {
    if (!user) return;

    const socket = io(appConstant.backendUrl, {
      path: "/socket.io",
      query: {
        userId: user.userId,
      },
      transports: ["websocket"],
    });

    socket.on("RecentMessageResponse", (response: RecentMessage) => {
      setRecentMessages((prevMessages) => {
        const restData = prevMessages.filter(
          (item) => item.messageId !== response.messageId
        );

        return [response, ...restData];
      });
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const SelectChatProfile = (item: RecentMessage) => {
    let selectedUser;

    if (item?.receiver.id === user?.userId) {
      selectedUser = item?.sender;
    } else {
      selectedUser = item?.receiver;
    }

    setSelectedUser(selectedUser);
    setIsMessageBoxOpen(true);
  };

  return (
    <>
      <div className="flex h-full border-r border-grey-500 overflow-auto">
        {!isOpenSearchBar && (
          <div className="w-[400px]    bg-secondary-main flex flex-col ">
            <div className="px-5 py-5  flex flex-col  justify-center">
              <div className="flex justify-between items-center">
                <div className="flex  gap-3">
                  <SendIcon />
                  <p className="text-base">Messages</p>
                </div>
                <div
                  className="cursor-pointer"
                  onClick={() => {
                    setisOpenSearchBar(true);
                  }}
                >
                  <TwoUserIcon />
                </div>
              </div>
            </div>
            <Divider
              sx={{
                borderColor: theme.palette.grey[800],
              }}
            />
            <div className=" flex flex-col w-full overflow-auto relative">
              <div
                id="RecentMessageScrollableDiv"
                className="overflow-auto h-full flex [&>div]:w-full"
                ref={ref}
              >
                <InfiniteScroll
                  dataLength={recentMessages.length}
                  next={fetchMoreMessage}
                  hasMore={hasMoreMessage}
                  loader={
                    <div className="text-common-black text-center w-full">
                      <CircularProgress
                        size={20}
                        className="text-common-white mt-2"
                      />
                    </div>
                  }
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    width: "100%",
                  }}
                  scrollableTarget="RecentMessageScrollableDiv"
                >
                  {recentMessages.map((item, index) => {
                    return (
                      <div
                        key={index}
                        className="flex flex-col cursor-pointer justify-center w-full px-3"
                        onClick={() => {
                          setCroppingImage(defaultImageConstant);
                          SelectChatProfile(item);
                        }}
                      >
                        <RecentMessageItem profileChat={item} />
                        <Divider
                          sx={{
                            borderColor: theme.palette.grey[800],
                          }}
                        />
                      </div>
                    );
                  })}
                </InfiniteScroll>
              </div>
            </div>
            {recentMessages.length < 1 && !hasMoreMessage && (
              <div className="mt-10 flex justify-center items-center h-full w-full">
                <NoDataFound
                  image={
                    <div className="relative h-[120px] w-[120px]">
                      <CustomImagePreview image={searchUserNotFound} />
                    </div>
                  }
                  title="No Chat Found"
                  description="Start Chatting with your witit friends!"
                />
              </div>
            )}
          </div>
        )}
        {isOpenSearchBar && (
          <RecentMessageSearch
            setisOpenSearchBar={setisOpenSearchBar}
            setIsMessageBoxOpen={setIsMessageBoxOpen}
          />
        )}
      </div>
    </>
  );
};

export default RecentMessageListDrawer;
