import React, { useEffect, useState } from "react";
import CustomInputTextField from "../../../../CustomInputTextField";
import SearchIcon from "@/utils/icons/topbar/SearchIcon";
import CreatorIcon from "@/utils/icons/navbar/CreatorIcon";
import { CircularProgress, Divider } from "@mui/material";
import { theme } from "@/theme";
import CreatorItem from "./components/CreatorItem";
import { SearchCreator } from "@/types/user";
import { useDebounceEffect } from "@/hooks/useDebounceEffect";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { useAuthContext } from "@/context/AuthContext";
import { searchCreatorUser } from "@/api/user/searchCreatorUser";
import InfiniteScroll from "react-infinite-scroll-component";
import { concatCreator } from "@/redux/slices/creatorListSlice";
import { NoDataFound } from "@/components/shared/NoDataFound";
import { CustomImagePreview } from "@/components/shared/CustomImagePreview";
import { searchUserNotFound } from "@/utils/images/message";

type Res = { status: number; data: SearchCreator[]; error: any };

type GetCreatorsProps = {
  search?: string | "";
  paginationInfo?: {
    lastDocId: string;
    searchScore: number;
    followerCount: number;
  };
  res?: Res;
};
const Creator = () => {
  const { sendNotification } = useAuthContext();

  const creatorList = useSelector((state: RootState) => state.creators);
  const user = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch();
  const [search, setSearch] = useState<string | null>(null);
  const [hasMoreCreator, setHasMoreCreator] = useState(true);

  const debouncedSearch = useDebounceEffect(search, 2000);
  const getCreatorUserList = async ({ paginationInfo }: GetCreatorsProps) => {
    if (!user) return;
    const res = await searchCreatorUser({
      user_id: user.userId,
      limit: 20,
      ...(paginationInfo && { paginationInfo }),
      search: search && search.length > 1 ? search : "",
    });

    if (res.status === 200) {
      console.log(res.data);
      if (res.data.length < 20) {
        setHasMoreCreator(false);
      }
      if (res.data.length > 0) {
        if (paginationInfo?.lastDocId) {
          dispatch(concatCreator([...creatorList, ...res.data]));
        } else {
          dispatch(concatCreator(res.data));
        }
      }
    } else {
      sendNotification({ type: "ERROR", message: res.error });
    }
  };

  const fetchMoreUser = async () => {
    const lastUser = creatorList[creatorList.length - 1];
    const lastDocId = lastUser?.userId;
    const searchScore = lastUser?.searchScore;
    const followerCount = lastUser?.counts.followerCount;
    if (searchScore)
      getCreatorUserList({
        paginationInfo: { lastDocId, searchScore, followerCount },
      });
  };

  useEffect(() => {
    if (search && search.length > 2) {
      dispatch(concatCreator([]));
      return;
    }
  }, [search, debouncedSearch]);

  useEffect(() => {
    creatorList.length == 0 && getCreatorUserList({});
  }, []);

  useEffect(() => {
    debouncedSearch !== null && getCreatorUserList({});
    setHasMoreCreator(true);
  }, [debouncedSearch]);

  useEffect(() => {
    if (search === "") {
      getCreatorUserList({});
      return;
    }
  }, [search]);
  return (
    <div className="flex w-full h-full flex-col">
      <div className="w-[100%] h-full border-r border-grey-500 flex flex-col">
        <div className="  py-4 px-5 flex flex-col gap-4">
          <div className="flex gap-3 items-center">
            <div className=" scale-90">
              <CreatorIcon />
            </div>
            <p className=" text-base">Creator</p>
          </div>

          <CustomInputTextField
            value={search ? search : ""}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              setSearch(e.target.value);
            }}
            StartIcon={
              <div className=" scale-75  text-grey-400">
                <SearchIcon />
              </div>
            }
            placeholder="Search Creator"
            className="text-sm py-2 "
          />
        </div>

        <Divider
          sx={{
            borderColor: theme.palette.grey[800],
          }}
        />
        <div
          className="px-5 py-4 flex flex-col gap-3 overflow-auto"
          id="creatorScrollableDiv"
        >
          <InfiniteScroll
            dataLength={creatorList.length}
            next={fetchMoreUser}
            hasMore={hasMoreCreator}
            loader={
              <div className="mt-4 text-common-white text-center w-full overflow-hidden">
                <CircularProgress size={20} className="text-common-white" />
              </div>
            }
            scrollableTarget="creatorScrollableDiv"
            style={hasMoreCreator ? {} : { overflow: "hidden" }}
          >
            {creatorList.map((creator, index) => {
              return (
                <div key={index} className="flex flex-col gap-3 pb-3 ">
                  <CreatorItem creator={creator} />
                  <Divider
                    sx={{
                      borderColor: theme.palette.grey[800],
                    }}
                  />
                  {/* {index != creatorsList.length - 1 ? (
                  <Divider
                    sx={{
                      borderColor: "#ffffff0b",
                    }}
                  />
                ) : null} */}
                </div>
              );
            })}
          </InfiniteScroll>
        </div>
      </div>
      {creatorList.length <= 0 && !hasMoreCreator && (
        <div className="absolute top-[40%] left-[20%]">
          <NoDataFound
            image={
              <div className="relative h-[120px] w-[120px]">
                <CustomImagePreview image={searchUserNotFound} />
              </div>
            }
            title="No Creator Found"
            description="Start Chatting with your witit friends!"
          />
        </div>
      )}
    </div>
  );
};

export default Creator;
