import React, { useState } from "react";
import CustomCheckbox from "@/components/shared/CustomCheckbox";
import CheckBoxEmptyIcon from "@/utils/icons/shared/CheckBoxEmptyIcon";
import CheckBoxTickCheckedIcon from "@/utils/icons/shared/CheckBoxTickCheckedIcon";
import { ChangeEvent } from "react";
import { InPaintingSettings } from "@/types/ai";

const InPainting = () => {
  const [isMaskOnly, setIsMaskOnly] = useState(false);
  return (
    <div className=" flex flex-col h-full p-3 overflow-y-auto overflow-x-hidden">
      <div className="flex items-start gap-3">
        <CustomCheckbox
          className="w-auto p-0.5 [&.Mui-checked]:text-primary-main text-grey-200"
          icon={<CheckBoxEmptyIcon />}
          checkedIcon={<CheckBoxTickCheckedIcon />}
          checked={isMaskOnly}
          onChange={(e: ChangeEvent<HTMLInputElement>) => {
            setIsMaskOnly(e.target.checked);
          }}
        />
        <div className="flex flex-col gap-1.5 mt-1">
          <h5
            className="text-sm text-common-white cursor-pointer"
            onClick={() => {
              setIsMaskOnly(!isMaskOnly);
            }}
          >
            Recreate Mask Only{" "}
          </h5>
          <p className="text-xs text-common-white text-opacity-40">
            Toggle this checkbox to inpaint 'Only Masked' areas or leave
            unchecked for 'Whole Picture' processing.
          </p>
        </div>
      </div>
    </div>
  );
};

export default InPainting;
