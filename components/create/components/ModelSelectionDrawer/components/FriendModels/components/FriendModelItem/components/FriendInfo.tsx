import { CustomImagePreview } from "@/components/shared/CustomImagePreview";
import { FriendModel } from "@/types/ai";
import ArrowDownIcon from "@/utils/icons/shared/ArrowDownIcon";
import { profilePlaceholderImage } from "@/utils/images";
import { IconButton } from "@mui/material";
import React from "react";

type Props = {
  isOpen: boolean;
  item: FriendModel;
};

export const FriendInfo = ({ isOpen, item }: Props) => {
  return (
    <>
      <div className="flex  gap-4 items-center">
        <div className="relative w-8 h-8 rounded-full overflow-hidden bg-grey-600">
          <CustomImagePreview
            image={item.profileImage ?? profilePlaceholderImage}
          />
        </div>
        <div className="flex flex-col">
          <p className="font-light text-grey-100 ">{item.userName}</p>
          <p className=" text-xs font-light text-grey-400">
            {item.models.length} {item.models.length > 1 ? "Models" : "Model"}
          </p>
        </div>
      </div>
      <IconButton
        className={`m-0 p-0 transition-all ${
          isOpen ? " rotate-180" : "rotate-0"
        }`}
      >
        <div className=" scale-[0.6] text-grey-300">
          <ArrowDownIcon />
        </div>
      </IconButton>
    </>
  );
};
