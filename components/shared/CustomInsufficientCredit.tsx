import React from "react";
import CustomButton from "./CustomButton";
import CloseIcon from "@/utils/icons/shared/CloseIcon";

type Props = {
  onCancel: () => void;
  handleEvent: () => void;
};
const CustomInsufficientCredit = ({ onCancel, handleEvent }: Props) => {
  return (
    <>
      <div className="w-full h-[75px] flex bg-grey-900 justify-between items-center px-8 gap-40 rounded-xl  border-l-[3px] border-l-error-main border border-grey-500  ">
        <div className="py-1 flex  flex-col gap-2">
          <p className="text-error-main font-bold">
            Insufficient Credit Balance
          </p>
          <p className="text-common-white text-opacity-40 text-xs ">
            Oops!! You have insufficient credit balance. You can continue this
            step by adding credits.{" "}
          </p>
        </div>
        <div className="flex gap-4 items-center ">
          <CustomButton
            name="Add Now"
            className="bg-error-main w-[110px] h-[38px] rounded-lg "
            handleEvent={handleEvent}
          />
          <div
            className="text-grey-400 scale-150 cursor-pointer hover:text-common-white"
            onClick={onCancel}
          >
            <CloseIcon />
          </div>
        </div>
      </div>
    </>
  );
};

export default CustomInsufficientCredit;
