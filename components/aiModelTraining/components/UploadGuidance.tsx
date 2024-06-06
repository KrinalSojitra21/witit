import React from "react";
import CheckIcon from "@/utils/icons/shared/CheckIcon";
import CloseIcon from "@/utils/icons/shared/CloseIcon";
import highQulity from "@/utils/images/aiModelTraining/highQulity.jpg";
import varietyOfAngles from "@/utils/images/aiModelTraining/varietyOfAngles.jpg";
import varietyOfLighting from "@/utils/images/aiModelTraining/varietyOfLighting.jpg";
import varietyOfLocations from "@/utils/images/aiModelTraining/varietyOfLocations.jpg";
import blurry from "@/utils/images/aiModelTraining/blurry.jpg";
import multiplePeople from "@/utils/images/aiModelTraining/multiplePeople.jpg";
import farAway from "@/utils/images/aiModelTraining/farAway.jpg";
import CoveringFace from "@/utils/images/aiModelTraining/CoveringFace.jpg";
import selfies from "@/utils/images/aiModelTraining/selfies.jpg";
import sitting from "@/utils/images/aiModelTraining/sitting.jpg";
import landscapeOriantation from "@/utils/images/aiModelTraining/landscapeOriantation.jpg";
import Image from "next/image";

const PhotosToUseList = [
  { name: "High Quality", image: highQulity },
  { name: "Varity of Lighting", image: varietyOfLighting },
  { name: "Varity of Angles", image: varietyOfAngles },
  { name: "Varity of Locations", image: varietyOfLocations },
];
const PhotosToAvoidList = [
  { name: "Blurry", image: blurry },
  { name: "Multiple People", image: multiplePeople },
  { name: "Far Away", image: farAway },
  { name: "Covering Your Face", image: CoveringFace },
];
const CouldProduceMixedResults = [
  { name: "Selfies", image: selfies },
  { name: "Sitting", image: sitting },
  { name: "Landscape Orientation", image: landscapeOriantation },
];

const UploadGuidance = () => {
  return (
    <div className=" flex gap-2 h-[485px] px-2 py-2">
      <div className=" flex flex-col flex-1  gap-2">
        <div className=" text-success-light flex items-center  gap-1">
          <div className=" w-[18px] h-[18px] flex justify-center items-center bg-success-light rounded-md">
            <CheckIcon />
          </div>
          <p className=" text-sm font-semibold">Photos to use</p>
        </div>
        <div className="bg-grey-800 rounded-lg p-3 flex flex-col gap-1 ">
          <div className="  grid grid-cols-2 gap-2  ">
            {" "}
            {PhotosToUseList.map((photo, index) => {
              return (
                <div key={index} className=" relative">
                  <div className="absolute top-1 right-1 z-20 w-[18px] h-[18px] flex justify-center items-center bg-success-light rounded-md">
                    <CheckIcon />
                  </div>
                  <PhotoGuideItem photo={photo} />
                </div>
              );
            })}
          </div>

          <p className=" text-[9px] text-success-light">
            For optimal results, please use photos similar in style to those
            provided in the above section.
          </p>
        </div>
      </div>

      <div className=" flex flex-col flex-1  gap-2 ">
        <div className="text-[#EC3737] flex items-center  gap-2 ">
          <div className=" w-[18px] h-[18px] flex justify-center items-center bg-[#EC3737] rounded-md">
            <CloseIcon />
          </div>
          <p className=" text-sm font-semibold">Photos to Avoid</p>
        </div>

        <div className="bg-grey-800 rounded-lg p-3 flex flex-col gap-2 ">
          {" "}
          <div className=" grid grid-cols-2 gap-2">
            {PhotosToAvoidList.map((photo, index) => {
              return (
                <div key={index} className=" relative">
                  <div className=" absolute top-1 right-1 z-20 w-[18px] h-[18px] flex justify-center items-center bg-[#EC3737] rounded-md">
                    <CloseIcon />
                  </div>
                  <PhotoGuideItem photo={photo} />
                </div>
              );
            })}
          </div>
          <p className=" text-[9px]  text-[#EC3737]">
            For optimal results, please avoid using photos that are similar in
            style to those provided in the above section.
          </p>
        </div>
      </div>

      <div className=" flex flex-col flex-1  gap-2">
        <div className="text-[#F4D150] flex items-center gap-2 ">
          <div className=" w-[18px] h-[18px] flex justify-center items-center bg-[#F4D150] rounded-md">
            !
          </div>
          <p className=" text-sm font-semibold">Photos to Avoid</p>
        </div>
        <div className="bg-grey-800 rounded-lg p-3 flex flex-col gap-1">
          <div className=" grid grid-cols-2 gap-2  ">
            {CouldProduceMixedResults.map((photo, index) => {
              return (
                <div key={index} className="relative ">
                  {index < CouldProduceMixedResults.length - 1 ? (
                    <div>
                      <div className=" absolute top-1 right-1 z-20 w-[18px] h-[18px] flex justify-center items-center bg-[#F4D150] rounded-md">
                        !
                      </div>
                      <PhotoGuideItem photo={photo} />
                    </div>
                  ) : null}
                </div>
              );
            })}
          </div>
          <div className=" relative w-full  flex flex-col bg-grey-600 rounded-md gap-1 pb-2">
            <div className=" absolute top-1 right-1 z-20 w-[18px] h-[18px] flex justify-center items-center bg-[#F4D150] rounded-md">
              !
            </div>
            <Image
              fill
              src={CouldProduceMixedResults[2].image}
              alt=""
              className="relative rounded-md w-full aspect-[18/9]"
            />
            <p className="  text-[10px]  font-medium tracking-normal text-grey-300 px-3">
              {CouldProduceMixedResults[2].name}
            </p>
          </div>
          <p className=" text-[9px] text-[#F4D150] line-clamp-3">
            Utilizing photos similar in style to those provided in the above
            section may yield mixed results.photos similar in style to those
            provided in the above section.
          </p>
        </div>
      </div>
    </div>
  );
};

export default UploadGuidance;

const PhotoGuideItem = ({ photo }: any) => {
  return (
    <div className=" h-full w-full flex flex-col bg-grey-600 rounded-md gap-1 pb-2">
      <Image
        fill
        src={photo.image}
        alt=""
        className="relative object-cover  rounded-md w-full aspect-[16/17]"
      />
      <p className=" text-[10px] font-medium tracking-normal text-grey-300 px-3 line-clamp-1">
        {photo.name}
      </p>
    </div>
  );
};
