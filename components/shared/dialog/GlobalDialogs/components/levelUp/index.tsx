import Image from "next/image";
import React, { useEffect, useState } from "react";
import CustomDialog from "../../../CustomDialog";
import CustomButton from "../../../../CustomButton";
import CloseIcon from "@/utils/icons/shared/CloseIcon";
import { useAuthContext } from "@/context/AuthContext";
import LevelStartCreating from "./LevelStartCreating";
import WhatYouGet from "./levelUpDialogRightSection/WhatYouGet";
import LeftUserInfo from "./LeftUserInfo";
import ChooseYourIdentity from "./levelUpDialogRightSection/ChooseYourIdentity";
import UploadYourID from "./levelUpDialogRightSection/UploadYourID";
import ApplicationSubmitted from "./levelUpDialogRightSection/ApplicationSubmitted";
import NormalLeftArrowIcon from "@/utils/icons/shared/NormalLeftArrowIcon";

import { useSelector } from "react-redux";
import Crown from "@/utils/icons/levelUp/Crown";
import { ImageState } from "@/types/post";
import { RootState } from "@/redux/store";
import { uploadImageToStorage } from "@/service/firebase/uploadImage";
import createCheckoutSession from "@/api/stripe/createCheckoutSession";
import { useForm } from "react-hook-form";
import { Store } from "@/types/user";
import CustomLoadingButton from "@/components/shared/CustomLoadingButton";
import createVerificationApplication from "@/api/user/CreateVerificationApplication";

const LevelUp = () => {
  const { firebaseUser, sendNotification } = useAuthContext();
  const { setCustomDialogType } = useAuthContext();
  const user = useSelector((state: RootState) => state.user);
  const [currentStep, setcurrentStep] = useState(0);
  const [isButtonLoading, setisButtonLoading] = useState<Boolean>(false);
  const [frontOfLicense, setfrontOfLicense] = useState<ImageState | null>(null);
  const [backOfLicense, setbackOfLicense] = useState<ImageState | null>(null);
  const [isDisabled, setisDisabled] = useState(false);

  const devaultvalue: Store = {
    documentName: "",
    documentImages: [],
  };
  const { setValue, getValues, handleSubmit } = useForm({
    defaultValues: devaultvalue,
  });
  console.log(backOfLicense);
  useEffect(() => {
    if (currentStep === 3) {
      frontOfLicense?.imagePreview && backOfLicense?.imagePreview
        ? setisDisabled(false)
        : setisDisabled(true);
    }
  }, [currentStep, backOfLicense, frontOfLicense]);
  const FillData = async (data: Store) => {
    if (data.documentImages.length > 1) {
      return;
    }
    setisButtonLoading(true);
    const DocumentImagesList = [frontOfLicense?.file, backOfLicense?.file];
    const folderName = "generation_images";
    const PromiseDataList = await Promise.all(
      DocumentImagesList.map((file) => {
        return file
          ? uploadImageToStorage({
              folderName,
              file,
              metadata: {
                userId: firebaseUser?.uid,
              },
            })
          : null;
      })
    );
    data.documentImages = PromiseDataList;
    const res = await createVerificationApplication({
      data,
      user_id: user?.userId,
    });
    if (res.status === 200) {
      setcurrentStep(currentStep + 1);
      return;
    }
    setisButtonLoading(false);
    sendNotification({ type: "ERROR", message: res.error });
  };

  return (
    <CustomDialog
      isOpen={true}
      className={`${
        currentStep === 0 ? "max-w-[450px] h-fit" : "max-h-[600px] "
      } `}
    >
      <div className={`flex w-full h-full `}>
        <form onSubmit={(e) => e.preventDefault()}>
          {currentStep === 0 ? (
            <LevelStartCreating setcurrentStep={setcurrentStep} />
          ) : (
            <div className="w-full flex h-full ">
              <div className="w-[45%] relative  flex flex-col justify-end">
                <LeftUserInfo />
              </div>

              <div className=" w-[55%] flex flex-col justify-between h-full p-5 gap-5">
                {currentStep < 2 ? (
                  <div className="flex w-full items-start gap-5">
                    <div
                      className={` flex items-center text-common-white pt-1 ${
                        currentStep == 0
                          ? " text-opacity-0"
                          : "text-opacity-100"
                      }`}
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
                  </div>
                ) : null}

                <div className=" flex-grow">
                  {currentStep === 1 ? (
                    <WhatYouGet setcurrentStep={setcurrentStep} />
                  ) : currentStep === 2 ? (
                    <ChooseYourIdentity
                      setValue={setValue}
                      setcurrentStep={setcurrentStep}
                      setCustomDialogType={setCustomDialogType}
                      currentStep={currentStep}
                      getValues={getValues}
                    />
                  ) : currentStep === 3 ? (
                    <UploadYourID
                      setfrontOfLicense={setfrontOfLicense}
                      setbackOfLicense={setbackOfLicense}
                      frontOfLicense={frontOfLicense}
                      backOfLicense={backOfLicense}
                      setCustomDialogType={setCustomDialogType}
                      setcurrentStep={setcurrentStep}
                      currentStep={currentStep}
                      setisDisabled={setisDisabled}
                    />
                  ) : currentStep === 4 ? (
                    <ApplicationSubmitted />
                  ) : null}
                </div>
                {currentStep === 3 && (
                  <CustomLoadingButton
                    disabled={isDisabled}
                    loading={isButtonLoading}
                    name="Submit"
                    className={`${
                      isDisabled
                        ? "bg-grey-700 text-common-white text-opacity-50"
                        : ""
                    }  py-3`}
                    handleEvent={() => {
                      handleSubmit(FillData)();
                    }}
                  />
                )}
              </div>
            </div>
          )}
        </form>
      </div>
    </CustomDialog>
  );
};

export default LevelUp;
