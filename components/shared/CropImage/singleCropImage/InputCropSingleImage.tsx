"use client";
import React, {
  useCallback,
  useRef,
  useEffect,
  forwardRef,
  useState,
  ChangeEvent,
} from "react";

import { ImageInfo, SingleImagePlaceholder } from "@/types";
import { useAuthContext } from "@/context/AuthContext";
import appConstant from "@/utils/constants/withoutHtml/appConstant";
import { Box, IconButton } from "@mui/material";
import ImagePlaceHolderGalleryIcon from "@/utils/icons/createPost/ImagePlaceHolderGalleryIcon";
import displaySingleImage from "@/service/imageCropper/DisplaySingleImage";
import getCroppedImg from "@/service/imageCropper/cropImage";
import CropSingleImageDialog from "./CropSingleImageDialog";
import Image from "next/image";
import { CustomImagePreview } from "../../CustomImagePreview";

type Props = {
  type?: string;
  placeholder?: SingleImagePlaceholder;
  aspect?: string;
  finalImage: { imagePreview: string; file: File } | null;
  setFinalImage: React.Dispatch<
    React.SetStateAction<{ imagePreview: string; file: File } | null>
  >;
  // clearError: UseFormClearErrors<CharacterInfo>;
} & Record<string, any>;

let filename: string = "";

const InputCropSingleImage = forwardRef(
  (
    {
      aspect,
      type,
      placeholder,
      finalImage,
      setFinalImage,
      ...restProps
    }: Props,
    ref
  ) => {
    const imageInputRef = useRef<HTMLInputElement>(null);
    const { croppingImage, setCroppingImage, setCustomDialogType } =
      useAuthContext();
    const [isDragging, setisDragging] = useState(false);
    const [cropDialog, setCropDialog] = useState(false);

    const handleImageSelection = (
      event: React.ChangeEvent<HTMLInputElement>
    ) => {
      // clearError("image");

      const file = event.target.files?.[0];
      if (file) {
        displaySingleImage(file, setCroppingImage);
        // setCroppingImage((prev) => {
        //   return {
        //     ...prev,
        //     image: {
        //       ...prev.image,
        //       aspectRatio:
        //         aspect === undefined ? appConstant.defaultaspectRatio : aspect,
        //     },
        //   };
        // });

        //  cropdialog disable until solve the issue how to put dialog
        if (type === "MESSAGE" || type === "CREATE") {
          setCropDialog(false);
          // setCustomDialogType(null);
        } else {
          // setCustomDialogType("SINGLCROPPINGIMAGE");
          setCropDialog(true);
        }
      }
    };

    const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      setisDragging(true);
    };
    const handleLeave = (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      setisDragging(false);
    };

    const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      setisDragging(false);

      const file = event.dataTransfer.files[0];
      displaySingleImage(file, setCroppingImage);
      setCroppingImage((prev) => {
        return {
          ...prev,
          image: {
            ...prev.image,
            aspectRatio:
              aspect === undefined ? appConstant.defaultaspectRatio : aspect,
          },
        };
      });

      //  cropdialog disable until solve the issue how to put dialog
      if (type === "MESSAGE" || type === "CREATE") {
        setCropDialog(false);
        // setCustomDialogType(null);
      } else {
        // setCustomDialogType("SINGLCROPPINGIMAGE");

        setCropDialog(true);
      }
    };

    // const handleResetInputValue = (event: React.MouseEvent<HTMLElement>) => {
    //   event.target.value = null;
    // };

    const handleImageContainerClick = (e: React.MouseEvent<HTMLElement>) => {
      e.stopPropagation();
      if (imageInputRef.current) {
        imageInputRef.current.click();
      }
    };

    const showCroppedImage = useCallback(async () => {
      try {
        const croppedImage = await getCroppedImg(
          croppingImage?.image?.src!,
          croppingImage?.image?.croppedPixels,
          0
        );

        if (croppedImage !== null) {
          setCroppingImage((prev) => {
            return {
              ...prev,
              croppedImageSrc: croppedImage,
              name: filename,
            };
          });

          if (setFinalImage !== undefined) {
            // setFinalImage((prev) => {
            //   return {
            //     ...prev,
            //     image: {
            //       ...prev.image,
            //       src: croppingImage.image?.src,
            //       objectFit: croppingImage.image?.objectFit,
            //       aspectRatio: croppingImage.image?.aspectRatio,
            //       zoom: croppingImage.image?.zoom,
            //       crop: croppingImage.image?.crop,
            //       croppedPixels: croppingImage.image?.croppedPixels,
            //       size: croppingImage.image?.size,
            //       croppedImageSrc: croppedImage,
            //       name: filename,
            //     },
            //   };
            // });
          }
        }
        // setCustomDialogType(null);

        setCropDialog(false);
      } catch (e) {
        console.error(e);
      }
    }, [croppingImage?.image?.croppedPixels]);

    useEffect(() => {
      setCroppingImage((prev) => {
        return {
          ...prev,
          aspectRatio:
            aspect === undefined ? appConstant.defaultaspectRatio : aspect,
        };
      });
    }, []);

    const onImageChange = (event: ChangeEvent<HTMLInputElement>) => {
      if (event.target.files && event.target.files[0]) {
        let reader = new FileReader();
        let file = event.target.files[0];
        reader.onloadend = () => {
          setFinalImage({
            // ...mydata,
            imagePreview: reader.result as string,
            file: file,
          });
        };
        reader.readAsDataURL(file);
      }
    };

    return (
      <Box sx={{ width: "100%", height: "100%" }} {...restProps}>
        <input
          type="file"
          accept=".jpg, .jpeg, .png"
          className="hidden"
          ref={imageInputRef}
          onChange={onImageChange}
          // onClick={handleResetInputValue}
        />
        {finalImage?.imagePreview ? (
          <div
            className={`relative w-full h-full aspect-[${
              aspect === undefined ? appConstant.defaultaspectRatio : aspect
            }] flex items-center justify-center cursor-pointer select-none`}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onDragLeave={handleLeave}
            onClick={() => {
              // setCroppingImage(finalImage);
              // setCropDialog(true);
              // setCustomDialogType("SINGLCROPPINGIMAGE");
            }}
          >
            {/* {isDragging ? (
              <div
                // htmlFor="contained-button-file"
                className={` absolute z-20 bg-secondary-light items-center justify-center w-[100%] h-[100%] aspect-[${
                  aspect === undefined ? appConstant.defaultaspectRatio : aspect
                }] cursor-pointer flex`}
              >
                <div className="flex flex-col text-common-white items-center justify-center md:text-[1rem] text-[0.8rem]">
                  {placeholder?.placeholderImg}
                  {placeholder?.placeholderTitle}
                </div>
              </div>
            ) : null} */}
            <div className="relative object-cover w-full h-full bg-grey-600 rounded-2xl m-0 overflow-hidden pointer-events-none">
              <CustomImagePreview image={finalImage.imagePreview} />
            </div>
            {!isDragging ? (
              <IconButton
                className=" absolute right-[-16px] bottom-[-16px] bg-primary-main p-4 text-common-white cursor-pointer"
                onClick={handleImageContainerClick}
              >
                <ImagePlaceHolderGalleryIcon />
              </IconButton>
            ) : null}
          </div>
        ) : (
          <>
            {type === "PROFILEIMG" ||
            type === "CREATEOFFER" ||
            type === "UPLOADID" ||
            type === "MESSAGE" ||
            type === "AIVERIFICATION" ||
            type === "CREATE" ? (
              <div
                onClick={handleImageContainerClick}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                onDragLeave={handleLeave}
                // htmlFor="contained-button-file"
                className={`items-center justify-center w-[100%] h-[100%] aspect-[${
                  aspect === undefined ? appConstant.defaultaspectRatio : aspect
                }] cursor-pointer flex`}
              >
                <div className="flex flex-col text-common-white items-center justify-center md:text-[1rem] text-[0.8rem]">
                  {placeholder?.placeholderImg}
                  {placeholder?.placeholderTitle}
                </div>
              </div>
            ) : null}
          </>
        )}
        {cropDialog === true ? (
          <CropSingleImageDialog
            cropperAspectRatio={
              aspect === undefined ? appConstant.defaultaspectRatio : aspect
            }
            type={type ? type : ""}
            handleEvent={() => {
              showCroppedImage();
            }}
          />
        ) : null}
      </Box>
    );
  }
);

InputCropSingleImage.displayName = "image";

export default InputCropSingleImage;
