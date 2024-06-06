import { getObjectFit } from "@/service/shared/getObjectFit";
import { ImageInfo } from "@/types";
import appConstant from "@/utils/constants/withoutHtml/appConstant";

const DisplayMultipleImages = async (
  files: File[],
  setImages: React.Dispatch<
    React.SetStateAction<
      {
        image: ImageInfo;
        index: number;
      }[]
    >
  >
) => {
  const newLoadedMultiImages: {
    image: ImageInfo;
    index: number;
  }[] = await Promise.all<{ image: ImageInfo; index: number }>(
    files.map((file, index) => {
      return new Promise<{ image: ImageInfo; index: number }>(
        (resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => {
            let img = new Image();
            img.src = reader.result as string;
            img.onload = () => {
              resolve({
                image: {
                  src: reader.result as string,
                  croppedImageSrc: reader.result as string,
                  objectFit: getObjectFit({
                    w: img.naturalWidth,
                    h: img.naturalHeight,
                  }),
                  aspectRatio: appConstant.defaultaspectRatio,
                  crop: { x: 0, y: 0 },
                  zoom: 1,
                  croppedPixels: { x: 0, y: 0 },
                  name: file?.name,
                  size: { width: 200, height: 200 },
                },
                index,
              });
            };
            img.onerror = (error) => reject(`Error loading image: ${error}`);
          };
          reader.onerror = (error) => reject(`Error reading file: ${error}`);
          reader.readAsDataURL(file);
        }
      );
    })
  );

  setImages(newLoadedMultiImages);
};

export default DisplayMultipleImages;
