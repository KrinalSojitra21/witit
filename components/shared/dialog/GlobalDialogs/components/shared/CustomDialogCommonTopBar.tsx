import { useAuthContext } from "@/context/AuthContext";
import CloseIcon from "@/utils/icons/shared/CloseIcon";
import NormalLeftArrowIcon from "@/utils/icons/shared/NormalLeftArrowIcon";
import PlusIcon from "@/utils/icons/shared/PlusIcon";
import { IconButton } from "@mui/material";
import React from "react";

type Props = {
  startIcon?: React.ReactElement;
  title?: string;
  isCloseIcon?: boolean;
  onCancel?: () => void;
};
const CustomDialogCommonTopBar = ({
  startIcon,
  title,
  isCloseIcon = true,
  onCancel,
}: Props) => {
  const { customDialogType, setCustomDialogType } = useAuthContext();

  return (
    <div className="z-20 flex justify-between items-center px-[20px] border-b border-grey-500 py-2 w-full">
      <div className="flex items-center gap-3">
        {startIcon ? (
          <div className=" text-common-white">{startIcon}</div>
        ) : null}

        <div className="py-2 text-lg font-medium">{title}</div>
      </div>
      <IconButton
        className=" text-common-white p-0 m-0"
        onClick={() => {
          if (onCancel) {
            onCancel();
          }
        }}
      >
        {isCloseIcon ? <CloseIcon isBorderRounded={true} /> : null}
      </IconButton>
    </div>
  );
};

export default CustomDialogCommonTopBar;
