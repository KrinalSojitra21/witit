/* eslint-disable @next/next/no-img-element */
import React, { useEffect, useState } from "react";

import Image from "next/image";
import {
  image1,
  image2,
  image3,
  image4,
  image5,
  image6,
  image7,
  image8,
  image9,
  image10,
  image11,
  image12,
  image13,
  image14,
  image15,
  image16,
} from "@/utils/constants/withoutHtml/loginImages";
import { CustomImagePreview } from "../shared/CustomImagePreview";

const ImageLine = ({ imageList }: { imageList: string[] }) => {
  return (
    <>
      <div className="flex flex-col">
        {imageList.map((image, index) => {
          return (
            <div key={index} className="slider_img bg-grey-600">
              <CustomImagePreview image={image} />
            </div>
          );
        })}
      </div>
      <div className="flex flex-col">
        {imageList.map((image, index) => {
          return (
            <div key={index} className="slider_img bg-grey-600">
              <CustomImagePreview image={image} />
            </div>
          );
        })}
      </div>
    </>
  );
};

export const ImageSliderAnimationShowBox = () => {
  return (
    <>
      <div className="wrapper relative lg:flex hidden  justify-center items-center">
        <div className="contenr relative flex items-center justify-center">
          <div className="slide_b-t flex-1 flex flex-col">
            <ImageLine
              imageList={[
                image1,
                image2,
                image3,
                image4,
                image5,
                image6,
                image7,
                image8,
              ]}
            />
          </div>
          <div className="slide_t-b flex-1 flex flex-col">
            <ImageLine
              imageList={[
                image9,
                image10,
                image11,
                image12,
                image13,
                image14,
                image15,
                image16,
              ]}
            />
          </div>
          <div className="slide_b-t flex-1 flex flex-col">
            <ImageLine
              imageList={[
                image5,
                image6,
                image7,
                image8,
                image1,
                image2,
                image3,
                image4,
              ]}
            />
          </div>
          <div className="slide_t-b flex-1 flex flex-col">
            <ImageLine
              imageList={[
                image13,
                image14,
                image15,
                image16,
                image9,
                image10,
                image11,
                image12,
              ]}
            />
          </div>
        </div>
      </div>
      <div
        className="absolute bottom-0 right-0 z-30 lg:flex hidden
      py-5 px-16  w-[50%]"
      >
        <h1
          style={{
            boxShadow:
              "inset 46.2667px -46.2667px 46.2667px rgba(17, 18, 21, 0.1), inset -46.2667px 46.2667px 46.2667px rgba(255, 255, 255, 0.1)",
            backdropFilter: "blur(6px)",
          }}
          className="text-common-white bg-[#17181b99] rounded-md text-center py-5 w-full font-medium"
        >
          Some Images which are generate through witit
        </h1>
      </div>
    </>
  );
};
