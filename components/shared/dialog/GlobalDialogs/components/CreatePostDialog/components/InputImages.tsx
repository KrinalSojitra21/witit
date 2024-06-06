import React, { useEffect, useState } from "react";
import InputCropMultiImages from "@/components/shared/cropImage/multipleCropImage/InputCropMultiImages";
import { ImageInfo } from "@/types";




type Props = {
  setImages: React.Dispatch<
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
const InputImages = (props: Props) => {
  const { setImages, isSmall, isEnabled } = props;
  const [editedImages, seteditedImages] = useState<
    {
      image: ImageInfo;
      index: number;
    }[]
  >([]);

  useEffect(() => {
    if (editedImages.length > 0) {
      setImages(editedImages);
    }
  }, [editedImages]);

  return (
    <div className="w-full h-full flex flex-col flex-grow">
      <div
        className={`w-full
          rounded-[10px] border-[2px] border-dashed border-grey-500 overflow-hidden  h-[650px]`}
      >
        <InputCropMultiImages
          isSmall={isSmall}
          isEnabled={isEnabled}
          setSelectdImgs={seteditedImages}
          // imgsrc={image?.image ?? ""}
        />
      </div>
      {isSmall ? (
        <></>
      ) : (
        <div className="text-center p-3 mt-3 flex flex-col gap-1.5">
          <p
            className={`text-sm font-light tracking-wide ${
              isSmall ? "hidden" : "block"
            }`}
          >
            Upload Upto 10 Images
          </p>
          <p
            className={`text-xs font-light tracking-wide  text-grey-100 ${
              isSmall ? "hidden" : "block"
            }`}
          >
            Upload JPG, PNG With In 20MB To 50 MB{" "}
          </p>
        </div>
      )}
    </div>
  );
};

export default InputImages;
