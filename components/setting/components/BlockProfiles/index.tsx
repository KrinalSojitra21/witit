import React, { useEffect, useState } from "react";
import { CircularProgress, Divider } from "@mui/material";
import { theme } from "@/theme";
import BlockItem from "./components/BlockItem";
import BlocklistIcon from "@/utils/icons/setting/BlocklistIcon";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { BlockedUser } from "@/types/user";
import { getBlocklist } from "@/api/user/getBlocklist";
import { useAuthContext } from "@/context/AuthContext";
import InfiniteScroll from "react-infinite-scroll-component";
import { blockOrUnblockUser } from "@/api/user/blockOrUnblockUser";
import { NoDataFound } from "@/components/shared/NoDataFound";
import { blockUSerNotFound } from "@/utils/images/setting";
import SettingBottomBar from "../Shared/SettingBottomBar";
import { CustomImagePreview } from "@/components/shared/CustomImagePreview";

type GetBlocklistProps = {
  lastDocId?: string;
};

type UnblockUserProps = {
  blockedUserId: string;
};

let docLimit = 20;

const BlockProfiles = () => {
  const user = useSelector((state: RootState) => state.user);

  const { sendNotification } = useAuthContext();

  const [blocklist, setBlocklist] = useState<BlockedUser[]>([]);
  const [hasMoreBlockUsers, setHasMoreBlockUsers] = useState(true);

  const handleGetAiModelApplications = async ({
    lastDocId,
  }: GetBlocklistProps) => {
    if (!user) return;

    const res = await getBlocklist({
      user_id: user.userId,
      limit: docLimit,
      ...(lastDocId && { lastDocId }),
    });

    if (res.status === 200) {
      const currentAiApplications = res.data;
      if (currentAiApplications.length < docLimit) {
        setHasMoreBlockUsers(false);
      }

      if (currentAiApplications.length > 0) {
        if (lastDocId) {
          setBlocklist((preApplications) => {
            return [...preApplications, ...currentAiApplications];
          });

          return;
        }
        setBlocklist((preApplications) => {
          return currentAiApplications;
        });
      }
      return;
    }

    sendNotification({ type: "ERROR", message: res.error });
  };

  const unblockUser = async ({ blockedUserId }: UnblockUserProps) => {
    if (!user) return;

    const res = await blockOrUnblockUser({
      user_id: user?.userId,
      data: {
        isBlock: false,
        blockedUserId,
      },
    });

    if (res.status === 200) {
      setBlocklist((preApplications) => {
        const newList = preApplications.filter(
          (item) => item.blockedUserInfo.userId !== blockedUserId
        );
        return newList;
      });

      return;
    }

    sendNotification({ type: "ERROR", message: res.error });
  };

  useEffect(() => {
    handleGetAiModelApplications({});

    return () => {
      handleGetAiModelApplications({});
    };
  }, []);

  const fetchMoreBlockUsers = async () => {
    const lastDocId = blocklist[blocklist.length - 1].blockListId;

    handleGetAiModelApplications({
      lastDocId,
    });
  };

  return (
    <div className="h-full flex flex-col">
      <div className="h-full flex flex-col bg-grey-900 rounded-lg">
        <div className="flex flex-col px-6 pt-6 gap-5">
          <div className="flex gap-5 items-center">
            <div className="text-error-main">
              <BlocklistIcon />
            </div>
            <p className="text-sm tracking-wider">Block Profiles</p>
          </div>
          <Divider
            sx={{
              borderColor: theme.palette.grey[500],
            }}
          />
        </div>
        <div id="blocklistScrollableDiv">
          <InfiniteScroll
            dataLength={blocklist.length}
            next={fetchMoreBlockUsers}
            hasMore={hasMoreBlockUsers}
            loader={
              <div className="mt-4 text-common-black text-center w-full overflow-hidden">
                <CircularProgress size={20} className="text-common-white" />
              </div>
            }
            scrollableTarget="blocklistScrollableDiv"
            className="overflow-auto flex flex-col gap-4 px-6 pt-3 pb-6"
          >
            {blocklist.map((item, index) => (
              <div key={index} className=" flex flex-col">
                <BlockItem blockedUser={item} unblockUser={unblockUser} />
                <div className="flex flex-col pt-3">
                  <Divider
                    sx={{
                      borderColor: theme.palette.grey[700],
                    }}
                  />
                </div>
              </div>
            ))}
          </InfiniteScroll>
        </div>
        {blocklist.length < 1 && !hasMoreBlockUsers && (
          <div className="w-full h-full flex justify-center items-center">
            <NoDataFound
              image={
                <div className="relative h-[90px] w-[90px]">
                  <CustomImagePreview image={blockUSerNotFound} />
                </div>
              }
              title="No Blocked Profiles"
            />
          </div>
        )}
      </div>
      <div className="mt-4">
        <SettingBottomBar />
      </div>
    </div>
  );
};

export default BlockProfiles;
