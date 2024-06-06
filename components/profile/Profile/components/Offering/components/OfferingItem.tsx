import { CustomImagePreview } from "@/components/shared/CustomImagePreview";
import { OfferingData } from "@/types/offering";
import CasualCategoryIcon from "@/utils/icons/createPost/selectCategoryIcons/CasualCategoryIcon";
import LikeIcon from "@/utils/icons/shared/LikeIcon";
import React from "react";

interface OfferingItemProps {
  // Define the props for the OfferingItem component here
  setDialogType: React.Dispatch<
    React.SetStateAction<
      "VIEWOFFER" | "CREATEOFFER" | "CREATEOFFERDETAILS" | "EDITOFFERING" | null
    >
  >;
  setOpenOfferData: React.Dispatch<React.SetStateAction<OfferingData | null>>;
  offer: OfferingData;
  handleUpdateLikeStatus: (data: {
    offeringId: string;
    isLike: boolean;
  }) => void;
}

export const OfferingItem: React.FC<OfferingItemProps> = ({
  setDialogType,
  setOpenOfferData,
  offer,
  handleUpdateLikeStatus,
}) => {
  // Implement the logic for the OfferingItem component here

  return (
    <div
      className="rounded-xl bg-grey-800 flex flex-col gap-3 relative group transition-all duration-300 cursor-pointer"
      onClick={() => {
        setDialogType("VIEWOFFER");
        setOpenOfferData(offer);
      }}
    >
      <div className="p-2">
        <div
          onClick={() => {}}
          className={`bg-gradient-to-b from-[#121315] via-[#17181b00] to-[#17181b00] w-full h-full
                        flex absolute z-20 top-0 right-0 justify-end  p-3 rounded-md group-hover:opacity-100 opacity-0 transition-all duration-300`}
        >
          <div className="flex gap-2.5 items-center h-fit ">
            <div className="flex gap-1.5 items-center">
              <div
                className={` scale-[0.85] cursor-pointer ${
                  offer.isUserLike && "text-error-main"
                }`}
                onClick={(e) => {
                  e.stopPropagation();
                  handleUpdateLikeStatus({
                    offeringId: offer.offeringId,
                    isLike: !offer.isUserLike,
                  });
                }}
              >
                <LikeIcon isFilled={offer.isUserLike} />
              </div>
              <p>{offer.counts.like}</p>
            </div>
            <div className="flex gap-1.5 items-center">
              <div className=" scale-[0.65]">
                <CasualCategoryIcon />
              </div>
              <p>{offer.completeOffers}</p>
            </div>
          </div>
        </div>
        <div className="relative h-[200px] rounded-md overflow-hidden bg-grey-600">
          <CustomImagePreview image={offer.image[0]} />
        </div>
      </div>

      <div className=" flex flex-col gap-1.5 py-2 px-5">
        <p className=" font-normal tracking-widest  text-sm">{offer.name}</p>
        <p className=" text-grey-100 tracking-wider text-sm font-semibold">
          {offer.creditRange.avg} Credits
        </p>
      </div>
    </div>
  );
};

export default OfferingItem;
