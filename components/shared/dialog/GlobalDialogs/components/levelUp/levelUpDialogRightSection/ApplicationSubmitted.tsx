import Lottie from "lottie-react";
import React from "react";
import verificationSuccessLottie from "@/utils/lottie/successLottie.json";
import CloseIcon from "@/utils/icons/shared/CloseIcon";
import { useAuthContext } from "@/context/AuthContext";
import NormalLeftArrowIcon from "@/utils/icons/shared/NormalLeftArrowIcon";

const ApplicationSubmitted = () => {
  const { setCustomDialogType } = useAuthContext();
  return (
    <div className=" w-full h-full flex flex-col ">
      {" "}
      <div className="w-full flex items-end justify-end">
        <div
          className="w-fit text-grey-100  z-10 flex gap-2 cursor-pointer"
          onClick={() => {
            setCustomDialogType(null);
          }}
        >
          <CloseIcon isBorderRounded={true} />
        </div>
      </div>
      <div className=" w-full flex-grow flex flex-col items-center justify-center">
        <div className="" style={{ width: 200 }}>
          <Lottie animationData={verificationSuccessLottie} loop={2} />
        </div>

        <p className=" text-xl w-[70%] text-center ">
          Application has been submitted
        </p>
        <p className="text-xs font-light text-grey-100 pt-1 text-center ">
          Thank you for submitting your verification application. You can expect
          to hear back from us regarding the status within the next 48 hours.
        </p>
      </div>
    </div>
  );
};

export default ApplicationSubmitted;
