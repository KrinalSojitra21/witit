import { theme } from "@/theme";
import CloseIcon from "@/utils/icons/shared/CloseIcon";
import { IconButton, Divider } from "@mui/material";
import React from "react";
import CustomButton from "./CustomButton";
import CustomDialog from "./dialog/CustomDialog";
import { CustomImagePreview } from "./CustomImagePreview";
import deleteImage from "@/utils/images/deleteOffer.svg";
import Image from "next/image";
import crossStripsBg from "@/utils/images/crossStripsBg.svg";

type Props = {
  isOpen?: boolean;
  onCancel?: () => void;
  onConform?: () => void;
  image?: string;
  title?: {
    titleMain?: string;
    title1?: string;
    title2?: string;
    confirmButton?: string;
  };
};
const ConfirmationDialog = ({
  isOpen,
  onCancel,
  onConform,
  title,
  image,
}: Props) => {
  return (
    <>
      {" "}
      <CustomDialog
        isOpen={isOpen}
        className=" border-2  max-w-[350px]  h-fit"
        onCancel={onCancel}
      >
        <div className="flex flex-col h-full justify-between  items-end">
          <div className="py-5 w-full  flex border-b border-grey-500 flex-col items-center justify-center relative">
            <Image
              fill
              src={crossStripsBg}
              alt=""
              className="absolute bg-[#E15F60] "
            />

            <p className=" z-10 text-xl tracking-wide">
              {title && title.titleMain}
            </p>
          </div>
          {/* <IconButton className=" text-common-white" onClick={onCancel}>
         <CloseIcon isBorderRounded={true} />
       </IconButton> */}
          <div className=" flex flex-col  items-center p-5">
            {image && (
              <div className="relative w-[100px] h-[100px] rounded-md m-3">
                <CustomImagePreview image={deleteImage} />
              </div>
            )}
            {title && (
              <p
                className={`text-xs text-center text-grey-200 ${
                  image && "pt-5"
                }`}
              >
                {title.title1}
              </p>
            )}
            {title && (
              <p className="text-xs text-center text-grey-200 ">
                {title.title2}
              </p>
            )}
          </div>
          <div className="flex gap-4 w-full p-5">
            <CustomButton
              name="Cancel"
              onClick={onCancel}
              className=" bg-grey-700 text-grey-200 text-sm hover:bg-transparent shadow-none py-2.5 hover:bg-opacity-80	"
            />
            <CustomButton
              name={title?.confirmButton ? title.confirmButton : "Submit"}
              onClick={onConform}
              className={`border-[#E15F60] text-[#E15F60] bg-[#e15f5f1d] border border-solid   rounded-lg  text-sm  py-2.5 hover:bg-opacity-80	`}
            />
          </div>
        </div>
      </CustomDialog>
    </>
  );
};

export default ConfirmationDialog;
