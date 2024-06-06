import VisibilityOffIcon from "@/utils/icons/shared/VisibilityOffIcon";
import TravelCategoryIcon from "@/utils/icons/createPost/selectCategoryIcons/TravelCategoryIcon";
import { CircularProgress, Grid } from "@mui/material";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Blurhash } from "react-blurhash";
import { CustomImagePreview } from "../shared/CustomImagePreview";
import CustomButton from "../shared/CustomButton";
import { useDispatch, useSelector } from "react-redux";
import { addViewedNSFWPost } from "@/redux/slices/viewedNSFWSlice";
import { RootState } from "@/redux/store";
import { set } from "react-hook-form";

type Image = {
  url: string;
  width: number;
  height: number;
  blurhash: string;
};

type Props = {
  image: Image;
  isNSFW: boolean;
  postId: string;
  //   setImageData: React.Dispatch<React.SetStateAction<SelectedPhoto | null>>;
};

const ImagePreviewBox = ({ image, isNSFW, postId }: Props) => {
  const dispatch = useDispatch();
  const viewedNsfwList = useSelector((state: RootState) => state.viewedNSFW);

  const isViewdPost = viewedNsfwList.find((post) => post === postId);
  const [isNSFWVisible, setIsNSFWVisible] = useState<boolean>(false);
  useEffect(() => {
    if (isViewdPost) {
      setIsNSFWVisible(false);
    } else {
      setIsNSFWVisible(isNSFW);
    }
  }, [isNSFW, isViewdPost]);

  return (
    <div className="bg-grey-600 w-full h-full">
      <div className="w-full h-full absolute left-0 top-0 flex justify-center items-center">
        <Blurhash hash={image.blurhash} width={300} height={400} />
      </div>
      {isNSFWVisible ? (
        <div className="w-full h-full flex flex-col justify-center cursor-default items-center  absolute top-0 left-0 gap-2">
          <div className=" scale-125 pb-3">
            <VisibilityOffIcon />
          </div>
          <p className="text-sm">NSFW</p>
          <p className="w-[60%] text-center font-light text-xs text-common-white text-opacity-70 tracking-wider">
            Sensitive content, viewer discretion advised.
          </p>
          <CustomButton
            name="View"
            className="w-fit text-xs bg-transparent-main border border-solid border-common-white opacity-75 px-2 py-1 mt-1 hover:bg-grey-500 hover:bg-opacity-70 hover:opacity-100 "
            onClick={(e: React.MouseEvent<HTMLElement>) => {
              e.stopPropagation();
              dispatch(addViewedNSFWPost({ postId: postId }));
              setIsNSFWVisible(!isNSFWVisible);
            }}
          />
        </div>
      ) : (
        <div className="relative w-full h-full z-10  cursor-pointer ">
          <CustomImagePreview image={image.url} />
        </div>
      )}
    </div>
  );
};

export default ImagePreviewBox;
