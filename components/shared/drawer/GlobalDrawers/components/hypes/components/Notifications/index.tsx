import { getActivity } from "@/api/activity/getActivity";
import { CustomImagePreview } from "@/components/shared/CustomImagePreview";
import { NoDataFound } from "@/components/shared/NoDataFound";
import { RootState } from "@/redux/store";
import { Activity } from "@/types/activity";
import { blockUserIllustrator } from "@/utils/images";
import { CircularProgress } from "@mui/material";
import router from "next/router";
import { useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { useSelector } from "react-redux";
import HypesItem from "./components/HypesItem";
import { useAuthContext } from "@/context/AuthContext";
import { readActivity } from "@/api/activity/readActivity";

export const Notifications = () => {
  const user = useSelector((state: RootState) => state.user);

  const { sendNotification, activityCounts } = useAuthContext();

  const [hasMoreActivity, setHasMoreActivity] = useState(true);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [count, setCount] = useState(0);

  const getUserActivity = async ({ lastDocId }: { lastDocId?: string }) => {
    if (!user) return;
    const hypeAct = await getActivity({
      user_id: user.userId,
      ...(lastDocId && { lastDocId }),
      limit: 20,
    });

    if (hypeAct.status === 200) {
      if (hypeAct?.data.length < 20) {
        setHasMoreActivity(false);
      }
      if (hypeAct.data.length > 0) {
        if (lastDocId) {
          setActivities([...activities, ...hypeAct.data]);
        } else {
          setActivities(hypeAct.data);

          // read activity if unread count is greater than 0
          if (count > 0) {
            const result = await readActivity({ user_id: user.userId });
            if (result.status !== 200) {
              sendNotification({ type: "ERROR", message: result.error });
            }
          }
        }
      }
    } else {
      sendNotification({ type: "ERROR", message: hypeAct.error });
    }
  };

  useEffect(() => {
    setActivities([]);
    getUserActivity({});
  }, []);

  useEffect(() => {
    if (!activityCounts) return;
    setCount(activityCounts.notification);
  }, [activityCounts]);

  const fetchMoreActivity = async () => {
    const lastDocId = activities[activities.length - 1].activityId;
    getUserActivity({ lastDocId });
  };

  const handleParems = (hype: Activity) => {
    if (
      [
        "USER_GENERATION_NOTIFICATION",
        "GENERATION_NOTIFICATION",
        "CREATOR_GENERATION_NOTIFICATION",
      ].includes(hype.activityType)
    ) {
      router.push("/create");
    } else if (
      hype.activityType === "POST_NOTIFICATION" &&
      hype.action.postId
    ) {
      router.push(`/discover/post?postId=${hype.action.postId}`);
    } else if (hype.activityType === "CREATOR_NOTIFICATION") {
      router.push("/setting");
    } else if (
      [
        "CREDIT_NOTIFICATION",
        "QUESTION_NOTIFICATION",
        "USER_NOTIFICATION",
      ].includes(hype.activityType)
    ) {
      router.push("/profile");
    }
  };

  if (activities.length === 0 && !hasMoreActivity)
    return (
      <div className="  h-full flex flex-col items-center justify-center ">
        <NoDataFound
          title="No Activity Found"
          image={
            <div className="relative h-28 w-28">
              <CustomImagePreview image={blockUserIllustrator} />
            </div>
          }
        />
      </div>
    );

  return (
    <div id="hypeScrollableDiv" className="pb-5 flex-grow overflow-auto">
      <InfiniteScroll
        dataLength={activities.length}
        next={fetchMoreActivity}
        hasMore={hasMoreActivity}
        loader={
          <div className="mt-4 text-common-black text-center w-full overflow-hidden">
            <CircularProgress size={20} className="text-common-white" />
          </div>
        }
        scrollableTarget="hypeScrollableDiv"
      >
        <div className="flex flex-col gap-7 py-6 px-2 overflow-auto">
          {activities.map((notification, index) => {
            return (
              <>
                <div
                  key={index}
                  onClick={() => {
                    handleParems(notification);
                  }}
                >
                  <HypesItem
                    notification={notification}
                    isNew={count > index}
                  />
                </div>
                {count === index + 1 ? (
                  <div className="bg-grey-700 w-full h-[1px]" />
                ) : null}
              </>
            );
          })}
        </div>
      </InfiniteScroll>
    </div>
  );
};
