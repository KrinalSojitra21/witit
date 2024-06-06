import React, { useEffect, useState } from "react";
import CustomDialog from "@/components/shared/dialog/CustomDialog";
import UploadGuidance from "./components/UploadGuidance";
import CloseIcon from "@/utils/icons/shared/CloseIcon";
import ChooseClass from "./components/ChooseClass";
import { useAuthContext } from "@/context/AuthContext";
import ModelVerification from "./components/ModelVerification";
import AIRequestSubmitted from "./components/AIRequestSubmitted";
import CustomButton from "../shared/CustomButton";
import { useDispatch, useSelector } from "react-redux";
import { Divider } from "@mui/material";
import { theme } from "@/theme";
import { ImageInfo } from "@/types";
import { uploadImageToStorage } from "@/service/firebase/uploadImage";
import { ImageState } from "@/types/post";
import { RootState } from "@/redux/store";
import { Aimodel } from "@/types/user";
import { useForm } from "react-hook-form";
import createAImodelApplication from "@/api/user/CreateAImodelApplication";
import TermsOfServices from "../footerDialogs/TermsOfServices";
import PrivacyPolicy from "../footerDialogs/PrivacyPolicy";
import ContentPolicy from "../footerDialogs/ContentPolicy";
import ModifyImages from "../shared/cropImage/multipleCropImage/ModifyImages";
import InputCropMultiImages from "../shared/cropImage/multipleCropImage/InputCropMultiImages";
import PhotosQualityRange from "./components/PhotosQualityRange";
import ArrowDownIcon from "@/utils/icons/shared/ArrowDownIcon";

const AIYourselfSteps = [
  "Guidance",
  "Upload Images",
  "Select Gender",
  "Verification",
];

type Props = {
  setIsTrainModelDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const AIModelTraining = ({ setIsTrainModelDialogOpen }: Props) => {
  const [currentState, setCurrentState] = useState<number>(0);
  const [createPostImages, setCreatePostImages] = useState<
    {
      image: ImageInfo;
      index: number;
    }[]
  >([]);
  const [frontSite, setFrontSite] = useState<ImageState | null>(null);
  const [backSite, setBackSite] = useState<ImageState | null>(null);
  const [tabCurrentState, setTabCurrentState] = useState<number>(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isButtonLoading, setIsButtonLoading] = useState<Boolean>(false);
  const [policy, setPolicy] = useState<string | null>(null);

  const user = useSelector((state: RootState) => state.user);
  const { setCustomDialogType, customDialogType } = useAuthContext();
  const { firebaseUser } = useAuthContext();
  const dispatch = useDispatch();

  const defaultValues = {
    selectedPhotos: [],
    verificationImages: [],
    audioURL: null,
    generationSettings: {
      bannedWords: [],
      allowGenerationOnModel: false,
      creditPerPhoto: 0,
    },
    classType: "Man",
  };

  const {
    control,
    getValues,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<Aimodel>({
    defaultValues,
  });

  useEffect(() => {
    if (createPostImages.length > 0) {
      setCurrentState(2);
    }
  }, [createPostImages]);

  useEffect(() => {
    if (currentState === 0) {
      setTabCurrentState(currentState);
    } else if (currentState === 1 || currentState === 2) {
      setTabCurrentState(1);
    } else if (currentState) {
      setTabCurrentState(currentState - 1);
    }
  }, [currentState]);

  const fillVerificationForm = async (data: Aimodel) => {
    const getFirebaseImages: Blob[] = [];

    setIsButtonLoading(true);
    setErrorMessage(null);

    for (const val of createPostImages) {
      const imageInfo = val.image.croppedImageSrc;
      const response = await fetch(imageInfo);
      const file = await response.blob();
      getFirebaseImages.push(file);
    }

    const selectedPhotosList = await Promise.all(
      getFirebaseImages.map((file) => {
        const folderName = "update_ai_images";
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

    data.selectedPhotos = selectedPhotosList;

    const figerphotolist = [frontSite?.file, frontSite?.file];

    const folderName = "creator_verification_image";

    const verificationImagesList = await Promise.all(
      figerphotolist.map((file) => {
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

    data.verificationImages = verificationImagesList;
    const response = await createAImodelApplication({
      data,
      user_id: user?.userId,
    });
    setIsButtonLoading(false);
    if (response.status === 200 && user?.credit && user) {
      setCurrentState(5);
      return;
    }
    if (response.status === 403) {
      setCustomDialogType("CREDITS-GETCREDITS");
      setErrorMessage(response.error);
      return;
    }
    return response;
  };

  return (
    <>
      <CustomDialog
        isOpen={true}
        className="max-h-[720px]  bg-secondary-main max-w-[1000px] w-[90%] flex justify-between"
      >
        <form onSubmit={(e) => e.preventDefault()} className="w-full">
          <div className="w-full flex  h-full justify-between">
            <div className=" w-full  flex flex-col items-center justify-between">
              <div className="pl-10   pr-5 pt-4 pb-2 w-full flex justify-between items-center">
                <div className="flex  gap-2 items-center">
                  <p className=" text-lg">AI Yourself</p>
                </div>
                <div
                  className="cursor-pointer"
                  onClick={() => {
                    setIsTrainModelDialogOpen(false);
                  }}
                >
                  <CloseIcon isBorderRounded={true} />
                </div>
              </div>
              <Divider
                sx={{ borderColor: theme.palette.grey[500], width: "100%" }}
              />

              <div className=" flex gap-3  pb-3 mt-3 ">
                {AIYourselfSteps.map((step, index) => {
                  return (
                    <div
                      key={index}
                      className={`rounded-3xl ${
                        tabCurrentState === index
                          ? "bg-grey-600 "
                          : "bg-grey-800  "
                      } flex gap-2 py-2 pl-2 pr-7 items-center cursor-default ${
                        tabCurrentState >= index && "cursor-pointer"
                      }`}
                      onClick={() => {
                        if (currentState > index && index != 0) {
                          setCurrentState(index + 1);
                        } else if (index === 0) {
                          setCurrentState(index);
                        }
                        setErrorMessage(null);
                      }}
                    >
                      <p
                        className={`w-5 h-5 flex items-center justify-center ${
                          tabCurrentState < index
                            ? "bg-grey-500  text-grey-100 cursor-default"
                            : "bg-primary-main text-common-white cursor-pointer"
                        }  rounded-full p-1 leading-none text-[0.6rem]`}
                      >
                        {index + 1}
                      </p>
                      <p className=" text-sm">{step}</p>
                    </div>
                  );
                })}
              </div>

              <div
                className={`w-full flex flex-col justify-between  overflow-y-auto 
              
              ${currentState >= 3 && "overflow-y-hidden h-[595px]"}
               rounded-lg `}
              >
                {currentState === 0 ? <UploadGuidance /> : null}
                {currentState === 1 ? (
                  <div className="w-full h-full flex justify-center">
                    <div className="w-[80%] flex items-center mt-4 mb-4 rounded-[10px] border-[2px] h-[452px] border-dashed border-grey-500 overflow-hidden">
                      <InputCropMultiImages
                        isSmall={false}
                        isEnabled={true}
                        setSelectdImgs={setCreatePostImages}
                      />
                    </div>
                  </div>
                ) : null}

                {currentState == 2 ? (
                  <div
                    className="w-full flex flex-col h-[416px] justify-center pr-2 "
                    onClick={() => setErrorMessage(null)}
                  >
                    <p className="text-center mt-5">
                      Please{" "}
                      <span className="text-primary-light font-bold">
                        Upload 10 to 30 Images
                      </span>
                      , We will used to generate your model only.
                    </p>
                    <ModifyImages
                      images={createPostImages}
                      setStep={setCurrentState}
                      setImages={setCreatePostImages}
                      isNextVisible={false}
                      isCrop={false}
                      limit={30}
                    />
                  </div>
                ) : null}

                {currentState === 3 ? (
                  <ChooseClass
                    getValues={getValues}
                    setCurrentState={setCurrentState}
                    currentState={currentState}
                    setErrorMessage={setErrorMessage}
                    control={control}
                  />
                ) : null}
                {currentState === 4 ? (
                  <ModelVerification
                    frontSite={frontSite}
                    setFrontSite={setFrontSite}
                    setBackSite={setBackSite}
                    backSite={backSite}
                    currentState={currentState}
                    handleSubmit={handleSubmit}
                    fillVerificationForm={fillVerificationForm}
                    isButtonLoading={isButtonLoading}
                    errorMessage={errorMessage}
                    setErrorMessage={setErrorMessage}
                    setPolicy={setPolicy}
                  />
                ) : null}
                {currentState === 5 ? <AIRequestSubmitted /> : null}
              </div>

              {currentState === 0 ||
              currentState === 1 ||
              currentState === 2 ? (
                <>
                  {currentState == 2 && (
                    <PhotosQualityRange
                      photosLength={createPostImages.length}
                    />
                  )}
                  <div
                    className={`w-full flex flex-col h-[108px] items-center  bg-grey-800 gap-2 py-3`}
                  >
                    <p
                      className={` text-xs text-grey-400 ${
                        user?.isModelTrained ? "visible" : "invisible"
                      } `}
                    >
                      AI Yourself Will Cost you{" "}
                      {
                        <span className={` text-common-white  `}>
                          450 Credits.
                        </span>
                      }
                    </p>
                    <CustomButton
                      endIcon={
                        <div
                          className={`p-0 rotate-[270deg]
                         scale-75 `}
                        >
                          <ArrowDownIcon />
                        </div>
                      }
                      type="submit"
                      name="Next"
                      className={`w-[60%] py-2  max-w-[370px]`}
                      handleEvent={() => {
                        if (currentState < 1) {
                          setCurrentState((preState) => preState + 1);
                          return;
                        }
                        if (currentState === 2) {
                          createPostImages.length >= 10
                            ? (setCurrentState((preState) => preState + 1),
                              setErrorMessage(null))
                            : setErrorMessage(
                                "Please select atlest 10 to 30 pictures"
                              );
                          setCustomDialogType(null);
                          return;
                        }
                      }}
                    />
                    <p className="text-center text-xs text-error-main h-[10px]">
                      {errorMessage}
                    </p>
                  </div>
                </>
              ) : null}
            </div>
          </div>
        </form>
      </CustomDialog>

      <CustomDialog className="  min-h-[300px]  h-fit w-[600px]">
        {customDialogType === "TERMS_OF_SERVICE" ? (
          <TermsOfServices
            onCancel={() => {
              setPolicy(null);
            }}
          />
        ) : customDialogType === "PRIVACY_POLICY" ? (
          <PrivacyPolicy
            onCancel={() => {
              setPolicy(null);
            }}
          />
        ) : customDialogType === "CONTENT_POLICY" ? (
          <ContentPolicy
            onCancel={() => {
              setPolicy(null);
            }}
          />
        ) : null}
      </CustomDialog>
    </>
  );
};

export default AIModelTraining;
