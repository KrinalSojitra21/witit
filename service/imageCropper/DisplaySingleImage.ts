import { getObjectFit } from "@/service/shared/getObjectFit";
import { ImageInfo } from "@/types";

const displaySingleImage = (
  file: File,
  setImage: React.Dispatch<
    React.SetStateAction<{ image: ImageInfo; index: number }>
  >
) => {
  // const { setCustomDialogType } = useAuthContext();

  let filename = file?.name;
  const reader = new FileReader();

  reader.onload = () => {
    // setTempImagePreview(reader.result as string);
    // setCustomDialogType("CROPSINGLEIMG");

    let img = new Image();
    img.src = reader.result as string;
    img.onload = () => {
      setImage((prev) => {
        return {
          ...prev,
          image: {
            ...prev.image,
            src: reader.result as string,
            croppedImageSrc: reader.result as string,
            objectFit: getObjectFit({
              w: img.naturalWidth,
              h: img.naturalHeight,
            }),
            crop: { x: 0, y: 0 },
            zoom: 1,
            croppedPixels: {
              x: 0,
              y: 0,
              width: img.naturalWidth,
              height: img.naturalHeight,
            },
            name: file?.name,
            size: { width: img.naturalWidth, height: img.naturalHeight },
          },
        };
      });
    };
  };
  reader?.readAsDataURL(file);
};

export default displaySingleImage;
