import React from "react";
import SettingIcon from "@/utils/icons/levelUp/SettingIcon";
import DollerIcon from "@/utils/icons/levelUp/DollerIcon";
import AutomodeBlackIcon from "@/utils/icons/shared/AutomodeBlackIcon";
import SendIcon from "@/utils/icons/circle/SendIcon";
import VerifiedIcon from "@/utils/icons/circle/VerifiedIcon";
import AlertIcon from "@/utils/icons/levelUp/AlertIcon";
import FormIcon from "@/utils/icons/levelUp/FormIcon";
import CustomButton from "@/components/shared/CustomButton";
import Crown from "@/utils/icons/levelUp/Crown";

type Props = {
  setcurrentStep: React.Dispatch<React.SetStateAction<number>>;
};
const WhatYouGet = ({ setcurrentStep }: Props) => {
  return (
    <div className="h-full w-full flex flex-col gap-3 p-5 pb-0 justify-between">
      {" "}
      <div className=" flex flex-col gap-3">
        <div className=" items-start flex gap-4 ">
          <div className=" ">
            <SettingIcon />
          </div>
          <p className="font-light">
            Advanced{" "}
            <span className="  text-primary-main font-medium ">
              creation tools
            </span>
          </p>
        </div>
        <div className=" items-start flex gap-4 ">
          <div className=" ">
            <DollerIcon />
          </div>
          <p className="font-light">
            <span className="  text-primary-main font-medium ">Earn cash</span>{" "}
            from your AI, posts, prompts or through messaging
          </p>
        </div>
        <div className=" items-start flex gap-4 ">
          <div className=" scale-[0.65] ">
            <AutomodeBlackIcon />
          </div>
          <p className="font-light">
            <span className="  text-primary-main font-medium ">AI</span>{" "}
            yourself{" "}
            <span className="  text-primary-main font-medium ">into posts</span>{" "}
            on Witit
          </p>
        </div>
        <div className=" items-start flex gap-4 ">
          <div className=" scale-[0.65]">
            <SendIcon />
          </div>
          <p className="font-light">
            Get{" "}
            <span className="  text-primary-main font-medium ">
              20 photo creations a day
            </span>{" "}
            included with your subscription
          </p>
        </div>
        <div className=" items-start flex gap-4 ">
          <div className=" scale-75 ">
            <VerifiedIcon />
          </div>
          <p className="font-light">Get verified</p>
        </div>
        <div className=" items-start flex gap-4 ">
          <div className=" ">
            <AlertIcon />
          </div>
          <p className="font-light">
            <span className="  text-primary-main font-medium ">
              Create & View
            </span>{" "}
            Content with less restriction
          </p>
        </div>{" "}
        <div className=" items-start flex gap-4 ">
          <div className=" ">
            <FormIcon />
          </div>
          <p className="font-light">
            Create AI photos of your{" "}
            <span className="  text-primary-main font-medium ">pet, brand</span>{" "}
            or in your{" "}
            <span className="  text-primary-main font-medium ">
              art/photography style.
            </span>{" "}
          </p>
        </div>
      </div>
      <CustomButton
        startIcon={<Crown />}
        type="submit"
        name={"Go Pro With 20% OFF"}
        handleEvent={() => {
          setcurrentStep((prev) => prev + 1);
        }}
      />
    </div>
  );
};

export default WhatYouGet;
