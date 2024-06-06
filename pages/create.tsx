import React from "react";
import Head from "next/head";
import GenerationContext from "@/components/create/context/GenerationContext";
import { Create } from "@/components/create";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

export type CreateDrawerType = "MODEL_SELECTION" | "FILTER";

const CreatePage = () => {
  const user = useSelector((state: RootState) => state.user);

  return (
    <>
      <Head>
        <title>Witit - Create</title>
      </Head>
      {user ? (
        <GenerationContext>
          <Create />
        </GenerationContext>
      ) : null}
    </>
  );
};

export default CreatePage;

{
  /* {isDragging ? (
          <div className=" bg-secondary-main opacity-[0.88] h-full w-full absolute top-0 left-0 z-20 p-5">
            <div
              className={`h-full w-full border-dashed ${
                croppingImage?.image.src === "" ? "" : "border"
              } border-grey-200 rounded-md overflow-hidden`}
            >
              <InputCropSingleImage
                type="PROFILEIMG"
                aspect={"1/1"}
                finalImage={finalModelImage}
                setFinalImage={setFinalModelImage}
                // clearError={clearErrors}
                placeholder={{
                  placeholderImg: (
                    <div>
                      <Lottie
                        animationData={ImagePlaceholderLottie}
                        className=" w-[200px]"
                      />
                    </div>
                  ),
                  placeholderTitle: (
                    <>
                      <h2 className="text-center md:pt-5 pt-3">
                        Drag profile pic here,
                      </h2>
                      <h2 className="  text-center">
                        or <span className="text-primary-main">browse</span>
                      </h2>
                    </>
                  ),
                }}
              />
            </div>
          </div>
        ) : null} */
}
