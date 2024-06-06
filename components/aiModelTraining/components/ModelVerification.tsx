import React, { useEffect, useState } from "react";
import CustomCheckbox from "../../shared/CustomCheckbox";
import ImagePlaceHolderGalleryIcon from "@/utils/icons/createPost/ImagePlaceHolderGalleryIcon";
import { ImageState } from "@/types/post";
import { Aimodel, AimodelRes } from "@/types/user";
import { UseFormHandleSubmit } from "react-hook-form/dist";
import CustomLoadingButton from "@/components/shared/CustomLoadingButton";
import CheckBoxTickCheckedIcon from "@/utils/icons/shared/CheckBoxTickCheckedIcon";
import { useAuthContext } from "@/context/AuthContext";
import InputCropSingleImage from "@/components/shared/cropImage/singleCropImage/InputCropSingleImage";

type Props = {
  frontSite: ImageState | null;
  backSite: ImageState | null;
  setBackSite: React.Dispatch<React.SetStateAction<ImageState | null>>;
  setFrontSite: React.Dispatch<React.SetStateAction<ImageState | null>>;
  currentState: number;
  handleSubmit: UseFormHandleSubmit<Aimodel>;
  fillVerificationForm: (data: Aimodel) => Promise<AimodelRes | undefined>;
  isButtonLoading: Boolean;
  errorMessage: string | null;
  setErrorMessage: React.Dispatch<React.SetStateAction<string | null>>;
  setPolicy: React.Dispatch<React.SetStateAction<string | null>>;
};

const ModelVerification = ({
  errorMessage,
  frontSite,
  backSite,
  setBackSite,
  setFrontSite,
  handleSubmit,
  isButtonLoading,
  fillVerificationForm,
  setPolicy,
}: Props) => {
  const [checked, setchecked] = useState<any>(false);
  const [isDisabled, setisDisabled] = useState(true);

  const { setCustomDialogType } = useAuthContext();
  useEffect(() => {
    if (
      checked?.target?.checked &&
      frontSite?.imagePreview &&
      backSite?.imagePreview
    ) {
      setisDisabled(false);
      return;
    }

    setisDisabled(true);
  }, [frontSite, backSite, checked]);
  return (
    <div className="flex-grow h-full  w-full  flex flex-col justify-between items-center  rounded-lg">
      <div className="flex flex-col justify-center items-center w-full gap-3  pt-4 overflow-auto">
        <div className=" w-[70%] flex flex-col gap-2 text-center">
          <p className="text-sm font-light  text-grey-100">
            We do this to protect you and keep Witit safe. You wouldn’t want
            someone creating
            <br /> unwanted photos of you on here would you?
          </p>
        </div>
        <div className="flex  gap-10  items-center pt-6">
          <div
            className={`flex flex-col w-[200px] aspect-[3/4]   items-center border-dashed bg-grey-900 rounded-2xl  gap-1  border-2 
            border-grey-400 `}
          >
            <InputCropSingleImage
              type="AIVERIFICATION"
              aspect={"3/4"}
              finalImage={frontSite}
              setFinalImage={setFrontSite}
              placeholder={{
                placeholderImg: (
                  <div className="text-grey-400 w-10 h-28 scale-[2.5] flex justify-center items-center">
                    <ImagePlaceHolderGalleryIcon />
                  </div>
                ),
                placeholderTitle: (
                  <>
                    <p className="text-center text-grey-400">
                      Upload a photo of yourself holding up 3 fingers
                    </p>
                  </>
                ),
              }}
            />
          </div>
          <div
            className={`flex flex-col w-[200px] aspect-[3/4]  items-center bg-grey-900 rounded-2xl  gap-1 border-dashed  border-2
            } border-grey-400`}
          >
            <InputCropSingleImage
              type="AIVERIFICATION"
              aspect={"3/4"}
              finalImage={backSite}
              setFinalImage={setBackSite}
              placeholder={{
                placeholderImg: (
                  <div className="text-grey-400 w-10 h-28 scale-[2.5] flex justify-center items-center">
                    <ImagePlaceHolderGalleryIcon />
                  </div>
                ),
                placeholderTitle: (
                  <>
                    <p className="text-center text-grey-400">
                      Upload a photo of yourself holding up 3 fingers
                    </p>
                  </>
                ),
              }}
            />
          </div>
        </div>

        <div className="flex items-start gap-2 w-[60%] pt-5 pb-2">
          <div className=" scale-90 text-grey-300">
            <CustomCheckbox
              uncheckedColor="#808080"
              checkedIcon={<CheckBoxTickCheckedIcon />}
              onChange={setchecked}
            />
          </div>
          <p className="pt-2 text-sm text-grey-300 ">
            I agree to be bound by Witit’s{" "}
            <span
              className=" text-primary-main font-semibold cursor-pointer "
              onClick={() => {
                setPolicy("TERMS_OF_SERVICE");
              }}
            >
              Terms of Service
            </span>
            ,
            <span
              className=" text-primary-main font-semibold pl-1 cursor-pointer"
              onClick={() => {
                setPolicy("CONTENT_POLICY");
              }}
            >
              Content Policy
            </span>
            , and
            <span
              className=" text-primary-main font-semibold pl-1 cursor-pointer"
              onClick={() => {
                setPolicy("PRIVACY_POLICY");
              }}
            >
              Privacy Policy.
            </span>
          </p>
        </div>
      </div>
      <div
        className={`w-full flex flex-col items-center  h-[108px] pt-3    bg-grey-800   gap-2`}
      >
        <p className=" text-xs text-grey-400 ">
          AI Yourself Will Cost you{" "}
          <span className=" text-common-white">450 Credits.</span>
        </p>
        <CustomLoadingButton
          type="submit"
          disabled={isDisabled}
          name="Create Your AI"
          className={`w-[60%] py-2 max-w-[370px]  ${
            isDisabled ? "text-opacity-50 text-common-white bg-grey-700" : ""
          } `}
          loading={isButtonLoading}
          handleEvent={() => {
            handleSubmit(fillVerificationForm)();
          }}
        />

        <p className="text-center text-error-main h-[10px]">{errorMessage}</p>
      </div>
    </div>
  );
};

export default ModelVerification;
