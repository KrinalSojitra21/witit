import React, { useEffect, useState } from "react";
import CustomDialog from "../../../CustomDialog";
import { useAuthContext } from "@/context/AuthContext";
import WhatYouGet from "./levelUpDialogRightSection/WhatYouGet";
import CustomButton from "../../../../CustomButton";
import CloseIcon from "@/utils/icons/shared/CloseIcon";
import LeftUserInfo from "./LeftUserInfo";

const VerifyUserDialog = () => {
  const { setCustomDialogType, customDialogType } = useAuthContext();
  const [currentStep, setcurrentStep] = useState(0);

  return (
    <CustomDialog className="max-h-[550px] h-full">
      <div className="w-full  h-full flex ">
        <div className="w-[45%] relative flex flex-col justify-end">
          <LeftUserInfo />
        </div>
        <div className="w-[55%] h-hull">
          <div className="h-full w-full flex flex-col gap-3 p-5 justify-between">
            <div className="flex flex-col gap-3">
              <div className="w-full flex justify-between items-center">
                <p className="text-base">
                  Here’s what you get with Level Up AI
                </p>
                <div
                  className="w-fit text-grey-100  z-10"
                  onClick={() => {
                    setCustomDialogType(null);
                  }}
                >
                  <CloseIcon isBorderRounded={true} />
                </div>
              </div>
              <div className=" w-full h-[0.2rem] bg-gradient-to-r from-primary-main " />
            </div>
            {currentStep === 0 ? (
              <WhatYouGet setcurrentStep={setcurrentStep} />
            ) : null}

            <CustomButton
              name="Go Pro With 20% OFF"
              className=" text-sm py-3"
              handleEvent={() => {
                setcurrentStep(currentStep + 1);
              }}
            />
          </div>
        </div>
      </div>
    </CustomDialog>
  );
};

export default VerifyUserDialog;
