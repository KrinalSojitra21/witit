/* eslint-disable react-hooks/exhaustive-deps */
import ArrowDownIcon from "@/utils/icons/shared/ArrowDownIcon";
import { useAuthContext } from "@/context/AuthContext";
import CloseIcon from "@/utils/icons/shared/CloseIcon";
import { ImageInfo } from "@/types";
import appConstant, {
  defaultImageConstant,
} from "@/utils/constants/withoutHtml/appConstant";
import CustomInputTextField from "@/components/shared/CustomInputTextField";
import CustomButton from "@/components/shared/CustomButton";
import React, { useEffect, useState } from "react";
import {
  CircularProgress,
  Divider,
  FormHelperText,
  IconButton,
  Slider,
  styled,
} from "@mui/material";
import { theme } from "@/theme";
import PlusIcon from "@/utils/icons/shared/PlusIcon";
import EditIcon from "@/utils/icons/shared/EditIcon";
import DeleteIcon from "@/utils/icons/shared/DeleteIcon";
import LikeIcon from "@/utils/icons/shared/LikeIcon";
import temp1 from "@/utils/images/temp1.jpg";
import Image from "next/image";
import CasualCategoryIcon from "@/utils/icons/createPost/selectCategoryIcons/CasualCategoryIcon";
import NormalLeftArrowIcon from "@/utils/icons/shared/NormalLeftArrowIcon";
import { CustomSlider } from "@/components/shared/CustomSlider";
import CustomDialog from "@/components/shared/dialog/CustomDialog";
import ConfirmationDialog from "@/components/shared/ConfirmationDialog";
import InputCropSingleImage from "@/components/shared/cropImage/singleCropImage/InputCropSingleImage";
import Lottie from "lottie-react";
import ImagePlaceholderLottie from "@/utils/lottie/ImagePlaceholderLottie.json";
import { DeleteOfferImage } from "@/utils/images/offering";
import { Controller, useForm } from "react-hook-form";
import { uploadImageToStorage } from "@/service/firebase/uploadImage";
import { ImageState } from "@/types/post";
import { CreateOffering, OfferingData } from "@/types/offering";
import createOffering from "@/api/offering/createOffering";
import { getImageObject } from "@/service/shared/getImageObject";
import deleteOffering from "@/api/offering/deleteOffering";
import { updateOffering } from "@/api/offering/updateOffering";
import CustomLoadingButton from "@/components/shared/CustomLoadingButton";
import { useRouter } from "next/router";
import { CustomImagePreview } from "@/components/shared/CustomImagePreview";

type Props = {
  dialogType:
    | "VIEWOFFER"
    | "EDITOFFERING"
    | "CREATEOFFER"
    | "CREATEOFFERDETAILS"
    | null;
  setDialogType: React.Dispatch<
    React.SetStateAction<
      "VIEWOFFER" | "EDITOFFERING" | "CREATEOFFER" | "CREATEOFFERDETAILS" | null
    >
  >;
  openOfferData: OfferingData | null;
  setOpenOfferData: React.Dispatch<React.SetStateAction<OfferingData | null>>;
  setOfferingData: React.Dispatch<React.SetStateAction<OfferingData[]>>;
  handleUpdateLikeStatus: ({
    offeringId,
    isLike,
  }: {
    offeringId: string;
    isLike: boolean;
  }) => void;
};

const CreateOfferDialog = ({
  dialogType,
  setDialogType,
  openOfferData,
  setOpenOfferData,
  setOfferingData,
  handleUpdateLikeStatus,
}: Props) => {
  const router = useRouter();
  const { user } = router.query;

  const [sliderValue, setsliderValue] = React.useState<number[]>([20, 37]);
  const [deleteOfferingId, setDeleteOfferingId] = useState<string | null>(null);
  const [finalOfferImage, setFinalOfferImage] = useState<ImageState | null>(
    null
  );
  const [isOfferImageLoading, setIsOfferImageLoading] = useState(false);
  const { firebaseUser, sendNotification, amountPerCredit } = useAuthContext();
  const [isDataUploading, setIsDataUploading] = useState(false);

  const {
    handleSubmit,
    control,
    setValue,
    reset,
    setError,
    clearErrors,
    getValues,
    watch,
    formState: { errors, isSubmitting, isDirty, dirtyFields },
  } = useForm<CreateOffering>({
    defaultValues: {
      name: "",
      image: [],
      offeringDescription: "",
      creditRange: {
        min: 0,
        max: 0,
      },
    },
    mode: "onSubmit",
  });

  const setDefaultValue = async () => {
    if (!openOfferData) return;
    setIsOfferImageLoading(true);
    reset({
      name: openOfferData.name,
      image: openOfferData.image,
      offeringDescription: openOfferData.offeringDescription,
      creditRange: {
        min: openOfferData.creditRange.min,
        max: openOfferData.creditRange.max,
      },
    });
    const { file } = await getImageObject(openOfferData.image[0]);
    setFinalOfferImage({ imagePreview: openOfferData.image[0], file });
    setValue("image", openOfferData.image);
    setIsOfferImageLoading(false);
  };
  useEffect(() => {
    if (dialogType === "EDITOFFERING" && openOfferData) {
      setDefaultValue();
    }
  }, [dialogType, openOfferData]);

  const handleNextClick = () => {
    setDialogType("CREATEOFFERDETAILS");
  };

  const handleBackClick = () => {
    if (dialogType === "CREATEOFFERDETAILS") {
      if (openOfferData) {
        setDialogType("EDITOFFERING");
      } else {
        setDialogType("CREATEOFFER");
      }
    }
    if (dialogType === "EDITOFFERING") {
      setDialogType("VIEWOFFER");
    }
  };
  const handleCloseDialog = () => {
    if (dialogType === "EDITOFFERING") {
      setDialogType("VIEWOFFER");
    } else if (
      dialogType === "CREATEOFFER" ||
      dialogType === "VIEWOFFER" ||
      dialogType === "CREATEOFFERDETAILS"
    ) {
      setDialogType(null);
      setOpenOfferData(null);
    }
    setFinalOfferImage(null);
    reset({
      name: "",
      image: [],
      offeringDescription: "",
      creditRange: {
        min: 0,
        max: 0,
      },
    });
  };

  const handleMakeOfferClick = async () => {
    if (!finalOfferImage) return;
    // sendNotification({ type: "LOADING" });
    if (openOfferData) {
      setIsDataUploading(true);
      let imageUrl = "";
      if (finalOfferImage.imagePreview.includes("data:image/")) {
        imageUrl = await uploadImageToStorage({
          folderName: "offering_images",
          file: finalOfferImage.file,
          metadata: {
            userId: firebaseUser?.uid,
          },
        });
      }

      if (imageUrl !== "" || Object.keys(dirtyFields).length !== 0) {
        const UpdateOfferingData = {
          offeringId: openOfferData.offeringId,
          ...(Object.hasOwn(dirtyFields, "name") && {
            name: getValues("name"),
          }),
          ...(imageUrl !== "" && {
            image: [imageUrl],
          }),
          ...(Object.hasOwn(dirtyFields, "offeringDescription") && {
            offeringDescription: getValues("offeringDescription"),
          }),
          ...(Object.hasOwn(dirtyFields, "creditRange") && {
            creditRange: getValues("creditRange"),
          }),
        };
        const response = await updateOffering({
          user_id: firebaseUser?.uid!,
          UpdateOfferingData,
        });
        if (response.status === 200) {
          setOfferingData((prevOfferings) => {
            return prevOfferings.map((offering) => {
              if (offering.offeringId === openOfferData.offeringId) {
                return {
                  ...offering,
                  ...(Object.hasOwn(dirtyFields, "name") && {
                    name: getValues("name"),
                  }),
                  ...(imageUrl !== "" && {
                    image: [imageUrl],
                  }),
                  ...(Object.hasOwn(dirtyFields, "offeringDescription") && {
                    offeringDescription: getValues("offeringDescription"),
                  }),
                  ...(Object.hasOwn(dirtyFields, "creditRange") && {
                    creditRange: {
                      min: getValues("creditRange.min"),
                      max: getValues("creditRange.max"),
                      avg:
                        (Number(getValues("creditRange.max")) +
                          Number(getValues("creditRange.min"))) /
                        2,
                    },
                  }),
                };
              } else {
                return offering;
              }
            });
          });
          sendNotification({ type: "SUCCESS", message: "Offer Data updated" });
          setDialogType(null);
          setOpenOfferData(null);
        } else {
          sendNotification({ type: "ERROR", message: response.error });
        }
      }
    } else {
      setIsDataUploading(true);
      const imageUrl = await uploadImageToStorage({
        folderName: "offering_images",
        file: finalOfferImage.file,
        metadata: {
          userId: firebaseUser?.uid,
        },
      });

      setValue("image", [imageUrl]);
      if (imageUrl) {
        const response = await createOffering({
          offeringDetails: watch(),
          user_id: firebaseUser?.uid,
        });
        if (response.status === 200) {
          sendNotification({ type: "SUCCESS", message: "Offer created" });
          setDialogType(null);
          setOfferingData((preValue) => [...preValue, response.data!]);
        } else {
          sendNotification({ type: "ERROR", message: response.error });
        }
      }
    }
    setIsDataUploading(false);
  };

  const handleDeleteClick = async () => {
    if (!firebaseUser) return;
    sendNotification({ type: "LOADING" });
    const response = await deleteOffering({
      user_id: firebaseUser.uid,
      offeringId: deleteOfferingId!,
    });
    if (response.status === 200) {
      sendNotification({ type: "SUCCESS", message: "Offer Deleted" });
      setDialogType(null);
      setOfferingData((preValue) =>
        preValue.filter((offer) => offer.offeringId !== deleteOfferingId)
      );
      setDeleteOfferingId(null);
    } else {
      sendNotification({ type: "ERROR", message: response.error });
    }
  };

  return (
    <div>
      <CustomDialog
        className={`${
          dialogType === "VIEWOFFER"
            ? "max-w-[500px] min-w-[400px] min-h-[500px]"
            : "min-w-[900px] min-h-[484.25px]"
        }  h-fit`}
        onCancel={handleCloseDialog}
        // onCancel={() => {
        //   setDialogType(null), setFinalOfferImage(null);
        //   setCroppingImage({ ...defaultImageConstant, isShowGrid: false });
        // }}
        isOpen={dialogType !== null}
      >
        {dialogType === "VIEWOFFER" ? (
          <div className="flex flex-col h-full pb-5 ">
            <div className="h-fit">
              <div className=" flex flex-col gap-2 px-5 pt-5 pb-2">
                <div className="flex justify-between ">
                  <p className=" text-base tracking-wider">
                    {openOfferData?.name}
                  </p>
                  <div
                    className={`flex gap-7 ${user ? "invisible" : "visible"}`}
                  >
                    <div
                      onClick={() => {
                        setDialogType("EDITOFFERING");
                      }}
                    >
                      <EditIcon />
                    </div>
                    <div
                      onClick={() => {
                        setDeleteOfferingId(openOfferData?.offeringId!);
                      }}
                    >
                      <DeleteIcon />
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-7 text-sm  text-grey-100 ">
                  <div className="flex items-center gap-2">
                    <div
                      className={` scale-[0.85] cursor-pointer ${
                        openOfferData?.isUserLike && "text-error-main"
                      }`}
                      onClick={() =>
                        handleUpdateLikeStatus({
                          offeringId: openOfferData?.offeringId!,
                          isLike: !openOfferData?.isUserLike,
                        })
                      }
                    >
                      <LikeIcon isFilled={openOfferData?.isUserLike} />
                    </div>
                    <p>{openOfferData?.counts.like}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="scale-[0.7]">
                      <CasualCategoryIcon />
                    </div>
                    <p>{openOfferData?.completeOffers}</p>
                  </div>
                </div>
              </div>
              <Divider
                sx={{
                  borderColor: theme.palette.grey[500],
                }}
              />
            </div>
            <div className="px-5 pt-3 gap-4 flex flex-col flex-grow ">
              <div className="relative  aspect-video rounded-md overflow-hidden bg-grey-600">
                <CustomImagePreview image={openOfferData?.image[0]!} />
              </div>

              <div className="w-full justify-between flex text-sm ">
                <div className="flex gap-1 ">
                  <p>Min. Credit:</p>
                  <p className=" font-light text-grey-200">
                    {openOfferData?.creditRange.min}
                  </p>
                </div>
                <div className="flex gap-1 ">
                  <p>Avg. Credit:</p>
                  <p className=" font-light text-grey-200">
                    {openOfferData?.creditRange.avg}
                  </p>
                </div>
                <div className="flex gap-1 ">
                  <p>Max. Credit:</p>
                  <p className=" font-light text-grey-200">
                    {openOfferData?.creditRange.max}
                  </p>
                </div>
              </div>
              <Divider
                sx={{
                  borderColor: theme.palette.grey[500],
                }}
              />
              <div className="flex flex-col gap-2 max-h-[250px] mb-2">
                <p className="text-sm">Description:</p>
                <ul className="list ml-10  tracking-wider text-grey-200 text-xs  overflow-auto">
                  <li className="mb-2">{openOfferData?.offeringDescription}</li>
                </ul>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col h-full">
            <div className="z-20 flex justify-between items-center px-[20px] border-b border-grey-500 py-5 w-full">
              <div className="flex items-center gap-3">
                {dialogType === "CREATEOFFER" ? (
                  <div className="  text-common-white border rounded-lg border-solid p-2 scale-50 ">
                    <PlusIcon />
                  </div>
                ) : (
                  <div onClick={handleBackClick} className="cursor-pointer">
                    <NormalLeftArrowIcon />
                  </div>
                )}

                <div className="heading1 text-lg font-medium">
                  {openOfferData ? "Edit An Offering" : "Create An Offering"}
                </div>
              </div>
              <IconButton
                className=" text-common-white  "
                onClick={handleCloseDialog}
              >
                <CloseIcon isBorderRounded={true} />
              </IconButton>
            </div>

            {dialogType === "CREATEOFFER" || dialogType === "EDITOFFERING" ? (
              <div className=" flex p-5 gap-5 flex-grow  ">
                <div
                  className={`w-[40%] flex-grow flex items-center justify-center `}
                >
                  <div
                    className={`max-w-[300px] max-h-[300px]  w-full h-full rounded-[10px] ${
                      !finalOfferImage ? "border" : ""
                    } border-grey-500 border-dashed`}
                  >
                    {isOfferImageLoading ? (
                      <div className="mt-4 text-common-white text-center w-full overflow-hidden flex items-center h-full justify-center">
                        <CircularProgress
                          size={20}
                          className="text-common-white"
                        />
                      </div>
                    ) : (
                      <InputCropSingleImage
                        type="CREATEOFFER"
                        aspect={"1/1"}
                        finalImage={finalOfferImage}
                        setFinalImage={setFinalOfferImage}
                        placeholder={{
                          placeholderImg: (
                            <div>
                              <Lottie
                                animationData={ImagePlaceholderLottie}
                                className=" w-[200px]"
                              />
                            </div>
                          ),
                          placeholderTitle: (
                            <>
                              <h2 className="text-center md:pt-5 pt-3">
                                Drag profile pic here,
                              </h2>
                              <h2 className="  text-center">
                                or{" "}
                                <span className="text-primary-main">
                                  browse
                                </span>
                              </h2>
                            </>
                          ),
                        }}
                      />
                    )}
                  </div>
                </div>
                <div className="w-[60%] flex gap-3 flex-col ">
                  <Controller
                    name="name"
                    control={control}
                    rules={{
                      required: {
                        value: true,
                        message: "Offering Name required field",
                      },
                      validate: {
                        checkLength: (filedValue) => {
                          return (
                            filedValue.length > 2 ||
                            "Offering name should be at least 3 characters."
                          );
                        },
                      },
                    }}
                    render={({ field }) => (
                      <CustomInputTextField
                        {...field}
                        placeholder="Enter Offer Name Here"
                        tag="Offering Name"
                        error={errors?.name?.message}
                        inputRef={field.ref}
                      />
                    )}
                  />
                  <div className=" flex flex-col gap-1">
                    <p className=" ">Set Your Offering Credit Range</p>
                    <p className=" text-grey-200 text-xs font-light  w-[85%]">
                      Set Your Offering Credit Range With Minimum and Maximum
                      credit Values. so that candidate can offer in that valued
                      credit range.
                    </p>
                  </div>
                  <div className="flex gap-3 w-full">
                    <div className="flex flex-col gap-1 w-full">
                      <Controller
                        name="creditRange.min"
                        control={control}
                        rules={{
                          required: {
                            value: true,
                            message: "Minimum Credit required field",
                          },
                          validate: {
                            checkValue: (filedValue) => {
                              return (
                                filedValue < getValues("creditRange.max") ||
                                "Minimum credit should be smaller than the maximum credit."
                              );
                            },
                          },
                        }}
                        render={({ field }) => (
                          <CustomInputTextField
                            placeholder="Enter Minimum Credit"
                            tag="Minimum Credit"
                            inputRef={field.ref}
                            {...field}
                          />
                        )}
                      />
                      <p className="text-grey-200 text-xs font-light">
                        $
                        {(
                          watch("creditRange.min") * amountPerCredit.withdraw
                        ).toFixed(2)}
                      </p>
                    </div>
                    <div className="flex flex-col gap-1 w-full">
                      <Controller
                        name="creditRange.max"
                        control={control}
                        rules={{
                          required: {
                            value: true,
                            message: "Maximum Credit required field",
                          },
                          validate: {
                            checkValue: (filedValue) => {
                              return (
                                filedValue > watch("creditRange.min") ||
                                "Maximum credit should be greater than the maximum credit."
                              );
                            },
                          },
                        }}
                        render={({ field }) => (
                          <CustomInputTextField
                            placeholder="Enter Maximum Credit"
                            tag="Maximum credit"
                            type="number"
                            inputRef={field.ref}
                            {...field}
                          />
                        )}
                      />
                      <p className="text-grey-200 text-xs font-light">
                        $
                        {(
                          watch("creditRange.max") * amountPerCredit.withdraw
                        ).toFixed(2)}
                      </p>
                    </div>
                  </div>
                  {(errors?.creditRange?.max?.message ||
                    errors?.creditRange?.min?.message) && (
                    <FormHelperText error focused>
                      Maximum credit should be greater than the maximum credit.
                    </FormHelperText>
                  )}
                  <div className=" flex w-full justify-end">
                    <CustomButton
                      name="Next"
                      handleEvent={handleSubmit(handleNextClick)}
                      className="w-fit py-3 px-5"
                      endIcon={
                        <div className=" rotate-[270deg] flex items-center scale-75 ">
                          <ArrowDownIcon />
                        </div>
                      }
                    />
                  </div>
                </div>
              </div>
            ) : dialogType === "CREATEOFFERDETAILS" ? (
              <div className=" w-full h-full flex flex-col gap-7 p-5 items-center  ">
                <Controller
                  name="offeringDescription"
                  control={control}
                  rules={{
                    required: {
                      value: true,
                      message: "Offering description required field",
                    },
                    validate: {
                      checkLength: (filedValue) => {
                        return (
                          filedValue.length > 2 ||
                          "Offering description should be at least 3 characters."
                        );
                      },
                    },
                  }}
                  render={({ field }) => (
                    <CustomInputTextField
                      placeholder="Offering Details"
                      tag="Enter Offer Details Here"
                      multiline
                      rows={7}
                      inputRef={field.ref}
                      {...field}
                    />
                  )}
                />
                <CustomLoadingButton
                  name="Make An Offer"
                  className="w-fit px-20  py-3 mt-5"
                  onClick={handleSubmit(handleMakeOfferClick)}
                  loading={isDataUploading}
                />
              </div>
            ) : (
              <></>
            )}
          </div>
        )}
      </CustomDialog>
      {deleteOfferingId !== null ? (
        <ConfirmationDialog
          isOpen={deleteOfferingId !== null ? true : false}
          onCancel={() => {
            setDeleteOfferingId(null);
          }}
          onConform={handleDeleteClick}
          image={DeleteOfferImage}
          title={{
            titleMain: "Delete Offer?",
            title1: "Sure You Want to Delete This Offer From Your Account?",
            title2: " You will not be able to recover them again.",
          }}
        />
      ) : // <CustomDialog
      //   isOpen={deleteOfferingId !== null ? true : false}
      //   className=" border-2  max-w-[350px]  h-fit"
      //   onCancel={() => {
      //     setDeleteOfferingId(null);
      //   }}
      // >
      //   <div className="p-5 flex flex-col h-full justify-between min-h-[400px]  items-end">
      //     <IconButton
      //       className=" text-common-white"
      //       onClick={() => {
      //         setDeleteOfferingId(null);
      //       }}
      //     >
      //       <CloseIcon isBorderRounded={true} />
      //     </IconButton>
      //     <div className=" flex flex-col  items-center">
      //       <Image
      //         fill
      //         src={deleteImage}
      //         alt=""
      //         className="relative w-[100px] h-[100px] rounded-md"
      //       />
      //       <p>Delete Offer</p>
      //       <Divider
      //         sx={{
      //           borderColor: theme.palette.grey[500],
      //         }}
      //       />
      //       <p className="text-xs text-center text-grey-200 ">
      //         Sure You Want to Delete This Offer From Your Account?
      //       </p>
      //       <p className="text-xs text-center text-grey-200 ">
      //         You will not be able to recover them again.
      //       </p>
      //     </div>
      //     <CustomButton name="Delete" className="bg-[#FC5151]" />
      //   </div>
      // </CustomDialog>

      null}
    </div>
  );
};

export default CreateOfferDialog;
