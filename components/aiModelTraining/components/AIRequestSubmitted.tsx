import Lottie from "lottie-react";
import React from "react";
import verificationSuccessLottie from "@/utils/lottie/successLottie.json";

const AIRequestSubmitted = () => {
  return (
    <div className="w-full h-full flex flex-col gap-5 justify-center items-center text-center">
      <div className="" style={{ width: 142 }}>
        <Lottie animationData={verificationSuccessLottie} loop={2} span={10} />
      </div>
      <p className=" text-xl font-semibold">
        Your <span className=" text-primary-main">AI request</span> has been
        submitted
      </p>
      <p className=" text-grey-100 w-[50%] text-sm">
        Your AI model will begin training automatically once we have verified
        your request. You can expect to hear back from us regarding the status
        within the next 24 hours.
      </p>
    </div>
  );
};

export default AIRequestSubmitted;
