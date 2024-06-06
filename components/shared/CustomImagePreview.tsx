import Image, { StaticImageData } from "next/image";
import { useEffect, useState } from "react";
import { Blurhash } from "react-blurhash";

type Props = {
  image: string | StaticImageData;
  className?: string;
  blurhash?: string;
};

export const CustomImagePreview = ({ image, blurhash, className }: Props) => {
  const [isImgLoad, setIsImgLoad] = useState(false);

  useEffect(() => {
    if (isImgLoad) {
      setIsImgLoad(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [image]);

  return (
    <>
      {blurhash && (
        <div className="w-full h-full absolute left-0 top-0 flex justify-center items-center">
          <Blurhash hash={blurhash} width="100%" height="100%" />
        </div>
      )}
      <Image
        onLoad={() => setIsImgLoad(true)}
        fill
        priority={true}
        src={image}
        alt=""
        className={`${
          isImgLoad ? "opacity-1" : "opacity-0"
        } transition-all duration-500 pointer-events-none z-1 ${className}`}
        quality={20}
      />
    </>
  );
};
