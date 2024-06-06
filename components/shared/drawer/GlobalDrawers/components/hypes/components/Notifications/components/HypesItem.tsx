import React from "react";
import { CustomImagePreview } from "@/components/shared/CustomImagePreview";
import { Activity } from "@/types/activity";
import { profilePlaceholderImage } from "@/utils/images";
import { getRecentTimeFromTimeStamp } from "@/service/shared/getRecentTimeFromTimeStamp";

type Props = {
  notification: Activity;
  isNew: boolean;
};

const HypesItem = ({ notification, isNew }: Props) => {
  const { activity, createdAt } = notification;

  return (
    <div className=" flex w-full justify-between items-center gap-3 cursor-pointer">
      <div className="flex items-center gap-4 ">
        <div
          className={`w-[6px] h-[6px] ${
            isNew ? "bg-primary-main" : "bg-transparent-main"
          }  rounded-full`}
        />
        <div className="relative min-w-[46px] h-[46px] rounded-lg overflow-hidden bg-grey-600 shadow-[#00000080] shadow-xl">
          <CustomImagePreview
            image={activity.frontImage ?? profilePlaceholderImage}
          />
        </div>
        <div className="flex flex-col gap-0.5 max-w-[85%]">
          <p className="text-sm font-medium">
            {activity.title}{" "}
            {activity.message ? (
              <span className="text-grey-100 text-xs font-light tracking-wide">
                {activity.message}
              </span>
            ) : null}
          </p>
          <p className="text-[12px] text-grey-300">
            {getRecentTimeFromTimeStamp(createdAt)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default HypesItem;
