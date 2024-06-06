import React, { useEffect, useState } from "react";
import InputImages from "./components/InputImages";
import { ImageInfo } from "@/types";
import CustomDialog from "../../../CustomDialog";
import PlusIcon from "@/utils/icons/shared/PlusIcon";
import { useAuthContext } from "@/context/AuthContext";
import CategorySelection from "./components/CategorySelection";
import SetPostPrompt from "./components/PostFromGenetation/SetPostPrompt";
import NormalLeftArrowIcon from "@/utils/icons/shared/NormalLeftArrowIcon";
import CustomDialogCommonTopBar from "../shared/CustomDialogCommonTopBar";
import { useForm } from "react-hook-form";
import { Image, Post } from "@/types/post";
import { uploadImageToStorage } from "@/service/firebase/uploadImage";
import { DefaultValues } from "@/types/createPostType";
import { createImage } from "@/service/imageCropper/cropImage";
import createPost from "@/api/post/createPost";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import ModifyImages from "@/components/shared/CropImage/multipleCropImage/ModifyImages";

const CreatePostDialog = () => {
  const [createPostImages, setCreatePostImages] = useState<
    {
      image: ImageInfo;
      index: number;
    }[]
  >([]);
  const [isLoading, setLoading] = useState<Boolean>(false);
  const [isBack, setisBack] = useState(false);
  const [step, setStep] = useState<number>(1);

  const {
    firebaseUser,
    setCustomDialogType,
    sendNotification,
    generationPost,
  } = useAuthContext();

  const user = useSelector((state: RootState) => state.user);

  const defaultValues: Partial<DefaultValues> = {
    category: [],
    caption: null,
    image: [],
    generatedFrom: null,
  };

  useEffect(() => {
    if (createPostImages.length > 0) {
      setStep(2);
    }
  }, [createPostImages]);

  useEffect(() => {
    setCreatePostImages([]);
  }, [isBack]);

  const { handleSubmit, control, setValue, getValues } = useForm({
    defaultValues,
  });

  const handleSave = async (data: Partial<DefaultValues>) => {
    data.caption === "" && (data.caption = null);

    setLoading(true);
    const getFirebaseImages: Blob[] = [];

    for (const val of createPostImages.slice(0, 10)) {
      const imageInfo = val.image.croppedImageSrc;
      const response = await fetch(imageInfo);
      const file = await response.blob();
      getFirebaseImages.push(file);
    }

    const selectedPhotosList = await Promise.all(
      getFirebaseImages.map((file) => {
        const folderName = "add_post";
        return file
          ? uploadImageToStorage({
              folderName,
              file,
              metadata: {
                userId: firebaseUser?.uid,
              },
            })
          : null;
      })
    );

    const imageObject = await Promise.all(
      selectedPhotosList.map(async (item) => {
        if (!item) {
          return;
        }
        const image = await createImage(item);
        return {
          url: image.currentSrc,
          width: image.width,
          height: image.height,
        };
      })
    );

    data.image = imageObject as Partial<Image>[];

    const response = await createPost({
      postObject: data,
      user_id: user?.userId,
    });
    if (response.status === 200) {
      sendNotification({
        type: "SUCCESS",
        message: "Data Updated Successfully",
      });
      setLoading(false);
      setCustomDialogType(null);
      return;
    }
    sendNotification({ type: "ERROR", message: response.error });
    setLoading(false);
  };
  console.log(createPostImages, "post");
  return (
    <>
      {step >= 1 ? (
        <CustomDialog className="w-full max-h-[600px]">
          <form className="text-common-white flex flex-col h-full w-full items-start ">
            {!generationPost && (
              <>
                <CustomDialogCommonTopBar
                  onCancel={() => {
                    setCustomDialogType(null);
                  }}
                  startIcon={
                    createPostImages.length === 0 || step === 1 ? (
                      <div className=" text-common-white border rounded-lg border-solid p-2 scale-50 ">
                        <PlusIcon />
                      </div>
                    ) : (
                      <div
                        className=" flex items-center"
                        onClick={() => {
                          if (step > 0) {
                            setStep(step - 1);
                          }
                        }}
                      >
                        <NormalLeftArrowIcon />
                      </div>
                    )
                  }
                  title="Create Post"
                />

                <div className="w-full overflow-hidden h-full flex flex-col ">
                  {step === 1 ? (
                    <div className="w-full  overflow-y-auto  flex p-6">
                      <InputImages
                        setImages={setCreatePostImages}
                        isSmall={false}
                        isEnabled={createPostImages.length < 10 ? true : false}
                      />
                    </div>
                  ) : null}

                  {step == 2 ? (
                    <>
                      <ModifyImages
                        images={createPostImages}
                        setStep={setStep}
                        setImages={setCreatePostImages}
                        isNextVisible={true}
                        isCrop={true}
                        limit={10}
                      />
                    </>
                  ) : null}
                  {step == 3 ? (
                    <CategorySelection
                      control={control}
                      handleSubmit={handleSubmit}
                      handleSave={handleSave}
                      setValue={setValue}
                      isLoading={isLoading}
                      getValues={getValues}
                    />
                  ) : null}
                </div>
              </>
            )}
            {generationPost ? <SetPostPrompt /> : null}
          </form>
        </CustomDialog>
      ) : null}
    </>
  );
};
{
  /* <CategorySelection />SetPostPrompt */
}

export default CreatePostDialog;
