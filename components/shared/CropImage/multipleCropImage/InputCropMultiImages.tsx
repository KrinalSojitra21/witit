/* eslint-disable @next/next/no-img-element */
"use client";
import React, { useState, useRef, useEffect, forwardRef } from "react";
import { ImageInfo } from "@/types";
import ImagePlaceHolderGalleryIcon from "@/utils/icons/createPost/ImagePlaceHolderGalleryIcon";
import Lottie from "lottie-react";
import ImagePlaceholderLottie from "@/utils/lottie/ImagePlaceholderLottie.json";
import DisplayMultipleImages from "@/service/imageCropper/DisplayMultipleImages";

type Props = {
  setSelectdImgs: React.Dispatch<
    React.SetStateAction<
      {
        image: ImageInfo;
        index: number;
      }[]
    >
  >;
  isSmall: boolean;
  isEnabled: boolean;
};

const InputCropMultiImages = forwardRef(
  ({ setSelectdImgs, isSmall, isEnabled }: Props, ref) => {
    const [multiImages, setMultiImages] = useState<
      {
        image: ImageInfo;
        index: number;
      }[]
    >([]);

    const imageInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
      if (multiImages.length !== 0) setSelectdImgs(multiImages);
    }, [multiImages]);

    const handleImageSelection = (
      event: React.ChangeEvent<HTMLInputElement>
    ) => {
      const files = event.target.files;
      if (files) {
        // setMultiImages([]);
        DisplayMultipleImages(Array.from(files), setMultiImages);
      }
    };

    const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();
    };

    const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      const files = event.dataTransfer.files;
      if (files) {
        // setMultiImages([]);
        DisplayMultipleImages(Array.from(files), setMultiImages);
      }
    };

    const handleResetInputValue = (event: any) => {
      event.target.value = null;
    };

    const handleImageContainerClick = () => {
      if (imageInputRef.current) {
        imageInputRef.current.click();
      }
      // setTempObjectfit(undefined);
    };

    return (
      <div
        className={`w-full h-full  ${
          isSmall ? "" : "min-h-[400px]"
        }  flex justify-center  items-center relative`}
      >
        <input
          multiple
          disabled={!isEnabled}
          type="file"
          accept=".jpg, .jpeg, .png"
          className="hidden "
          ref={imageInputRef}
          onChange={handleImageSelection}
          onClick={handleResetInputValue}
        />
        {/* <Tooltip title={`${isEnabled ? "" : "Upload only 10 Images"}`}> */}

        {isSmall ? (
          <div
            className=" aspect-[3/4] w-full flex items-center justify-center "
            onClick={handleImageContainerClick}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          >
            <ImagePlaceHolderGalleryIcon />
          </div>
        ) : (
          <div
            onClick={handleImageContainerClick}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            // htmlFor="contained-button-file"
            className={
              "flex items-center justify-center cursor-pointer bg-opacity-95 absolute  w-full h-full "
            }
          >
            <div className="">
              <div className="" style={{ width: 200 }}>
                <Lottie animationData={ImagePlaceholderLottie} />
              </div>
              <div className={`text-center ${isSmall ? "hidden" : "flex"}`}>
                Drag profile pic here,or
                <span className="text-primary-main pl-1"> browse</span>
              </div>
            </div>

            {/* <div
            className={`text-common-white md:text-[1rem] text-[0.8rem] w-full h-full`}
          >
            <div className="w-[100%] h-[100%] flex justify-center bg-primary-main">
              {isSmall ? (
                <ImagePlaceHolderGalleryIcon />
              ) : (
                <div className=" bg-primary-main" style={{ width: 200 }}>
                  <Lottie animationData={ImagePlaceholderLottie} />
                </div>
              )}
            </div>
            <div className={`text-center ${isSmall ? "hidden" : "flex"}`}>
              Drag profile pic here,or
              <span className="text-primary-main pl-1"> browse</span>
            </div>
          </div> */}
          </div>
        )}
        {/* </Tooltip> */}
      </div>
    );
  }
);

InputCropMultiImages.displayName = "images";

export default InputCropMultiImages;
