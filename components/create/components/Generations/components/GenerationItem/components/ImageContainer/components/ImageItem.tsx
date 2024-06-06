import { CustomImagePreview } from "@/components/shared/CustomImagePreview";
import { CustomTooltip } from "@/components/shared/CustomTooltip";
import { IconDropDown } from "@/components/shared/dropDown/IconDropDown";
import { useAuthContext } from "@/context/AuthContext";
import { Image } from "@/types/post";
import { GenerationActionList } from "@/utils/constants/withHtml/ai";
import { Box, IconButton } from "@mui/material";
import React, { useState } from "react";

type Props = {
  image: Image;
  setImageView: React.Dispatch<React.SetStateAction<Image | null>>;
  handleImageAction: ({ type }: { type: string }) => void;
  handleSelect: (item: string, image: Image) => void;
};

export const ImageItem = ({
  image,
  setImageView,
  handleImageAction,
  handleSelect,
}: Props) => {
  const [isImageHover, setIsImageHover] = useState(false);
  const { setCustomDialogType } = useAuthContext();

  return (
    <div
      className="relative cursor-pointer transition-all duration-300 ease-in-out"
      onMouseEnter={() => setIsImageHover(true)}
      onMouseLeave={() => setIsImageHover(false)}
    >
      {isImageHover ? (
        <div
          className={` bg-secondary-main bg-opacity-40 flex absolute z-[1] top-0 right-0 w-full h-full justify-end items-end`}
          onClick={() => {
            setImageView(image);
          }}
        >
          <div className="flex gap-2 p-2 m-0">
            {GenerationActionList.slice(0, 2).map((item, index) => {
              return (
                <CustomTooltip key={index} title={item.title}>
                  <IconButton
                    onClick={(e: React.MouseEvent<HTMLElement>) => {
                      e.stopPropagation();
                      handleImageAction({ type: item.actionType || "MESSAGE" });
                    }}
                    className=" w-[30px] h-[30px] rounded-lg text-common-white bg-secondary-main hover:bg-primary-main hover:bg-opacity-100 bg-opacity-80 p-0 m-0 "
                  >
                    {item.startIcon}
                  </IconButton>
                </CustomTooltip>
              );
            })}
            <div
              onClick={(e: React.MouseEvent<HTMLElement>) => {
                e.stopPropagation();
                setIsImageHover(false);
              }}
              className="w-[30px] aspect-square flex justify-center items-center rounded-lg bg-secondary-main hover:bg-primary-main hover:bg-opacity-100 bg-opacity-80"
            >
              <IconDropDown
                handleItemSelect={(item) => {
                  handleSelect(item, image);
                }}
                position={{ vertical: "top", horizontal: "left" }}
                listItems={GenerationActionList.slice(
                  2,
                  GenerationActionList.length
                )}
              />
            </div>
          </div>
        </div>
      ) : null}
      <Box
        // sx={{ aspectRatio }}
        className="relative aspect-[4/5] rounded-lg overflow-hidden bg-grey-600"
      >
        <CustomImagePreview image={image.url} blurhash={image.blurhash} />
      </Box>
    </div>
  );
};
