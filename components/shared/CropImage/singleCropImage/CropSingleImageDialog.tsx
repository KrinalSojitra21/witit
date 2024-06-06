import React, { useEffect, useState } from "react";
import CustomDialog from "../../dialog/CustomDialog";
import { useAuthContext } from "@/context/AuthContext";
import CloseIcon from "@/utils/icons/shared/CloseIcon";
import appConstant, {
  defaultImageConstant,
} from "@/utils/constants/withoutHtml/appConstant";
import { theme } from "@/theme";
import CropLinerIcon from "@/utils/icons/createPost/CropLinerIcon";
import CheckIcon from "@/utils/icons/shared/CheckIcon";
import { IconButton, Slider } from "@mui/material";
import ImageCropZone from "../ImageCropZone";

type Props = {
  handleEvent?: () => void;
  type: string;
  cropperAspectRatio?: string;
};
const CropSingleImageDialog = ({ handleEvent, type }: Props) => {
  const {
    setCustomDialogType,

    croppingImage,
    setCroppingImage,
  } = useAuthContext();
  const [iszooming, setiszooming] = useState(false);
  const [isCanceled, setisCanceled] = useState(type);

  return (
    <>
      <CustomDialog isOpen={isCanceled != ""} className="w-fit h-fit">
        <div className="flex flex-col h-full  items-start ">
          {/* titlebar */}
          <div className="z-20 flex justify-between items-center px-[20px] border-b py-5 w-full">
            <div className="heading1 text-xl font-medium">Crop Image</div>

            <div
              onClick={() => {
                setisCanceled("");
                setCroppingImage(defaultImageConstant);
                setCustomDialogType(null);
              }}
              className=" text-common-white  p-2 scale-90 rounded-full "
            >
              <CloseIcon isBorderRounded={true} />
            </div>
          </div>
          <div className=" p-5">
            <div
              className={`relative w-[400px] aspect-square  flex flex-col  items-center`}
            >
              <div
                className={`absolute ${
                  iszooming ? "bottom-0 " : "top-0 right-0"
                } flex flex-col justify-end w-full  z-20`}
              >
                {iszooming ? (
                  <div className=" flex flex-col  gap-2  ">
                    <div className="crop_bottom_line w-full flex justify-between items-center py-2 bg-common-black bg-opacity-60 gap-3 px-3">
                      <div
                        className=" scale-125"
                        onClick={() => {
                          setiszooming(!iszooming); // setiscrop(false);
                          setCroppingImage((prev) => {
                            return { ...prev, isShowGrid: false };
                          });
                        }}
                      >
                        <CloseIcon />
                      </div>
                      <Slider
                        sx={{
                          color: theme.palette.common.white,

                          "& .MuiSlider-thumb": {
                            color: theme.palette.primary.main,
                          },
                          "& .MuiSlider-track": {
                            color: theme.palette.grey[400],
                          },
                          "& .MuiSlider-rail": {
                            opacity: 1,
                            color: theme.palette.grey[400],
                          },
                        }}
                        size="small"
                        step={0.00000001}
                        max={3}
                        min={1}
                        value={croppingImage.image.zoom}
                        onChange={(
                          event: Event,
                          newValue: number | number[]
                        ) => {
                          setCroppingImage((prevState) => {
                            const updatedImage = {
                              ...prevState.image,
                              zoom: newValue as number,
                            };

                            return {
                              ...prevState,
                              image: updatedImage,
                            };
                          });
                        }}
                        aria-label="Small"
                        valueLabelDisplay="off"
                      />
                      <div
                        className=" scale-110"
                        onClick={() => {
                          setCroppingImage((prev) => {
                            return { ...prev, isShowGrid: false };
                          });
                          setiszooming(false);
                        }}
                      >
                        <CheckIcon />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className=" w-full  h-full flex justify-end  items-start p-3">
                    <IconButton
                      className="text-common-white bg-common-black rounded-md p-0 scale-110"
                      onClick={() => {
                        setiszooming(!iszooming); // setiscrop(false);
                        setCroppingImage((prev) => {
                          return { ...prev, isShowGrid: true };
                        });
                      }}
                    >
                      <CropLinerIcon />
                    </IconButton>
                  </div>
                )}
              </div>{" "}
              <ImageCropZone
                imagePreview={croppingImage.image}
                setAreaPixels={(cropPixel) => {
                  setCroppingImage((prevState) => {
                    const updatedImage = {
                      ...prevState.image,
                      croppedPixels: cropPixel,
                    };
                    return {
                      ...prevState,
                      image: updatedImage,
                    };
                  });
                }}
                setZoom={(zoom) => {
                  setCroppingImage((prevState) => {
                    const updatedImage = {
                      ...prevState.image,
                      zoom: zoom,
                    };

                    return {
                      ...prevState,
                      image: updatedImage,
                    };
                  });
                }}
                setCrop={(crop) => {
                  setCroppingImage((prevState) => {
                    const updatedImage = {
                      ...prevState.image,
                      crop: crop,
                    };

                    return {
                      ...prevState,
                      image: updatedImage,
                    };
                  });
                }}
              />
            </div>
          </div>
          <div className="w-full flex justify-end p-5">
            <div
              className=" text-primary-main rounded-full"
              onClick={handleEvent ? handleEvent : undefined}
            >
              SAVE
            </div>
          </div>
        </div>
      </CustomDialog>
    </>
  );
};

export default CropSingleImageDialog;
