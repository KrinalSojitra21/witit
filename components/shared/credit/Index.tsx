import { theme } from "@/theme";
import VerifiedIcon from "@/utils/icons/circle/VerifiedIcon";
import CloseIcon from "@/utils/icons/shared/CloseIcon";
import CreditIcon from "@/utils/icons/topbar/CreditIcon";
import { IconButton, Divider } from "@mui/material";
import React, { useState } from "react";
import Slider from "react-slick";
import CustomButton from "../CustomButton";
import CustomToggleSwitch from "../CustomToggleSwitch";
import CustomDialog from "../dialog/CustomDialog";
import { CustomImagePreview } from "../CustomImagePreview";
import CreditTopBg from "@/utils/images/CreditTopBg.png";
import appConstant from "@/utils/constants/withoutHtml/appConstant";
import { UserBaseInfo } from "@/types/user";
import { RootState } from "@/redux/store";
import { useSelector } from "react-redux";

type Props = {
  creditDialogInfo: {
    userInfo: UserBaseInfo;
    postId: string;
  } | null;
  setCreditDialogInfo: React.Dispatch<
    React.SetStateAction<{
      userInfo: UserBaseInfo;
      postId: string;
      isPostAccessed: boolean;
    } | null>
  >;
  children?: React.ReactNode;
};
const Creadit = ({
  children,
  creditDialogInfo,
  setCreditDialogInfo,
}: Props) => {
  const user = useSelector((state: RootState) => state.user);

  return (
    <CustomDialog
      isOpen={creditDialogInfo ? true : false}
      className="w-full max-w-[430px] h-fit  flex flex-col max-h-[630px] "
    >
      <div className="w-full h-full flexflex-col justify-start items-center">
        <div className="pb-5 mb-5">
          <div className=" relative w-full flex flex-col  gap-5 ">
            <IconButton
              className=" absolute right-3 top-3 z-20 text-common-white"
              onClick={() => {
                setCreditDialogInfo(null);
              }}
            >
              <CloseIcon isBorderRounded={true} />
            </IconButton>

            <div className="h-[180px]   w-full relative  z-0 rounded-md bg-grey-600">
              <CustomImagePreview image={CreditTopBg} />
            </div>

            <div className=" absolute bottom-[-28px] px-7 w-full">
              <div className=" h-14 bg-grey-800 border border-grey-700 py-4 px-6 rounded-xl flex justify-between items-center">
                <p className=" text-grey-300">Total Credit Balance</p>
                <div className=" flex items-end">
                  <p className=" text-lg tracking-widest align-bottom">
                    {user?.credit &&
                      user.credit.nonTransferableCredit +
                        user.credit.transferableCredit +
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
        {children}

        <div className="w-full h-full  flex flex-col justify-between p-5">
          <p className=" text-xs font-light text-grey-300 text-center">
            By submitting this request you agree to witit’s
          </p>
          <p className="text-xs font-light text-grey-300 text-center">
            <span
              className=" text-primary-main font-semibold pl-1 cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
              }}
            >
              Privacy Policy
            </span>{" "}
            and
            <span
              className=" text-primary-main font-semibold pl-1 cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
              }}
            >
              Terms of Use
            </span>
          </p>
        </div>
      </div>
    </CustomDialog>
  );
};

export default Creadit;
