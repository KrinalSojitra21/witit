import CustomButton from "@/components/shared/CustomButton";
import ClockIcon from "@/utils/icons/setting/statusDialog/ClockIcon";
import React from "react";

const PendingStatus = () => {
  return (

      <div className="flex flex-col justify-between h-full items-center py-10 px-20 ">
        <div className=" flex flex-col gap-5 justify-center items-center flex-grow">
          <div className=" scale-110">
            {" "}
            <ClockIcon />
          </div>
          <p className="text-base tracking-wider text-center">
            Verification Pending
          </p>
          <p className="text-grey-100 text-sm tracking-wider font-light text-center w-[80%] pb-5">
            Your bank linking process has not yet been completed, please
            complete it.
          </p>
        </div>
        <CustomButton name="Ok" className=" py-3" handleEvent={() => {}} />
      </div>
    
  );
};

export default PendingStatus;
