import { useAuthContext } from "@/context/AuthContext";
import { theme } from "@/theme";
import { Divider, IconButton } from "@mui/material";
import React, { useState } from "react";
import CreditTopBg from "@/utils/images/CreditTopBg.png";
import Image from "next/image";
import CloseIcon from "@/utils/icons/shared/CloseIcon";
import CreditIcon from "@/utils/icons/topbar/CreditIcon";
import Slider from "react-slick";
import CustomButton from "@/components/shared/CustomButton";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import sendCredit from "@/api/stripe/sendCredit";
import { generateArray } from "@/service/manageCredit/createCreditArray";
import CustomDialog from "@/components/shared/dialog/CustomDialog";
import { Message } from "@/types/message";
import TermsOfServices from "@/components/footerDialogs/TermsOfServices";
import PrivacyPolicy from "@/components/footerDialogs/PrivacyPolicy";
import CustomInsufficientCredit from "@/components/shared/CustomInsufficientCredit";

var sliderSettings = {
  centerMode: true,
  centerPadding: "60px",
  slidesToShow: 3,
  speed: 500,
  swipeToSlide: true,
  focusOnSelect: true,
};
type props = {
  messageId: string;
  creatorId: string;
  messages: Message[];
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
};

const CustomCreditMessageDrower = ({
  messageId,
  creatorId,
  messages,
  setMessages,
}: props) => {
  const [currentSlide, setCurrentSlide] = useState(10);
  const [policy, setPolicy] = useState<string | null>(null);
  const dispatch = useDispatch();
  const { customDialogType, setCustomDialogType } = useAuthContext();
  const finalArray = generateArray(10, 10000);
  const user = useSelector((state: RootState) => state.user);
  const { sendNotification } = useAuthContext();
  const [isnotEnoughCredit, setIsnotEnoughCredit] = useState<boolean>(false);
  const settings = {
    afterChange: (index: number) => {
      finalArray?.map((val, id) => {
        if (index === id) {
          setCurrentSlide(val);
        }
      });
    },
  };

  const postCredits = async () => {
    if (!user) {
      return;
    }
    const messageCredit = await sendCredit({
      creatorId,
      messageId,
      user_id: user?.userId,
      credit: currentSlide,
    });

    setCustomDialogType(null);

    if (messageCredit.status === 403) {
      setIsnotEnoughCredit(true);
      return;
    }
    sendNotification({ type: "ERROR", message: messageCredit.error });
  };

  const openGetCreditDialog = () => {
    setCustomDialogType("CREDITS-GETCREDITS");
  };

  const closeDialoag = () => {
    setIsnotEnoughCredit(false);
  };
  return (
    <>
      <CustomDialog
        isOpen={customDialogType != null}
        className="w-full max-w-[430px] h-fit  flex flex-col gap-5  max-h-[630px]  justify-start items-center"
      >
        {/* top common layout */}
        <div className="pb-5">
          <div className=" relative w-full flex flex-col  gap-5 ">
            <IconButton
              className=" absolute right-3 top-3 z-20 text-common-white"
              onClick={() => {
                setCustomDialogType(null);
              }}
            >
              <CloseIcon isBorderRounded={true} />
            </IconButton>
            <Image
              fill
              src={CreditTopBg}
              alt=""
              className=" h-[180px]   w-full relative  z-0 rounded-md "
            />

            <div className=" absolute bottom-[-28px] px-7 w-full">
              <div className=" h-14 bg-grey-800 border border-grey-700 py-4 px-6 rounded-xl flex justify-between items-center">
                <p className=" text-grey-300">Total Credit Balance</p>
                <div className=" flex items-end">
                  <p className=" text-lg tracking-widest align-bottom">
                    {user?.credit &&
                      user.credit.transferableCredit +
                        user.credit.nonTransferableCredit +
                        user.credit.tempCredit}
                  </p>
                  <div className=" scale-[0.65]">
                    <CreditIcon />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="w-full flex flex-col gap-1 ">
          <div className="min-h-[60px]  relative w-full flex flex-col justify-center items-center">
            <Divider
              sx={{
                borderColor: theme.palette.grey[500],
                width: "100%",
              }}
            />
            <CustomButton
              name="Credits Payable"
              className=" w-fit absolute rounded-full text-xs font-normal py-3 px-6 tracking-widest"
            />
          </div>
          <div className=" flex  w-full relative">
            <div className="h-[47px] w-[90px]  absolute left-[170px] z-0 top-[-2px] rounded-lg bg-[#26272c]"></div>
            <Slider
              {...settings}
              ref={(slider) => (slider = slider)}
              {...sliderSettings}
              className="slick-slider_center-mode  w-full flex flex-row"
            >
              {finalArray?.map((val, index) => {
                return (
                  <div
                    key={index}
                    className=" text-common-white text-center  flex justify-center"
                  >
                    <p className="w-fit py-3 px-3 cursor-pointer">{val}</p>
                  </div>
                );
              })}
            </Slider>
          </div>
        </div>

        <div className="w-full h-full  flex flex-col justify-between  px-5 ">
          <div className={` flex flex-col items-center py-2 pb-4 w-full `}>
            <CustomButton
              name="Send Credits"
              disabled={isnotEnoughCredit ? true : false}
              className={`py-3 text-sm font-normal w-[88%] ${
                isnotEnoughCredit && "bg-grey-800 text-common-white"
              }`}
              handleEvent={() => {
                postCredits();
              }}
            />
            <p className="pt-5 text-xs font-light text-grey-300 text-center">
              By submitting this request you agree to witit’s
            </p>
            <p className="text-xs font-light text-grey-300 text-center">
              <span
                className=" text-primary-main font-semibold pl-1 cursor-pointer"
                onClick={() => {
                  setPolicy("PRIVACY_POLICYS");
                }}
              >
                Privacy Policy
              </span>{" "}
              and
              <span
                className=" text-primary-main font-semibold pl-1 cursor-pointer"
                onClick={() => {
                  setPolicy("TERMS_OF_SERVICES");
                }}
              >
                Terms of Use
              </span>
            </p>
          </div>
        </div>
        {isnotEnoughCredit && (
          <div className="absolute  bottom-[2%] w-[80%]">
            <CustomInsufficientCredit
              onCancel={closeDialoag}
              handleEvent={openGetCreditDialog}
            />
          </div>
        )}
      </CustomDialog>

      {policy && (
        <CustomDialog
          isOpen={true}
          className="  min-h-[300px]  h-fit w-[600px]"
        >
          {policy === "TERMS_OF_SERVICES" ? (
            <TermsOfServices
              onCancel={() => {
                setPolicy(null);
              }}
            />
          ) : policy === "PRIVACY_POLICYS" ? (
            <PrivacyPolicy
              onCancel={() => {
                setPolicy(null);
              }}
            />
          ) : null}
        </CustomDialog>
      )}
    </>
  );
};

export default CustomCreditMessageDrower;
