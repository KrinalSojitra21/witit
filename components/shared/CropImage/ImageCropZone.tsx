import { useAuthContext } from "@/context/AuthContext";
import { theme } from "@/theme";
import { ImageInfo } from "@/types";
import appConstant from "@/utils/constants/withoutHtml/appConstant";
import React, { useCallback, useEffect } from "react";
import Cropper from "react-easy-crop";
import { Point, Area } from "react-easy-crop/types";

type Props = {
  imagePreview?: ImageInfo;
  setAreaPixels?: React.Dispatch<React.SetStateAction<any>>;
  setZoom?: (zoom: number) => void;
  setCrop?: (crop: Point) => void;
};

const ImageCropZone = (props: Props) => {
  const { croppingImage, setCroppingImage } = useAuthContext();

  const handleCropComplete = useCallback(
    (croppedArea: Area, croppedAreaPixels: Point) => {
      setCroppingImage((prev) => {
        return {
          ...prev,
          image: { ...prev.image, croppedPixels: croppedAreaPixels },
        };
      });
    },
    []
  );
  const handleCrop = useCallback((crop: Point) => {
    setCroppingImage((prev) => {
      return {
        ...prev,
        image: { ...prev.image, crop: crop },
      };
    });
  }, []);

  const handleZoom = useCallback((zoom: number) => {
    setCroppingImage((prev) => {
      return {
        ...prev,
        image: { ...prev.image, zoom: zoom },
      };
    });
  }, []);

  return (
    <div className="h-full w-full bg-grey-900  ">
      {croppingImage?.image?.src && (
        <div className="h-full w-full  absolute top-0  left-0 ">
          <Cropper
            style={{
              mediaStyle: {
                overflow: "initial",
                maxWidth: "inherit",
                // transform: "translateX(0%)",
                // objectFit: "none",
              },

              containerStyle: {
                background: theme.palette.grey[900],
              },
              // mediaStyle: {
              //   background: theme.palette.grey[900],
              // },
              cropAreaStyle: {},
            }}
            showGrid={
              croppingImage?.isShowGrid ? croppingImage.isShowGrid : false
            }
            image={croppingImage?.image?.src}
            crop={croppingImage?.image?.crop}
            zoom={croppingImage?.image?.zoom}
            aspect={
              croppingImage.image.aspectRatio === "auto" ||
              croppingImage.image.aspectRatio === undefined
                ? eval(appConstant.defaultaspectRatio)
                : eval(
                    croppingImage?.image?.aspectRatio
                      ? croppingImage?.image?.aspectRatio
                      : appConstant.defaultaspectRatio
                  )
            }
            objectFit={croppingImage?.image?.objectFit}
            onCropChange={handleCrop}
            onCropComplete={handleCropComplete}
            onZoomChange={handleZoom}
          />
        </div>
      )}
    </div>
  );
};

export default ImageCropZone;
// style={{
//   // mediaStyle: { overflow: "initial" },
//   containerStyle: {
//     // position: "absolute",
//     // top: "0",
//     width: "50px",
//     // height: window.innerWidth,
//     // overflow: "hidden",
//     // border: "1px solid black",
//   },
//   mediaStyle: { width: "51px" },
//   cropAreaStyle: {
//     width: "52px",
//   },
// }}//
