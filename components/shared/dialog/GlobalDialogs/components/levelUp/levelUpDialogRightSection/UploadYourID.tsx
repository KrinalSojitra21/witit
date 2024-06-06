import CustomButton from "@/components/shared/CustomButton";
import driverLicenseFront from "@/utils/images/driverLicenseFront.svg";
import driverLicenseBack from "@/utils/images/driverLicenseBack.svg";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { uploadImageToStorage } from "@/service/firebase/uploadImage";
import { useAuthContext } from "@/context/AuthContext";
import InputCropSingleImage from "@/components/shared/cropImage/singleCropImage/InputCropSingleImage";
import { ImageState } from "@/types/post";
import { DriverLicense } from "@/types/user";
import CloseIcon from "@/utils/icons/shared/CloseIcon";
import NormalLeftArrowIcon from "@/utils/icons/shared/NormalLeftArrowIcon";
type stroelink = {
  frontSide: null | string;
  backSide: null | string;
};
type User = {
  selectedPhotos: string[];
  verificationImages: string[];
  audioURL: string | null;
  generationSettings: {
    bannedWords: string[];
    allowGenerationOnModel: boolean;
    creditPerPhoto: number;
  };
  classType: string;
};
type Props = {
  setfrontOfLicense: void | any;
  setbackOfLicense: void | any;
  frontOfLicense: null | ImageState;
  backOfLicense: null | ImageState;
  setCustomDialogType: React.Dispatch<React.SetStateAction<string | null>>;
  setcurrentStep: React.Dispatch<React.SetStateAction<number>>;
  currentStep: number;
  setisDisabled: React.Dispatch<React.SetStateAction<boolean>>;
};

const UploadYourID = ({
  setfrontOfLicense,
  setbackOfLicense,
  frontOfLicense,
  backOfLicense,
  setCustomDialogType,
  setcurrentStep,
  currentStep,
  setisDisabled,
}: Props) => {
  return (
    <>
      <div className="flex w-full items-start gap-5">
        <div
          className={` flex items-center text-common-white pt-1`}
          onClick={() => {
            if (currentStep > 0) {
              setcurrentStep(currentStep - 1);
              setisDisabled(false);
            }
          }}
        >
          <NormalLeftArrowIcon />
        </div>
        <div className="flex flex-grow flex-col gap-3 ">
          {" "}
          <div className="w-full flex justify-between items-center">
            <p className="text-base flex  gap-3 truncate">
              <span className=" flex justify-center h-fit bg-primary-main  w-6 rounded-full">
                1
              </span>{" "}
              <span className="flex justify-center h-fit bg-primary-main  w-6 rounded-full">
                2
              </span>{" "}
              Confirm Your Identity
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
      </div>
      <div className="h-full w-full flex flex-col gap-5 p-5 pt-3 justify-between">
        <div className="flex h-full flex-col gap-5">
          <div className="flex flex-col justify-between flex-grow gap-3  pb-5 items-center">
            <div
              className={`flex flex-col  flex-1 items-center bg-grey-800 rounded-2xl w-[80%] aspect-video justify-between gap-1 
               border-grey-200`}
            >
              <InputCropSingleImage
                type="UPLOADID"
                aspect="16/9"
                className="border border-dashed border-grey-300 rounded-2xl"
                finalImage={frontOfLicense}
                setFinalImage={setfrontOfLicense}
                placeholder={{
                  placeholderImg: (
                    <Image
                      fill
                      src={driverLicenseFront}
                      alt=""
                      className="relative h-[69px] rounded-md"
                    />
                  ),
                  placeholderTitle: (
                    <>
                      <div className="fle flex-col gap-2 items-center w-[80%] mt-2">
                        <p className=" text-center text-[0.65rem]">
                          Upload front of Driver’s License
                        </p>
                        <p className="text-center text-[0.55rem] font-light text-grey-100 text-opacity-40 mt-2">
                          Upload photo with a well light area, flat surface and
                          contrasting background.
                        </p>
                      </div>
                      <CustomButton
                        name="Choose File"
                        className="w-fit text-[0.5rem] font-light py-0 mt-2"
                      />
                    </>
                  ),
                }}
              />
            </div>
            <div
              className={`flex flex-col flex-1 mt-2 items-center   bg-grey-800 rounded-2xl w-[80%] aspect-video justify-between gap-1 `}
            >
              <InputCropSingleImage
                type="UPLOADID"
                className="border border-dashed border-grey-300 rounded-2xl"
                aspect="16/9"
                finalImage={backOfLicense}
                setFinalImage={setbackOfLicense}
                placeholder={{
                  placeholderImg: (
                    <Image
                      fill
                      src={driverLicenseBack}
                      alt=""
                      className="relative h-[69px]   rounded-md"
                    />
                  ),
                  placeholderTitle: (
                    <>
                      <div className="fle flex-col gap-1 items-center w-[80%] mt-2">
                        <p className=" text-center text-[0.65rem]">
                          Upload Back of Driver’s License
                        </p>
                        <p className="text-center text-[0.55rem] font-light text-grey-100 mt-2 text-opacity-40">
                          Upload photo with a well light area, flat surface and
                          contrasting background.
                        </p>
                      </div>
                      <CustomButton
                        name="Choose File"
                        className="w-fit text-[0.5rem] font-light py-0 mt-2"
                      />
                    </>
                  ),
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default UploadYourID;
