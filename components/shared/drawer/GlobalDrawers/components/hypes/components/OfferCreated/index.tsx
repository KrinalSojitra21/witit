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
import { useAuthContext } from "@/context/AuthContext";
import { readActivity } from "@/api/activity/readActivity";
import OfferItem from "./components/Offer";
import { getCreatedOffers } from "@/api/offering/getCreatedOffers";
import { Offer } from "@/types/offering";
import CustomButton from "@/components/shared/CustomButton";
import OutLinedAlertIcon from "@/utils/icons/shared/OutLinedAlertIcon";
import dayjs from "dayjs";
import ReportDialog from "@/components/shared/ReportDialog";
import { reportOffer } from "@/api/offering/reportOffer";
import { updateOfferAsUser } from "@/api/offering/updateOffer";
import { useDrawerContext } from "../../../../context/DrawerContext";

type GetUserCreatedOffersProps = {
  lastDocId?: string;
  status?: "ACCEPTED" | "ALL";
};

type StatusItem = {
  status: "ALL" | "ACCEPTED";
  name: string;
};

const docLimit = 20;
const statusList: StatusItem[] = [
  {
    status: "ALL",
    name: "All Offers",
  },
  {
    status: "ACCEPTED",
    name: "Active Offers",
  },
];

type HandleOfferActionsProps = {
  type: "CANCEL" | "REPORT";
  offerId: string;
};

export const OfferCreated = () => {
  const user = useSelector((state: RootState) => state.user);

  const { sendNotification, activityCounts } = useAuthContext();
  const { reportOfferId, setReportOfferId } = useDrawerContext();

  const [hasMoreOffers, setHasMoreOffers] = useState(true);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [currentOpenOfferId, setCurrentOpenOfferId] = useState<string | null>(
    null
  );
  const [activeTabStatus, setActiveTabStatus] = useState<"ALL" | "ACCEPTED">(
    "ALL"
  );

  const getUserCreatedOffers = async ({
    lastDocId,
    status,
  }: GetUserCreatedOffersProps) => {
    if (!user) return;

    const currentOffers = await getCreatedOffers({
      user_id: user.userId,
      ...(lastDocId && { lastDocId }),
      ...(status && { status }),
      limit: docLimit,
    });

    if (currentOffers.status === 200) {
      if (currentOffers?.data.length < docLimit) {
        setHasMoreOffers(false);
      }
      if (currentOffers.data.length > 0) {
        if (lastDocId) {
          setOffers([...offers, ...currentOffers.data]);
        } else {
          setOffers(currentOffers.data);
        }
      }
    } else {
      sendNotification({ type: "ERROR", message: currentOffers.error });
    }
  };


  const handleCancelOffer = async ({ offerId }: { offerId: string }) => {
    if (!user) return;

    const res = await updateOfferAsUser({
      user_id: user.userId,
      body: { status: "CANCELLED_BY_USER", offerId },
    });

    if (res.status === 200) {
      setOffers((prevOffers) => {
        return prevOffers.map((offer) => {
          if (offer.offerId === offerId) {
            return { ...offer, status: "CANCELLED_BY_USER" };
          }
          return offer;
        });
      });

      sendNotification({
        type: "SUCCESS",
        message: "Offer Cancelled Successfully",
      });
    } else {
      sendNotification({ type: "ERROR", message: res.error });
    }
  };

  const fetchMoreActivity = async () => {
    if (offers.length > 0) {
      const lastDocId = offers[offers.length - 1].offerId;
      getUserCreatedOffers({ lastDocId });
    }
  };

  const handleOfferAction = ({ type, offerId }: HandleOfferActionsProps) => {
    switch (type) {
      case "CANCEL":
        handleCancelOffer({ offerId });
        break;
      case "REPORT":
        setReportOfferId(offerId);
        break;

      default:
        break;
    }
    type;
  };

  useEffect(() => {
    setOffers([]);
    setCurrentOpenOfferId(null);
    setHasMoreOffers(true);
    getUserCreatedOffers({ status: activeTabStatus });
  }, [activeTabStatus]);

  return (
    <div className="flex flex-col overflow-auto h-full">
      <div className="flex gap-2 border-b border-grey-700">
        {statusList.map((item, index) => (
          <div
            className="cursor-pointer"
            key={index}
            onClick={() => setActiveTabStatus(item.status)}
          >
            <div
              className={`text-sm p-3 ${
                item.status === activeTabStatus ? "" : "text-grey-300"
              } `}
            >
              {item.name}
            </div>
            {item.status === activeTabStatus ? (
              <div className="w-full h-1 bg-primary-main" />
            ) : null}
          </div>
        ))}
      </div>
      {offers.length === 0 && !hasMoreOffers ? (
        <div className="  h-full flex flex-col items-center justify-center ">
          <NoDataFound
            title="No Offers Found"
            image={
              <div className="relative h-28 w-28">
                <CustomImagePreview image={blockUserIllustrator} />
              </div>
            }
          />
        </div>
      ) : (
        <div
          id="offerCreatedScrollableDiv"
          className="pb-5 flex-grow overflow-auto"
        >
          <InfiniteScroll
            dataLength={offers.length}
            next={fetchMoreActivity}
            hasMore={hasMoreOffers}
            loader={
              <div className="mt-4 text-common-black text-center w-full overflow-hidden">
                <CircularProgress size={20} className="text-common-white" />
              </div>
            }
            scrollableTarget="offerCreatedScrollableDiv"
          >
            <div className="flex flex-col py-2 gap-1 overflow-auto">
              {offers.map((offer, index) => {
                return (
                  <div key={index}>
                    <OfferItem
                      offer={offer}
                      setOffers={setOffers}
                      isNew={offer.isActiveNotification}
                      isOpen={currentOpenOfferId === offer.offerId}
                      handleSetCuuerntOfferId={(offerId) =>
                        setCurrentOpenOfferId(offerId)
                      }
                      handleOfferAction={handleOfferAction}
                    />
                  </div>
                );
              })}
            </div>
          </InfiniteScroll>
        </div>
      )}
    </div>
  );
};
