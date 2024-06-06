import React, { useEffect, useState } from "react";
import { CircularProgress, Grid } from "@mui/material";
import Image from "next/image";
import temp1 from "@/utils/images/temp1.jpg";
import CreateOfferIcon from "@/utils/icons/profile/CreateOfferIcon";
import LikeIcon from "@/utils/icons/shared/LikeIcon";
import CasualCategoryIcon from "@/utils/icons/createPost/selectCategoryIcons/CasualCategoryIcon";
import { useAuthContext } from "@/context/AuthContext";
import CreateOfferDialog from "./components/CreateOfferDialog";
import { ComingSoon } from "@/components/shared/ComingSoon";
import { defaultImageConstant } from "@/utils/constants/withoutHtml/appConstant";
import { getOfferings } from "@/api/offering/getOfferings";
import { OfferingData } from "@/types/offering";
import InfiniteScroll from "react-infinite-scroll-component";
import changeOfferingLikeStatus from "@/api/offering/changeOfferingLikeStatus";
import { useRouter } from "next/router";
import { NoDataFound } from "@/components/shared/NoDataFound";
import { CustomImagePreview } from "@/components/shared/CustomImagePreview";
import { questionNotFound } from "@/utils/images/question";
import OfferingItem from "./components/OfferingItem";
import PlusIcon from "@/utils/icons/shared/PlusIcon";

const styles = {
  responsiveGrid: {
    xxl: 3,
    xl: 4,
    lg: 6,
    md: 12,
    sm: 12,
    xs: 12,
  },
};

type GetData = {
  lastDocId?: string;
  lastPendingOffers?: number;
};
const Offering = () => {
  const router = useRouter();
  const { user } = router.query;

  const {
    setCustomDialogType,
    setCroppingImage,
    firebaseUser,
    sendNotification,
  } = useAuthContext();

  const [isOfferHoverd, setisOfferHoverd] = useState({
    isHover: false,
    index: 0,
  });
  const [dialogType, setDialogType] = useState<
    "VIEWOFFER" | "CREATEOFFER" | "CREATEOFFERDETAILS" | "EDITOFFERING" | null
  >(null);
  const [offeringData, setOfferingData] = useState<OfferingData[]>([]);
  const [hasMoreOffering, setHasMoreOffering] = useState(true);
  const [openOfferData, setOpenOfferData] = useState<OfferingData | null>(null);

  const getData = async ({ lastDocId, lastPendingOffers }: GetData) => {
    if (!firebaseUser) return;
    const limit = 10;
    const respons = await getOfferings({
      limit,
      user_id: firebaseUser?.uid,
      lastDocId,
      lastPendingOffers,
      otherUserId: user as string,
    });
    if (respons.status === 200) {
      if (respons.data.length < 10) {
        setHasMoreOffering(false);
      }
      setOfferingData(respons.data);
    }
  };
  useEffect(() => {
    setOfferingData([]);
    getData({});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router]);

  const fetchMorePost = async () => {
    if (offeringData.length > 0) {
      const lastDocId = offeringData[offeringData.length - 1].offeringId;
      const lastPendingOffers =
        offeringData[offeringData.length - 1].pendingOffers;
      getData({ lastDocId, lastPendingOffers });
    }
  };

  const handleUpdateLikeStatus = async ({
    offeringId,
    isLike,
  }: {
    offeringId: string;
    isLike: boolean;
  }) => {
    if (!firebaseUser) return;
    const offeringUpdateLikeData = {
      offeringId,
      isLike: isLike,
    };
    const respons = await changeOfferingLikeStatus({
      offeringUpdateLikeData,
      user_id: firebaseUser.uid,
    });
    if (respons.status === 200) {
      setOfferingData((prevOfferings) => {
        return prevOfferings.map((offering) => {
          if (offering.offeringId === offeringId) {
            return {
              ...offering,
              counts: {
                ...offering.counts,
                like: isLike
                  ? offering.counts.like + 1
                  : offering.counts.like - 1,
              },
              isUserLike: isLike,
            };
          } else {
            return offering;
          }
        });
      });
      setOpenOfferData((prevOffer) => {
        if (!prevOffer) return null;
        if (prevOffer.offeringId === offeringId) {
          return {
            ...prevOffer,
            counts: {
              ...prevOffer.counts,
              like: isLike
                ? prevOffer.counts.like + 1
                : prevOffer.counts.like - 1,
            },
            isUserLike: isLike,
          };
        } else {
          return prevOffer;
        }
      });
    } else {
      sendNotification({ type: "ERROR", message: respons.error });
    }
  };

  return (
    <div className="w-full h-full flex items-center justify-center">
      <ComingSoon />
    </div>
  );

  if (offeringData.length === 0 && !hasMoreOffering) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <NoDataFound
          title="No Offers Found"
          image={
            <div className="relative w-20 h-20 ">
              <CustomImagePreview image={questionNotFound} />
            </div>
          }
          // description=" It looks like nobody has asked a question yet. Lets wait for the first one!"
        />
      </div>
    );
  }

  return (
    <div className="relative h-full overflow-auto mt-3">
      <CreateOfferDialog
        dialogType={dialogType}
        setDialogType={setDialogType}
        openOfferData={openOfferData}
        setOpenOfferData={setOpenOfferData}
        setOfferingData={setOfferingData}
        handleUpdateLikeStatus={handleUpdateLikeStatus}
      />
      <div
        className="flex flex-grow  px-5 overflow-auto [&>div]:w-full"
        id="offeringScrollableDiv"
      >
        <InfiniteScroll
          dataLength={offeringData.length}
          next={fetchMorePost}
          hasMore={hasMoreOffering}
          loader={
            <div className="mt-4 text-common-white text-center w-full overflow-hidden">
              <CircularProgress size={20} className="text-common-white" />
            </div>
          }
          scrollableTarget="offeringScrollableDiv"
          className="w-full"
          style={{ width: "100%", overflow: hasMoreOffering ? "" : "hidden" }}
        >
          <Grid container columns={12} spacing={2}>
            {offeringData.map((offer, index) => {
              return (
                <Grid item {...styles.responsiveGrid} key={index}>
                  <OfferingItem
                    offer={offer}
                    setDialogType={setDialogType}
                    handleUpdateLikeStatus={handleUpdateLikeStatus}
                    setOpenOfferData={setOpenOfferData}
                  />
                </Grid>
              );
            })}
          </Grid>
        </InfiniteScroll>
      </div>
      <div
        onClick={() => {
          setDialogType("CREATEOFFER");
        }}
        className="group bg-primary-main absolute p-3 rounded-full bottom-8 right-8 shadow-md flex items-center gap-3 cursor-pointer"
      >
        <PlusIcon />
        <p className="text-common-white text-sm tracking-wider w-fit group-hover:flex hidden transition-all duration-[800ms]">
          Create Offering
        </p>
      </div>
    </div>
  );
};

export default Offering;
