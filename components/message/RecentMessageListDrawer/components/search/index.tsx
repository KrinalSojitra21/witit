import getAllFriends from "@/api/cricle/getAllFriends";
import CustomInputTextField from "@/components/shared/CustomInputTextField";
import { useAuthContext } from "@/context/AuthContext";
import { RootState } from "@/redux/store";
import { theme } from "@/theme";
import { FriendsList } from "@/types/circle";
import LeftArrow from "@/utils/icons/message/LeftArrow";
import SearchIcon from "@/utils/icons/topbar/SearchIcon";
import { CircularProgress, Divider } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { useSelector } from "react-redux";
import SearchUserItem from "./components/SearchUserItem";
import { useMessageContext } from "@/components/message/context/MessageContext";
import { NoDataFound } from "@/components/shared/NoDataFound";
import { searchUserNotFound } from "@/utils/images/message";
import { CustomImagePreview } from "@/components/shared/CustomImagePreview";
import { useDebounceEffect } from "@/hooks/useDebounceEffect";

type Props = {
  setisOpenSearchBar: React.Dispatch<React.SetStateAction<Boolean>>;
  setIsMessageBoxOpen: React.Dispatch<React.SetStateAction<Boolean>>;
};

const RecentMessageSearch = ({
  setisOpenSearchBar,
  setIsMessageBoxOpen,
}: Props) => {
  const [getSearchUserList, setGetSearchUserList] = useState<FriendsList[]>([]);
  const [searchText, setSearchText] = useState<string>("");
  const [hasMoreSearchUser, sethasMoreSearchUser] = useState(true);

  const { setSelectedUser } = useMessageContext();
  const user = useSelector((state: RootState) => state.user);
  const { sendNotification } = useAuthContext();
  const ref = useRef<HTMLDivElement | null>(null);
  const debouncedSearch = useDebounceEffect(searchText, 2000);

  const getSearchList = async (searchScore?: number, lastDocId?: string) => {
    const response = await getAllFriends({
      user_id: user?.userId,
      search: debouncedSearch.length > 1 ? debouncedSearch : "",
      searchScore: searchScore,
      lastDocId: lastDocId,
      limit: 12,
    });

    if (response.status === 200 && response.data) {
      if (response.data.friends.length < 10) {
        sethasMoreSearchUser(false);
      } else {
        sethasMoreSearchUser(true);
      }
      if (response.data.friends.length >= 0) {
        if (lastDocId) {
          setGetSearchUserList([
            ...getSearchUserList,
            ...response.data.friends,
          ]);
          return;
        }
      }

      setGetSearchUserList(response.data.friends);
      return;
    }

    sendNotification({ type: "ERROR", message: response.error });
  };

  useEffect(() => {
    if (searchText === debouncedSearch) {
      sethasMoreSearchUser(false);
    } else if (searchText && searchText.length > 2) {
      sethasMoreSearchUser(true);

      setGetSearchUserList([]);
    }
  }, [searchText, debouncedSearch]);

  useEffect(() => {
    getSearchList();
    sethasMoreSearchUser(true);
  }, [debouncedSearch]);

  const SelectChatProfile = (Item: FriendsList) => {
    const data = {
      id: Item.userId,
      userName: Item.userName,
      userType: Item.userType,
      profileImage: Item.profileImage,
    };

    setSelectedUser(data);
  };

  const fetchMoreSearchlist = () => {
    const searchScore =
      getSearchUserList[getSearchUserList.length - 1].searchScore;
    const lastDocId = getSearchUserList[getSearchUserList.length - 1].userId;
    getSearchList(searchScore, lastDocId);
  };

  return (
    <div className="w-[450px]  h-full  bg-secondary-main flex flex-col ">
      <div className="px-5 py-5  flex flex-col gap-2">
        <div className="flex gap-3 items-center">
          <div
            className="cursor-pointer"
            onClick={() => {
              setisOpenSearchBar(false);
            }}
          >
            <LeftArrow />
          </div>
          <p className="text-base">Messages</p>
        </div>
        <CustomInputTextField
          className="py-2"
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            setSearchText(e.target.value);
          }}
          StartIcon={
            <div className=" scale-75  text-grey-400">
              <SearchIcon />
            </div>
          }
          placeholder="Search Chat"
        />
      </div>
      <Divider
        sx={{
          borderColor: theme.palette.grey[800],
        }}
      />
      <div className="w-full gap-2 relative pl-2 overflow-y-auto">
        <div
          id="RecentMessageScrollableDivTag"
          className="flex [&>div]:w-full h-full overflow-y-auto"
          ref={ref}
        >
          <InfiniteScroll
            hasMore={hasMoreSearchUser}
            dataLength={getSearchUserList.length}
            next={fetchMoreSearchlist}
            loader={
              <div className="text-common-black text-center w-full  ">
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
            scrollableTarget="RecentMessageScrollableDivTag"
          >
            {getSearchUserList?.map((item, index) => {
              return (
                <div
                  key={index}
                  className="flex flex-col cursor-pointer w-full px-2"
                  onClick={() => {
                    SelectChatProfile(item), setIsMessageBoxOpen(true);
                  }}
                >
                  <SearchUserItem profileChat={item} />
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
      {getSearchUserList.length < 1 && !hasMoreSearchUser && (
        <div className=" flex justify-center items-center h-full w-full">
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
  );
};

export default RecentMessageSearch;
