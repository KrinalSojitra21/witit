import Image from "next/image";
import React from "react";
import tempboy from "@/utils/images/tempboy.jpg";
import slothImage from "@/utils/images/sloth_image.jpg";
const LeftUserInfo = () => {
  return (
    <div className="w-full  h-full relative flex flex-col justify-end">
      <Image fill src={slothImage} alt="" className=" h-full absolute z-0" />

      <div className="flex p-7  flex-col w-full  gap-3 z-20 ">
        <div className=" flex  w-full  items-center  gap-3  ">
          <Image
            fill
            src={tempboy}
            alt=""
            className="relative w-[44px] h-[44px] rounded-full"
          />
          <div className="flex flex-col gap-1">
            <p className=" text-sm font-light">Alex goot</p>
            <p className="text-grey-200 text-xs font-light tracking-wide">
              alexgoot@gmail.com
            </p>
          </div>
        </div>{" "}
        <div className=" text-3xl font-bold">Level up your AI</div>
        <p className="text-grey-200 text-xs font-light tracking-wide">
          Generate stunning AI-generated images of Yourself within seconds,
          using the premium access features.
        </p>
      </div>
    </div>
  );
};

export default LeftUserInfo;
