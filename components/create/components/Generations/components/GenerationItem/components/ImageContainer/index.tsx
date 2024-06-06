import { GetAiGeneration } from "@/types/ai";
import { CircularProgress, Grid } from "@mui/material";
import { useState } from "react";
import { ImageItem } from "./components/ImageItem";
import { ImagePreview } from "./components/ImagePreview";
import { Image } from "@/types/post";
import { useGenerationContext } from "@/components/create/context/GenerationContext";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { getImageObject } from "@/service/shared/getImageObject";
import { useAuthContext } from "@/context/AuthContext";

const styles = {
  responsiveGrid: {
    xxl: 1,
    xl: 1,
    // lg: 5,
    md: 1,
    sm: 1,
    xs: 1,
  },
};

type HandleImageActionProps = {
  type: string;
  image: Image;
};

type Props = {
  generation: GetAiGeneration;
};

export const ImageContainer = ({ generation }: Props) => {
  const models = useSelector((state: RootState) => state.models);

  const { setSelectedImage, setPrompt } = useGenerationContext();
  const { setGenerationPost, setCustomDialogType, generationPost } =
    useAuthContext();
  const [imageView, setImageView] = useState<Image | null>(null);

  const handleClose = () => {
    setImageView(null);
  };

  const handleDownloadImage = async ({ image }: { image: Image }) => {
    const a = document.createElement("a");
    a.href = (await getImageObject(image.url)).blob;
    a.download =
      "witit_" +
      (Math.floor(Math.random() * 90000) + 10000).toString() +
      "_" +
      Date.now() +
      ".jpeg";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleRecreateImage = async ({ image }: { image: Image }) => {
    const { file } = await getImageObject(image.url);

    setSelectedImage({ imagePreview: image.url, file });
    setPrompt(
      generation.modelDetails.id === models.baseModelList[0]?.modelId
        ? generation.prompt
        : generation.prompt.split(" ").slice(4).join(" ")
    );
  };

  const handleImageAction = ({ type, image }: HandleImageActionProps) => {
    switch (type) {
      case "DOWNLOAD":
        handleDownloadImage({ image });
        break;
      case "RECREATE":
        handleRecreateImage({ image });
        break;
      case "POST":
        setGenerationPost({ ...generation, generationImages: [image] });
        setCustomDialogType("POST");
        break;

      default:
        break;
    }
  };

  if (generation.status === "FAILURE") {
    return (
      <div>
        <p className="text-error-main">Failed To Generate</p>
        <p>{generation.message}</p>
      </div>
    );
  }
  const handleSelect = (item: string, image: Image) => {
    if (item === "POST") {
      setCustomDialogType("POST");
      setGenerationPost({ ...generation, generationImages: [image] });
      console.log(image);
    }
  };

  return (
    <div className="max-w-[800px]">
      <Grid container spacing={1.5} columns={4} className="">
        {generation.generationImages
          .filter((image) => image.url)
          .map((image, index) => (
            <Grid key={index} item {...styles.responsiveGrid}>
              <ImageItem
                handleSelect={handleSelect}
                image={image}
                setImageView={setImageView}
                handleImageAction={({ type }) =>
                  handleImageAction({ type, image })
                }
              />
            </Grid>
          ))}
        {Array(generation.remainingGeneration)
          .fill("")
          .map((blank, index) => (
            <Grid item key={index} {...styles.responsiveGrid}>
              <div className="w-full aspect-[4/5] rounded-lg overflow-hidden bg-grey-600 flex items-center justify-center">
                <CircularProgress size={20} className="text-common-white" />
              </div>
            </Grid>
          ))}
      </Grid>
      {imageView ? (
        <ImagePreview
          aspectRatio={
            generation.generationImages
              ? (
                  generation.generationImages[0].width /
                  generation.generationImages[0].height
                ).toFixed(2)
              : "0.80"
          }
          handleClose={handleClose}
          imageView={imageView}
          handleImageAction={({ type }) => {
            handleImageAction({ type, image: imageView });
            setImageView(null);
          }}
        />
      ) : null}
    </div>
  );
};
