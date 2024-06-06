import { getFriendAiModels } from "@/api/ai/getFriendAiModels";
import CustomInputTextField from "@/components/shared/CustomInputTextField";
import { useAuthContext } from "@/context/AuthContext";
import { RootState } from "@/redux/store";
import SearchIcon from "@/utils/icons/topbar/SearchIcon";
import React, { ChangeEvent, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FriendModelItem } from "./components/FriendModelItem";
import InfiniteScroll from "react-infinite-scroll-component";
import { CircularProgress } from "@mui/material";
import ArrowDownIcon from "@/utils/icons/shared/ArrowDownIcon";
import { updateModels } from "@/redux/slices/modelSlice";

type Props = {
  handleScrollTop: () => void;
};

type LastDoc = {
  lastDocId: string;
  searchScore: number;
};

type GetFriendModelProps = {
  lastDoc?: LastDoc;
  search: string;
};

let docLimit = 10;

export const FriendModelContainer = ({ handleScrollTop }: Props) => {
  const dispatch = useDispatch();

  const user = useSelector((state: RootState) => state.user);
  const models = useSelector((state: RootState) => state.models);

  const { sendNotification } = useAuthContext();

  const [hasMoreModel, setHasMoreModel] = useState(true);
  const [friendSearch, setFriendSearch] = useState("");

  const ref = useRef<HTMLDivElement | null>(null);

  const getFriendModels = async ({ lastDoc, search }: GetFriendModelProps) => {
    if (!user) return;

    const res = await getFriendAiModels({
      user_id: user.userId,
      limit: docLimit,
      ...(lastDoc && { lastDoc }),
      search,
    });

    if (res.status === 200) {
      const currentFriendModelList = res.data.friendsModelList;
      if (currentFriendModelList.length < docLimit) {
        setHasMoreModel(false);
      }

      if (currentFriendModelList.length > 0) {
        if (lastDoc) {
          if (models.friendModelList !== currentFriendModelList) {
            dispatch(
              updateModels({
                friendModelList: [
                  ...models.friendModelList,
                  ...currentFriendModelList,
                ],
              })
            );
          }
          return;
        }
        dispatch(updateModels({ friendModelList: currentFriendModelList }));
      }
      return;
    }

    sendNotification({ type: "ERROR", message: res.error });
  };

  useEffect(() => {
    let timerId: any;

    clearTimeout(timerId);

    timerId = setTimeout(() => {
      setHasMoreModel(true);
      dispatch(updateModels({ friendModelList: [] }));
      getFriendModels({ search: friendSearch });
    }, 1000);

    return () => {
      clearTimeout(timerId);
    };
  }, [friendSearch]);

  const fetchMoreModel = async () => {
    const lastDoc = {
      lastDocId: friendModelList[friendModelList.length - 1].userId,
      searchScore: friendModelList[friendModelList.length - 1].searchScore,
    };

    getFriendModels({
      lastDoc,
      search: friendSearch,
    });
  };

  const { friendModelList = [] } = models;

  return (
    <div ref={ref} className="bg-secondary-main z-[1]">
      <div className="pt-2 pb-1 bg-secondary-main sticky top-[5.5rem] z-20">
        <div className="flex items-center justify-between">
          <p className="">Friends Model</p>
          <div className={`scale-[0.65]`} onClick={() => handleScrollTop()}>
            <ArrowDownIcon />
          </div>
        </div>
        <CustomInputTextField
          className="my-2 py-2 rounded-xl"
          StartIcon={
            <div className=" scale-75 text-grey-400">
              <SearchIcon />
            </div>
          }
          placeholder="Search Model"
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setFriendSearch(e.target.value)
          }
        />
      </div>
      <div id="friendModelScrollableDiv" className="pb-5 overflow-auto">
        <InfiniteScroll
          dataLength={friendModelList.length}
          next={fetchMoreModel}
          hasMore={hasMoreModel}
          loader={
            <div className="mt-4 text-common-black text-center w-full overflow-hidden">
              <CircularProgress size={20} className="text-common-white" />
            </div>
          }
          scrollableTarget="friendModelScrollableDiv"
        >
          {friendModelList.map((item, index) => (
            <FriendModelItem key={index} item={item} />
          ))}
        </InfiniteScroll>
      </div>
    </div>
  );
};
