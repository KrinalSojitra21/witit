import React from "react";
import Slider from "@mui/material/Slider";
import { theme } from "@/theme";
import RangeTrueIcon from "@/utils/icons/setting/aiModelTranning/RangeTrueIcon";
type Props = {
  photosLength: number;
};

const PhotosQualityRange = ({ photosLength }: Props) => {
  const sldiers = [{ offset: 10 }, { offset: 20 }, { offset: 30 }];

  const SliderComponent = () => {
    return (
      <>
        {sldiers.map((_, index) => (
          <Slider
            key={index}
            aria-label="Temperature"
            defaultValue={
              photosLength - (index + 1) * 10 > 0
                ? 10
                : 10 + (photosLength - (index + 1) * 10)
            }
            max={10}
            disabled
            sx={{
              width: 30,
              height: 6,
              "& .MuiSlider-thumb": {
                display: "none",
              },
              "& .MuiSlider-track": {
                color:
                  photosLength <= 10
                    ? theme.palette.error.main
                    : photosLength <= 20
                    ? theme.palette.orange.main
                    : theme.palette.success.main,
                border: "0px",
              },
            }}
          />
        ))}
      </>
    );
  };

  return (
    <>
      <div className="  bg-grey-700 w-full   py-2 px-6  flex flex-col justify-between relative -bottom-[3px]">
        <div className="flex justify-between  items-center">
          <p className="text-common-white text-[14px] font-[500]">
            Number of qualified photos :{" "}
            <span
              style={{
                color:
                  photosLength <= 10
                    ? theme.palette.error.main
                    : photosLength <= 20
                    ? theme.palette.orange.main
                    : theme.palette.success.main,
              }}
              className="font-bold"
            >
              {photosLength <= 10
                ? "Low"
                : photosLength <= 20
                ? "Medium"
                : "Good"}
            </span>
          </p>
          ​
          <div className="flex gap-6  justify-between items-center">
            <div className="flex gap-1.5 w-full">
              <SliderComponent />
            </div>
            <div>
              <RangeTrueIcon photosLength={photosLength} />
            </div>
          </div>
        </div>
        <p className="text-[12px] text-grey-300 ">
          By submitting more photos, you can improve the AI Yourself quality and
          make it better.
        </p>
      </div>
    </>
  );
};
export default PhotosQualityRange;
