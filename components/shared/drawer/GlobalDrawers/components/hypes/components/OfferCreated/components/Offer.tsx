import React, { SetStateAction, useState } from "react";
import { CustomImagePreview } from "@/components/shared/CustomImagePreview";
import { Activity } from "@/types/activity";
import { profilePlaceholderImage } from "@/utils/images";
import { getRecentTimeFromTimeStamp } from "@/service/shared/getRecentTimeFromTimeStamp";
import { Offer } from "@/types/offering";
import CreditIcon from "@/utils/icons/topbar/CreditIcon";
import dayjs from "dayjs";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { useAuthContext } from "@/context/AuthContext";
import { getOfferNotifications } from "@/api/offering/getOfferNotifications";
import { readOfferNotifications } from "@/api/offering/readOfferNotifications";
import { CircularProgress } from "@mui/material";
import { CalenderIcon } from "@/utils/icons/topbar/CalenderIcon";
import CustomButton from "@/components/shared/CustomButton";
import OutLinedAlertIcon from "@/utils/icons/shared/OutLinedAlertIcon";

const bottomDivContent = [
  {
    status: "COMPLETED",
    text: "Your offer has been Completed. If not you can report on this user.",
    hasButton: true,
  },
  {
    status: "ACCEPTED",
    text: "Your offer has been Accepted. Enjoy your offer!!",
    hasButton: false,
  },
];

type HandleOfferActionsProps = {
  type: "CANCEL" | "REPORT";
  offerId: string;
};

type Props = {
  offer: Offer;
  isNew: boolean;
  isOpen: boolean;
  handleSetCuuerntOfferId: (offerId: string | null) => void;
  setOffers: React.Dispatch<React.SetStateAction<Offer[]>>;
  handleOfferAction: ({ type, offerId }: HandleOfferActionsProps) => void;
};

type CurrentActivity = {
  isFetched: boolean;
  activities: Activity[];
};

const OfferItem = ({
  offer,
  isNew,
  setOffers,
  isOpen,
  handleSetCuuerntOfferId,
  handleOfferAction,
}: Props) => {
  const user = useSelector((state: RootState) => state.user);

  const { sendNotification } = useAuthContext();

  const { status, createdAt, offering } = offer;
  const item = {
    text:
      status !== "CANCELLED_BY_USER"
        ? status[0] + status.slice(1).toLowerCase()
        : "Cancelled",
    textColor:
      status === "ACCEPTED"
        ? "text-green-main"
        : status === "COMPLETED"
        ? "text-primary-main"
        : status === "REPORTED"
        ? "text-common-white"
        : status === "REFUNDED"
        ? "text-blue-light"
        : status === "PENDING"
        ? "text-orange-main"
        : status === "REJECTED" || status === "CANCELLED_BY_USER"
        ? "text-error-main"
        : "",
    bgColor:
      status === "ACCEPTED"
        ? "bg-green-main"
        : status === "COMPLETED"
        ? "bg-primary-main"
        : status === "REPORTED"
        ? "bg-common-white"
        : status === "REFUNDED"
        ? "bg-blue-light"
        : status === "PENDING"
        ? "bg-orange-main"
        : status === "REJECTED" || status === "CANCELLED_BY_USER"
        ? "bg-error-main"
        : "",
  };

  const [currentActivity, setCurrentActivity] = useState<CurrentActivity>({
    isFetched: false,
    activities: [],
  });

  const getUserOfferNotification = async () => {
    if (!user || currentActivity.isFetched) return;

    const result = await getOfferNotifications({
      user_id: user.userId,
      offerId: offer.offerId,
      limit: 20,
    });

    if (result.status === 200) {
      setCurrentActivity({ isFetched: true, activities: result.data });

      if (isNew) {
        const result = await readOfferNotifications({
          user_id: user.userId,
          offerId: offer.offerId,
        });
        if (result.status !== 200) {
          sendNotification({ type: "ERROR", message: result.error });
        }
        setOffers((offers) =>
          offers.map((data) => {
            if (data.offerId === offer.offerId) {
              return {
                ...data,
                isActiveNotification: false,
              };
            }
            return data;
          })
        );
      }
    } else {
      sendNotification({ type: "ERROR", message: result.error });
    }
  };

  const handleOpenOffer = () => {
    if (!isOpen) {
      getUserOfferNotification();
      handleSetCuuerntOfferId(offer.offerId);
    } else {
      handleSetCuuerntOfferId(null);
    }
  };

  return (
    <>
      <div className={`${isOpen ? "bg-grey-800" : ""} py-3 px-2`}>
        <div className=" flex flex-col w-full items-start gap-3 pr-5">
          <div
            className="flex items-center gap-4 cursor-pointer w-full"
            onClick={() => {
              handleOpenOffer();
            }}
          >
            <div
              className={`min-w-[6px] h-[6px] ${
                isNew ? "bg-primary-main" : "bg-transparent-main"
              }  rounded-full`}
            />
            <div className="relative min-w-[46px] h-[46px] rounded-lg overflow-hidden bg-grey-600 shadow-[#00000080] shadow-xl">
              <CustomImagePreview
                image={offering.image[0] ?? profilePlaceholderImage}
              />
            </div>
            <div className="flex justify-between items-center gap-4 w-full h-[46px] cursor-pointer z-10">
              <div className="flex flex-col gap-1 max-w-[85%]">
                <p className="text-sm font-medium">{offering.name} </p>
                {offering.completeOffers > 0 ? (
                  <span className="text-grey-300 text-xs tracking-wide">
                    {offering.completeOffers + " Joiners"}
                  </span>
                ) : null}
              </div>
              <div
                className={`${item.bgColor} ${item.textColor} bg-opacity-10 py-2 px-2.5 text-sm font-medium rounded-md`}
              >
                {item.text}
              </div>
            </div>
          </div>
          {isOpen ? (
            <div className="pl-20 w-full">
              <div className="flex justify-between items-center p-2 h-10 border-t border-grey-600">
                <div className="flex items-center gap-1 text-grey-200">
                  <div className="scale-75 text-grey-200">
                    <CreditIcon />
                  </div>
                  <p className="text-xs">{offer.credit} Credits</p>
                </div>
                <div className="h-[20px] w-[1px] bg-grey-500" />
                <div className="flex items-center gap-1 text-grey-200">
                  <div className="scale-90 text-grey-200">
                    <CalenderIcon />
                  </div>
                  <p className="text-xs">
                    {dayjs(offer.offerDate * 1000).format("DD MMM, YYYY")}
                  </p>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                {!currentActivity.isFetched ? (
                  <div className="mt-4 text-common-black text-center w-full overflow-hidden">
                    <CircularProgress size={20} className="text-common-white" />
                  </div>
                ) : currentActivity.activities.length > 0 ? (
                  currentActivity.activities.map((item, index) => {
                    const { activity } = item;
                    return (
                      <div
                        key={index}
                        className="flex items-start gap-2 border border-grey-700 rounded-md p-2"
                      >
                        <div className="min-w-[46px] h-[46px] relative rounded-lg overflow-hidden bg-grey-600 shadow-[#00000080] shadow-xl">
                          <CustomImagePreview image={activity.frontImage} />
                        </div>
                        <div>
                          <p className="text-xs font-medium">
                            {activity.title}{" "}
                            {activity.message ? (
                              <span className="text-grey-100 text-xs font-light tracking-wide">
                                {activity.message}
                              </span>
                            ) : null}
                          </p>
                          <p className="text-[10px] text-grey-300 mt-0.5">
                            {getRecentTimeFromTimeStamp(createdAt)}
                          </p>
                        </div>
                      </div>
                    );
                  })
                ) : null}
              </div>
            </div>
          ) : null}
        </div>
      </div>
      {bottomDivContent.find((d) => d.status === offer.status) && isOpen ? (
        <div className="flex gap-2 items-center justify-center px-7 py-4 bg-grey-900 border-t border-grey-700">
          <p className="text-xs text-grey-300">
            {bottomDivContent.find((d) => d.status === offer.status)?.text}
          </p>
          {bottomDivContent.find((d) => d.status === offer.status)
            ?.hasButton ? (
            <CustomButton
              name="Report"
              startIcon={
                <div className="scale-90">
                  <OutLinedAlertIcon />
                </div>
              }
              className="py-1 px-6 text-sm bg-error-light w-max"
              handleEvent={() =>
                handleOfferAction({ type: "REPORT", offerId: offer.offerId })
              }
            />
          ) : null}
        </div>
      ) : null}
      {offer.status === "ACCEPTED" && offer.isReschedule ? (
        <div className="pl-[90px] pr-7">
          <div
            className={`flex gap-2 justify-end ${
              isOpen ? "" : "border-t border-grey-700"
            }  pt-2`}
          >
            <p className="text-xs py-2 px-3 border border-common-white border-opacity-10 rounded-md w-fit">
              Rescheduled on{" "}
              {dayjs(offer.offerDate * 1000).format("DD MMM, YYYY")}
            </p>
            <CustomButton
              name="Cancel"
              className="py-1 px-3 text-xs bg-grey-700 w-max"
              handleEvent={() =>
                handleOfferAction({ type: "CANCEL", offerId: offer.offerId })
              }
            />
          </div>
        </div>
      ) : null}
    </>
  );
};

export default OfferItem;
