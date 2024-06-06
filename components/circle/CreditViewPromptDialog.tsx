import { useAuthContext } from "@/context/AuthContext";
import { theme } from "@/theme";
import { Divider, IconButton } from "@mui/material";
import React from "react";
import CreditTopBg from "@/utils/images/CreditTopBg.png";
import Image from "next/image";
import CloseIcon from "@/utils/icons/shared/CloseIcon";
import CreditIcon from "@/utils/icons/topbar/CreditIcon";
import tempboy from "@/utils/images/tempboy.jpg";
import VerifiedIcon from "@/utils/icons/circle/VerifiedIcon";
import CustomButton from "@/components/shared/CustomButton";

import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import CustomDialog from "../shared/dialog/CustomDialog";

const CreditViewPromptDialog = () => {
  const { customDialogType, setCustomDialogType, setCustomDrawerType } =
    useAuthContext();

  const user = useSelector((state: RootState) => state.user);

  return (
    // customDialogType != null
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
                <p className=" text-lg tracking-widest align-bottom">10</p>
                <div className=" scale-[0.65]">
                  <CreditIcon />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full h-full  flex flex-col justify-between  px-5 ">
        {/* circle -> viewprompt */}
        <div className=" flex flex-col items-center gap-3 pb-5">
          <div className=" flex w-full justify-between items-center py-2">
            <p className=" ">Credit Amount</p>
            <div className="flex items-end">
              <p className="text-xl text-primary-main font-semibold">6.50</p>
              <div className=" scale-[0.6]">
                <CreditIcon />
              </div>
            </div>
          </div>
          <Divider
            sx={{
              borderStyle: "dashed",
              borderColor: theme.palette.grey[500],
              width: "100%",
            }}
          />
        </div>

        <div className=" flex flex-col gap-1 p-3">
          <div className="w-full flex gap-3  items-center">
            <Image
              fill
              src={tempboy}
              alt=""
              className=" w-12 h-12 border border-common-white rounded-full relative "
            />
            <div className="flex-1 flex flex-col justify-start">
              <div className="flex gap-1">
                <p className="text-base font-light">Gerdes</p>
                <div className=" text-primary-light scale-[0.65]">
                  <VerifiedIcon />
                </div>
              </div>
              <p className=" text-xs font-light tracking-wide text-grey-200 line-clamp-2">
                My favorite color is every color and none of the colors all at
                once but also it not even a moment. Does that definitely make
                sense?
              </p>
            </div>
          </div>
        </div>

        <div className=" flex flex-col items-center py-5 w-full">
          <CustomButton
            name="Send Credits"
            className="py-3 text-sm font-normal w-[88%]"
            handleEvent={() => {
              setCustomDialogType(null);
              setCustomDrawerType("CREDITDRAWER-VIEWPROMPT");
            }}
          />
          <p className="pt-5 text-xs font-light text-grey-300 text-center">
            By submitting this request you agree to witit’s
          </p>
          <p className="text-xs font-light text-grey-300 text-center">
            <span className=" text-primary-main font-semibold pl-1 cursor-pointer">
              Privacy Policy
            </span>{" "}
            and
            <span className=" text-primary-main font-semibold pl-1 cursor-pointer">
              Terms of Use
            </span>
          </p>
        </div>
      </div>
    </CustomDialog>
  );
};

export default CreditViewPromptDialog;
