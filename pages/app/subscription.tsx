import { ImageSliderAnimationShowBox } from "@/components/home/ImageSliderAnimationShowBox";
import CustomButton from "@/components/shared/CustomButton";
import SendIcon from "@/utils/icons/circle/SendIcon";
import VerifiedIcon from "@/utils/icons/circle/VerifiedIcon";
import AlertIcon from "@/utils/icons/levelUp/AlertIcon";
import DollerIcon from "@/utils/icons/levelUp/DollerIcon";
import FormIcon from "@/utils/icons/levelUp/FormIcon";
import SettingIcon from "@/utils/icons/levelUp/SettingIcon";
import AutomodeBlackIcon from "@/utils/icons/shared/AutomodeBlackIcon";
import Image from "next/image";
import React, { useEffect } from "react";
import companyLogo from "@/utils/images/witit.svg";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { CustomImagePreview } from "@/components/shared/CustomImagePreview";
import slothImage from "@/utils/images/sloth_image.jpg";
import { useRouter } from "next/router";

const AppSubscription = () => {
  const router = useRouter();

  const user = useSelector((state: RootState) => state.user);

  const handleSubmit = () => {
    if (!user) return;
    router.push("https://witit.com/" + user.userName);
  };

  return (
    <div className="w-full  h-full flex justify-center bg-common-white absolute top-0  z-20">
      <div className="relative flex w-full h-full min-h-fit min-w-[320px] lg:flex-row flex-col lg:justify-center justify-between items-center bg-secondary-main md:px-0  overflow-hidden">
        <div className="lg:w-[50vw] w-full h-full flex flex-col sm:gap-10 gap-5  sm:justify-end sm:pb-10 pb-32 sm:overflow-hidden overflow-auto ">
          <div className="w-full flex sm:justify-start justify-center xl:px-10 px-5 pt-5">
            <Image
              className="h-8 w-auto relative bg-transparent "
              fill
              src={companyLogo}
              alt="Company Logo"
            />
          </div>
          <div className="w-full relative sm:h-fit h-full sm:min-h-fit min-h-[500px] ">
            <div className="sm:hidden">
              <CustomImagePreview image={slothImage} />
            </div>
            <div className=" w-full h-full bg-gradient-to-t from-secondary-main  flex flex-col justify-end gap-3 relative z-20  xl:px-10 px-5">
              <div className=" text-3xl font-bold text-blue-light">
                Level up your AI
              </div>
              <p className="text-grey-200 text-sm font-light tracking-wide w-[70%] max-w-[500px]">
                Generate stunning AI-powered photos of yourself + unlock
                numerous additional benefits.
              </p>
              <p className=" text-base pt-3">
                Here’s what you get with Level Up AI
              </p>
              <div className=" max-w-[500px] w-[70%] h-[0.2rem] bg-gradient-to-r from-primary-main " />
            </div>
          </div>{" "}
          <div className=" flex flex-col gap-3 w-full  xl:px-10 px-5">
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
                <span className="  text-primary-main font-medium ">
                  Earn cash
                </span>{" "}
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
                <span className="  text-primary-main font-medium ">
                  into posts
                </span>{" "}
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
                <span className="  text-primary-main font-medium ">
                  pet, brand
                </span>{" "}
                or in your{" "}
                <span className="  text-primary-main font-medium ">
                  art/photography style.
                </span>{" "}
              </p>
            </div>
          </div>{" "}
          <div className=" xl:px-10 px-5 sm:relative absolute bottom-0 w-full sm:block flex justify-center sm:bg-secondary-main bg-grey-900 sm:py-0 z-20  py-10 ">
            <CustomButton
              name="Go Pro"
              className="max-w-[570px] py-3"
              onClick={handleSubmit}
            />
          </div>
        </div>
        <ImageSliderAnimationShowBox />
      </div>
    </div>
  );
};

export default AppSubscription;
