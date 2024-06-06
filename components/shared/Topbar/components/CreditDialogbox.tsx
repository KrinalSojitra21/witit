import { useAuthContext } from "@/context/AuthContext";
import { theme } from "@/theme";
import { Divider, IconButton } from "@mui/material";
import React, { useEffect, useState } from "react";
import CreditTopBg from "@/utils/images/CreditTopBg.png";
import Image from "next/image";
import CloseIcon from "@/utils/icons/shared/CloseIcon";
import CreditIcon from "@/utils/icons/topbar/CreditIcon";
import Slider from "react-slick";
import CustomButton from "@/components/shared/CustomButton";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { getAmountFromCredit } from "@/api/stripe/getAmountFromCredit";
import createCheckoutSession from "@/api/stripe/createCheckoutSession";
import { useRouter } from "next/router";
import withdrawCredit from "@/api/stripe/withdrawCredit";
import { generateArray } from "@/service/manageCredit/createCreditArray";
import CustomDialog from "../../dialog/CustomDialog";
import CustomLoadingButton from "../../CustomLoadingButton";
import TermsOfServices from "@/components/footerDialogs/TermsOfServices";
import PrivacyPolicy from "@/components/footerDialogs/PrivacyPolicy";
import CustomInsufficientCredit from "../../CustomInsufficientCredit";

var sliderSettings = {
  centerMode: true,
  centerPadding: "60px",
  slidesToShow: 3,
  speed: 500,
  swipeToSlide: true,
  focusOnSelect: true,
};

const CreditDialogbox = () => {
  const { customDialogType, setCustomDialogType, amountPerCredit } =
    useAuthContext();
  const { sendNotification } = useAuthContext();
  const user = useSelector((state: RootState) => state.user);
  const [currentSlide, setCurrentSlide] = useState(500);
  const [ListArray, setListArray] = useState<number[] | null>([]);
  const [isButtonLoading, setIsButtonLoading] = useState<boolean>(false);
  const [policy, setPolicy] = useState<string | null>(null);
  const [isnotEnoughCredit, setIsnotEnoughCredit] = useState<boolean>(false);

  const router = useRouter();
  const getCreditListArray = generateArray(500, 10000);
  const withdrawCreditListArray = generateArray(1000, 10000);

  const settings = {
    afterChange: (index: number) => {
      ListArray?.map((val, id) => {
        if (index === id) {
          setCurrentSlide(val);
        }
      });
    },
  };

  useEffect(() => {
    customDialogType === "CREDITS-GETCREDITS"
      ? setListArray(getCreditListArray)
      : (setListArray(withdrawCreditListArray), setCurrentSlide(1000));
  }, []);

  const getCredit = async () => {
    const url =
      window.location.protocol + "//" + window.location.host + "/setting";
    setIsButtonLoading(true);
    const response = await createCheckoutSession({
      credit: currentSlide,
      url: url,
      userid: user?.userId,
    });
    if (response.status === 200) {
      router.push(response.data?.sessionUrl);

      setIsButtonLoading(false);
      return;
    }
    sendNotification({
      type: "ERROR",
      message: response.error,
    });
  };

  const getwithdraw = async () => {
    setIsButtonLoading(true);
    const response = await withdrawCredit({
      credit: currentSlide,
      user_id: user?.userId,
    });
    if (response.status === 200) {
      setIsButtonLoading(false);
      sendNotification({
        type: "SUCCESS",
        message: "Credit Successfuly Withdrawal",
      });
      return;
    }
    if (response.status === 403) {
      setIsnotEnoughCredit(true);
      setIsButtonLoading(false);
      return;
    }

    setIsButtonLoading(false);
    sendNotification({
      type: "ERROR",
      message: response.error,
    });
  };
  const taxAmount = currentSlide * amountPerCredit.add * 0.029;
  const FinalAmount = currentSlide * amountPerCredit.add + taxAmount;
  if (!user || !user.credit) return <></>;
  const { tempCredit, nonTransferableCredit, transferableCredit } = user.credit;

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
        className="w-full max-w-[430px] h-fit   flex flex-col gap-3  max-h-[630px]  justify-start items-center"
      >
        {/* top common layout */}
        <div className="pb-5 relative">
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
                <p className=" text-grey-300">
                  {customDialogType === "CREDITS-GETCREDITS"
                    ? "Total"
                    : "Availabe"}{" "}
                  Credit Balance
                </p>
                <div className=" flex items-end">
                  <p className=" text-lg tracking-widest align-bottom">
                    {customDialogType === "CREDITS-GETCREDITS"
                      ? tempCredit + nonTransferableCredit + transferableCredit
                      : transferableCredit}
                  </p>
                  <div className=" scale-[0.65]">
                    <CreditIcon />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {customDialogType === "CREDITS-GETCREDITS" ||
        customDialogType === "CREDITS-WITHDRAW" ? (
          <div className="w-full flex flex-col gap-1 ">
            <div className="min-h-[60px]  relative w-full flex flex-col justify-center items-center">
              <Divider
                sx={{
                  borderColor: theme.palette.grey[500],
                  width: "100%",
                }}
              />
              <CustomButton
                name={
                  customDialogType === "CREDITS-GETCREDITS"
                    ? "Order Credits"
                    : "Withdraw Credits"
                }
                className=" w-fit absolute rounded-full text-xs font-normal py-3 px-6 tracking-widest"
              />
            </div>
            <div className=" flex  w-full snap-x relative">
              <div className="h-[47px] w-[90px]  absolute left-[170px] z-0 top-[-2px]  rounded-lg bg-[#26272c]"></div>
              <Slider
                {...settings}
                ref={(slider) => (slider = slider)}
                {...sliderSettings}
                className="slick-slider_center-mode  w-full flex flex-row "
              >
                {ListArray?.map((val, index) => {
                  return (
                    <div
                      key={index}
                      className=" text-common-white text-center  flex justify-center "
                    >
                      <p className="w-fit py-3 px-3 cursor-pointer">{val}</p>
                    </div>
                  );
                })}
              </Slider>
            </div>
          </div>
        ) : null}

        <div className="w-full h-full   flex flex-col justify-between  px-5  ">
          {/* topbar-> gretCredits */}
          {customDialogType === "CREDITS-GETCREDITS" ? (
            <div className="bg-grey-A700 flex flex-col rounded-xl ">
              <div className=" flex justify-between items-center px-10  pt-5">
                <p className=" text-sm">Credit Amount</p>
                <p className=" text-lg font-semibold">
                  ${(currentSlide * amountPerCredit.add).toFixed(2)}
                </p>
              </div>
              <div className=" flex justify-between items-center px-10">
                <p className=" text-grey-300">Tax @ 2.9%</p>
                <p className=" text-grey-300 text-base">
                  ${(currentSlide * amountPerCredit.add * 0.029).toFixed(2)}
                </p>
              </div>

              <div className=" flex justify-between items-center">
                <div className=" w-9 h-9 bg-grey-900 rounded-r-full ml-[-18px]" />
                <Divider
                  sx={{
                    borderStyle: "dashed",
                    borderColor: theme.palette.grey[500],
                    width: "85%",
                  }}
                />
                <div className=" w-9 h-9 bg-grey-900 rounded-l-full mr-[-18px]" />
              </div>
              <div className=" flex justify-between items-center px-10 pb-5">
                <p className=" ">Total Payable Amount</p>
                <p className=" text-xl text-primary-main font-semibold">
                  ${FinalAmount.toFixed(2)}
                </p>
              </div>
            </div>
          ) : null}

          {/* topbar-> withdrawal amount */}
          {customDialogType === "CREDITS-WITHDRAW" ? (
            <div className=" flex flex-col items-center gap-3">
              <p className=" text-grey-400 text-center text-xs">
                The balance must be over 1000 credits to be withdrawn.
              </p>
              <Divider
                sx={{
                  borderStyle: "dashed",
                  borderColor: theme.palette.grey[500],
                  width: "100%",
                }}
              />
              <div className=" flex w-full justify-between items-center">
                <p className=" ">Credit Amount</p>
                <p className=" text-xl text-primary-main font-semibold">
                  ${(currentSlide * amountPerCredit.withdraw).toFixed(2)}
                </p>
              </div>
              <Divider
                sx={{
                  borderStyle: "dashed",
                  borderColor: theme.palette.grey[500],
                  width: "100%",
                }}
              />
            </div>
          ) : null}

          <div className=" flex flex-col items-center py-5 w-full">
            <CustomLoadingButton
              loading={isButtonLoading}
              disabled={
                isnotEnoughCredit && customDialogType === "CREDITS-WITHDRAW"
                  ? true
                  : false
              }
              name={`${
                customDialogType === "CREDITS-GETCREDITS"
                  ? "Proceed To Payment"
                  : "Withdraw Credits"
              } `}
              className={`py-3 text-sm font-normal w-[88%] ${
                isnotEnoughCredit && customDialogType === "CREDITS-WITHDRAW"
                  ? "text-common-white bg-grey-800"
                  : ""
              }`}
              handleEvent={() => {
                if (customDialogType === "CREDITS-GETCREDITS") {
                  getCredit();
                  return;
                }
                getwithdraw();
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
              handleEvent={() => {
                openGetCreditDialog();
              }}
              onCancel={() => {
                closeDialoag();
              }}
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

export default CreditDialogbox;
