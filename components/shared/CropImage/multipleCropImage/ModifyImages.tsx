/* eslint-disable @next/next/no-img-element */
/* eslint-disable jsx-a11y/alt-text */
import React, { useCallback, useEffect, useState } from "react";
import { ImageInfo } from "@/types";
import InputImages from "../../dialog/GlobalDialogs/components/CreatePostDialog/components/InputImages";
import { Grid, IconButton, Slider } from "@mui/material";
import appConstant, {
  defaultImageConstant,
} from "@/utils/constants/withoutHtml/appConstant";
import CropLinerIcon from "@/utils/icons/createPost/CropLinerIcon";
import CloseIcon from "@/utils/icons/shared/CloseIcon";
import ArrowDownIcon from "@/utils/icons/shared/ArrowDownIcon";
import CustomButton from "../../CustomButton";
import CheckIcon from "@/utils/icons/shared/CheckIcon";
import { theme } from "@/theme";
import { useAuthContext } from "@/context/AuthContext";
import getCroppedImg from "@/service/imageCropper/cropImage";
import DisplayMultipleImages from "@/service/imageCropper/DisplayMultipleImages";
import ImageCropZone from "../ImageCropZone";
import InputCropMultiImages from "@/components/shared/cropImage/multipleCropImage/InputCropMultiImages";

type Props = {
  isNextVisible?: boolean;
  isCrop: boolean;
  limit: number;
  images: {
    image: ImageInfo;
    index: number;
  }[];
  setStep: React.Dispatch<React.SetStateAction<number>>;
  setImages: React.Dispatch<
    React.SetStateAction<
      {
        image: ImageInfo;
        index: number;
      }[]
    >
  >;
};

const styles = {
  responsiveGrid: {
    xxl: 12,
    xl: 12,
    lg: 12,
    md: 15,
    sm: 20,
    xs: 20,
  },
};
const ModifyImages = (props: Props) => {
  let { images, setStep, setImages, isNextVisible, isCrop, limit } = props;
  const { setCroppingImage, croppingImage } = useAuthContext();

  const [recentlyAddedPostImageList, setRecentlyAddedPostImageList] = useState<
    {
      image: ImageInfo;
      index: number;
    }[]
  >([]);
  images = images.slice(0, limit);
  const [iszooming, setiszooming] = useState(false);
  const [deletedIndex, setdeletedIndex] = useState<number | null>(null);
  const [isDraggingNewImage, setisDraggingNewImage] = useState(false);

  // change images order
  const [draggingChangeIndex, setdraggingChangeIndex] = useState<number | null>(
    0
  );
  const [dropChangeIndex, setDropChangeIndex] = useState<number | null>(0);
  const [isChangingInsideIndex, setIsChangingInsideIndex] = useState(false);

  // show cancelIcon on hover & delete
  const [isCloseVisible, setisCloseVisible] = useState({
    isHover: false,
    index: 0,
  });

  useEffect(() => {
    setCroppingImage(defaultImageConstant);
  }, []);

  useEffect(() => {
    setTimeout(() => {
      if (recentlyAddedPostImageList.length > 0) {
        setImages([...images, ...recentlyAddedPostImageList]);
        setRecentlyAddedPostImageList([]);
      }
    }, 2000);
  }, [recentlyAddedPostImageList]);

  useEffect(() => {
    if (deletedIndex !== null) {
      if (deletedIndex + 1 <= images.length) {
        setCroppingImage(() => {
          return {
            image: images[deletedIndex].image,
            index: deletedIndex,
          };
        });
      }
    }
    if (images.length === 0 && deletedIndex !== null) {
      setdeletedIndex(null);
      setStep(1);
    } else {
      setdeletedIndex(null);
    }
  }, [deletedIndex]);

  useEffect(() => {
    if (dropChangeIndex !== null) {
      setCroppingImage({
        image: images[dropChangeIndex].image,
        index: dropChangeIndex,
      });
    }
    setdraggingChangeIndex(null);
    setDropChangeIndex(null);
    if (croppingImage.index > images.length - 1) {
      setCroppingImage({
        image: images[images.length - 1]?.image,
        index: images.length - 1,
      });
    }
  }, [images]);
  useEffect(() => {
    setImages(images.slice(0, limit));
  }, [recentlyAddedPostImageList]);
  const changeIndexDragStart = (e: any, position: number) => {
    setisCloseVisible({ isHover: false, index: 0 });
    setIsChangingInsideIndex(true);
    if (position !== undefined) {
      setdraggingChangeIndex(position);
    }
  };

  const changeIndexDragEnter = (e: any, position: number) => {
    setIsChangingInsideIndex(true);
    setDropChangeIndex(position);
  };

  const changeIndexDrop = () => {
    if (draggingChangeIndex !== null && dropChangeIndex != null) {
      const copyListItems = [...images];
      const dragItemContent = copyListItems[draggingChangeIndex];
      copyListItems.splice(draggingChangeIndex, 1);
      copyListItems.splice(dropChangeIndex, 0, dragItemContent);

      // dragItem.current = null;
      // dragOverItem.current = null;

      setImages(copyListItems);

      // if (dropChangeIndex === croppingImage.index) {
      //   setCroppingImage({
      //     image: images[draggingChangeIndex],
      //     index: draggingChangeIndex,
      //   });
      // }
    }

    setIsChangingInsideIndex(false);
  };

  const showCroppedImage = useCallback(
    async (posingImages: { image: ImageInfo; index: number }[]) => {
      try {
        const croppedImage = await getCroppedImg(
          croppingImage.image.src!,
          croppingImage.image.croppedPixels!,
          0
        );

        if (croppedImage !== null) {
          setImages(() => {
            const newArray = posingImages;
            newArray[croppingImage.index].image.croppedImageSrc = croppedImage;
            return newArray;
          });

          // add Promise All Heare
          const updatedImages: { image: ImageInfo; index: number }[] =
            posingImages.map((postImage, index) => {
              if (index === croppingImage.index) {
                return {
                  ...postImage,
                  croppedImageSrc: croppedImage,
                  zoom: croppingImage.image.zoom,
                  crop: croppingImage.image.crop,
                  croppedPixels: croppingImage.image.croppedPixels,
                  aspectRatio: croppingImage.image.aspectRatio,
                };
              } else {
                return postImage;
              }
            });
          setImages(updatedImages);
        }
      } catch (e) {
        console.error(e);
      }
    },
    [croppingImage.image?.croppedPixels]
  );

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    if (!isChangingInsideIndex) {
      setisDraggingNewImage(true);
    }
  };
  const handleLeave = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setisDraggingNewImage(false);
    // }
    // if (!isChangingInsideIndex) {
    //   setisDraggingNewImage(true);
    // }
  };
  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();

    setisDraggingNewImage(false);
    const files = event.dataTransfer.files;

    if (files) {
      setRecentlyAddedPostImageList([]);
      // displayImages(Array.from(files));
      DisplayMultipleImages(Array.from(files), setRecentlyAddedPostImageList);
    }
  };

  return (
    <div
      className="w-full h-full flex flex-row gap-10 relative  "
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      onDragLeave={handleLeave}
    >
      {/* Dragging Images top layer */}
      {isDraggingNewImage && isCrop ? (
        <div className={`absolute w-full  bg-grey-900 opacity-75 z-20`}>
          <InputCropMultiImages
            isSmall={false}
            isEnabled={true}
            setSelectdImgs={setImages}
          />
        </div>
      ) : null}

      {images.length !== 0 && isCrop ? (
        <div
          className={`relative h-full pl-5 py-5  ${
            images.length !== 0 ? "block" : "hidden"
          }`}
        >
          <div
            className={` md:w-[340px]  w-[250px] aspect-[${appConstant.defaultaspectRatio}] relative`}
          >
            {/* zoom Images */}
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
                      onChange={(event: Event, newValue: number | number[]) => {
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
                        showCroppedImage(images);
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
            </div>
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
      ) : null}
      <div className="w-full py-5 flex flex-col justify-between gap-5">
        {isCrop && (
          <>
            <div className="w-full flex  justify-between pr-5">
              <div>
                <p className=" text-sm">Select Ratio</p>
                <p className=" text-xs text-grey-300">
                  All images keep the same ratio.
                </p>
              </div>
              <div className={`flex  gap-2`}>
                <>
                  {appConstant.aspectRatioList.map((ratio, index) => {
                    return (
                      <div
                        key={index}
                        className={` rounded-md w-[35px] h-[30px] flex justify-center items-center cursor-pointer  text-white text-xs ${
                          croppingImage?.image?.aspectRatio === ratio
                            ? "bg-primary-main"
                            : "bg-grey-900 border border-grey-500 "
                        }`}
                        onClick={() => {
                          const updateRatio = images.map((image, index) => {
                            return {
                              ...image,
                              image: { ...image.image, aspectRatio: ratio },
                            };
                          });
                          setImages(updateRatio);
                          setCroppingImage((prevState) => {
                            const updatedImage = {
                              ...prevState.image,
                              aspectRatio: ratio,
                            };
                            return {
                              image: updatedImage,
                              index: prevState.index,
                            };
                          });
                        }}
                      >
                        {ratio.split("/")[0]}:{ratio.split("/")[1]}
                      </div>
                    );
                  })}
                </>
              </div>
            </div>
            <div className="border-t w-[96%] border-grey-700 "></div>
          </>
        )}
        <div
          className={`pr-5 ${
            isCrop ? "md:h-[360px] h-[310px] overflow-auto " : "h-fit"
          }`}
        >
          <Grid
            container
            spacing={1}
            columns={isCrop ? 60 : 120}
            className={`h-fit   ${
              isCrop ? "justify-start" : "justify-center items-center pl-8"
            } `}
          >
            {images.map((file, index) => {
              return (
                <Grid
                  key={index}
                  item
                  {...styles.responsiveGrid}
                  className="h-fit"
                >
                  {file && (
                    <div
                      onMouseEnter={() =>
                        setisCloseVisible({ isHover: true, index: index })
                      }
                      onMouseLeave={() =>
                        setisCloseVisible({ isHover: false, index: index })
                      }
                      draggable
                      onDragStart={(e) => changeIndexDragStart(e, index)}
                      onDragEnter={(e) => changeIndexDragEnter(e, index)}
                      onDragEnd={changeIndexDrop}
                      className={`flex flex-row  w-full aspect-[4/5] overflow-clip justify-center	 items-center relative border-2 ${
                        index === croppingImage.index && " border-primary-main"
                      } rounded-md border-grey-200`}
                    >
                      {isCloseVisible.isHover &&
                      isCloseVisible.index === index ? (
                        <div
                          onClick={() => {
                            setdeletedIndex(index);
                            setImages(
                              images.filter(
                                (image, deleteIndex) => index !== deleteIndex
                              )
                            );
                          }}
                          className={`bg-grey-800  
                        flex absolute z-10 top-0 right-0 w-5 h-5  justify-center items-center rounded-full m-1 opacity-100 
                        }`}
                        >
                          <CloseIcon />
                        </div>
                      ) : null}

                      <img
                        src={file.image.croppedImageSrc}
                        alt=""
                        style={{ aspectRatio: file.image.aspectRatio }}
                        className={` w-full object-cover
                        ${index < limit ? "opacity-100" : " opacity-10"} m-0`}
                        onClick={() => {
                          showCroppedImage(images);
                          setCroppingImage({
                            image: images[index].image,
                            index: index,
                          });
                        }}
                      />
                    </div>
                  )}
                </Grid>
              );
            })}
            {recentlyAddedPostImageList.map((images, index) => {
              return (
                <Grid item {...styles.responsiveGrid} key={index}>
                  <div
                    className={`bg-grey-400 aspect-[4/5] w-full rounded-md`}
                  ></div>
                </Grid>
              );
            })}
            {images.length < limit && (
              <Grid item {...styles.responsiveGrid}>
                <div className={`aspect-[4/5] w-full`}>
                  <InputImages
                    setImages={setRecentlyAddedPostImageList}
                    isSmall={true}
                    isEnabled={images.length < limit ? true : false}
                  />
                </div>
              </Grid>
            )}
          </Grid>
        </div>
        {isNextVisible !== false ? (
          <div className="flex items-center gap-1 text-primary-main font-semibold  justify-end pr-5">
            <CustomButton
              name="Next"
              className=" bg-primary-main w-fit px-7 py-2"
              endIcon={
                <div className=" rotate-[270deg] flex items-center scale-75 ">
                  <ArrowDownIcon />
                </div>
              }
              handleEvent={() => {
                setStep(3);
              }}
            />
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default ModifyImages;
