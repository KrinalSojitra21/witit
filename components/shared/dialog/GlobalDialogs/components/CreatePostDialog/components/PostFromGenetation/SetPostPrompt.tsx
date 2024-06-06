import React, { ChangeEvent, useEffect, useState } from "react";
import CustomButton from "../../../../../../CustomButton";
import { useAuthContext } from "@/context/AuthContext";
import CustomToggleSwitch from "../../../../../../CustomToggleSwitch";
import { CustomImagePreview } from "@/components/shared/CustomImagePreview";
import { DefaultValues } from "@/types/createPostType";
import { Controller, useForm } from "react-hook-form";
import GenerationPostCategory from "./GenerationPostCategory";
import createPost from "@/api/post/createPost";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import CustomDialogCommonTopBar from "../../../shared/CustomDialogCommonTopBar";
import PlusIcon from "@/utils/icons/shared/PlusIcon";
import NormalLeftArrowIcon from "@/utils/icons/shared/NormalLeftArrowIcon";
import RightThikArrowButton from "@/utils/icons/shared/RightThikArrowButton";

const SetPostPrompt = () => {
  const [isAllow, setIsAllow] = useState<boolean>(false);
  const [step, setStep] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const { generationPost, sendNotification, setCustomDialogType } =
    useAuthContext();
  const user = useSelector((state: RootState) => state.user);

  const defaultValues: Partial<DefaultValues> = {
    category: [],
    caption: "",
    image: [generationPost!.generationImages[0]],
    generatedFrom: { postId: null, modelId: generationPost!.modelDetails.id },
    promptDetails: {
      creditPerPromptView: 0,
      allowPromptView: false,
      generationId: generationPost!.Id,
    },
  };

  const { control, setValue, handleSubmit, getValues } = useForm<
    Partial<DefaultValues>
  >({
    defaultValues,
    mode: "onSubmit",
  });

  useEffect(() => {
    if (isAllow) {
      setValue("promptDetails.allowPromptView", isAllow);
      setValue("promptDetails.creditPerPromptView", 1);
    } else {
      setValue("promptDetails.creditPerPromptView", 0);
    }
  }, [isAllow]);

  const handleSave = async (data: Partial<DefaultValues>) => {
    setIsLoading(true);
    const response = await createPost({
      postObject: data,
      user_id: user?.userId,
    });
    if (response.status === 200) {
      sendNotification({
        type: "SUCCESS",
        message: "Data Updated Successfully",
      });
      setIsLoading(false);
      setCustomDialogType(null);
      return;
    }
    sendNotification({ type: "ERROR", message: response.error });
    setIsLoading(false);
  };

  if (!generationPost) {
    return <></>;
  }

  return (
    <>
      <CustomDialogCommonTopBar
        onCancel={() => {
          setCustomDialogType(null);
        }}
        startIcon={
          step === 0 ? (
            <div className=" text-common-white border rounded-lg border-solid p-2 scale-50 w-[42px] ">
              <PlusIcon />
            </div>
          ) : (
            <div
              className=" flex items-center w-[42px] justify-center "
              onClick={() => {
                if (step > 0) {
                  setStep(0);
                }
              }}
            >
              <NormalLeftArrowIcon />
            </div>
          )
        }
        title="Create Post"
      />
      <form className="h-full w-full flex p-6">
        {step === 0 && (
          <div className="h-full w-full flex  gap-10">
            <div className=" h-full  w-[50%]  ">
              <div className="relative  h-full  overflow-hidden w-full object-cover rounded-md">
                <CustomImagePreview
                  image={generationPost.generationImages[0].url}
                />
              </div>
            </div>

            <div className=" w-[60%]  flex flex-col flex-grow justify-between">
              <div className=" flex flex-col">
                <p className="mb-2">Prompts for the generation</p>
                <div className="border border-grey-700 py-4 px-4 rounded-xl">
                  <p className="text-common-white text-opacity-50">
                    {generationPost?.prompt}
                  </p>
                </div>

                <div className="flex w-full justify-between items-center py-5">
                  <h6 className=" font-normal text-sm tracking-wider  text-common-white ">
                    Allow Others to see your prompt
                  </h6>
                  <Controller
                    name="promptDetails.allowPromptView"
                    control={control}
                    render={({ field }) => {
                      return (
                        <>
                          <CustomToggleSwitch
                            handleToggle={(
                              e: ChangeEvent<HTMLInputElement>
                            ) => {
                              setIsAllow(e.target.checked);
                            }}
                          />
                        </>
                      );
                    }}
                  />
                </div>
                {isAllow && (
                  <div className="w-full  flex justify-between items-center py-5 gap-5">
                    <div className="flex flex-col gap-2">
                      <h6 className=" font-normal text-sm tracking-wider  text-common-white ">
                        Cost to Revel Prompt
                      </h6>
                      <p className="text-grey-300 font-light text-xs">
                        You will receive this credit when you create a post in
                        witit and someone wants to view the prompt of that post.
                      </p>
                    </div>
                    <Controller
                      name="promptDetails.creditPerPromptView"
                      control={control}
                      render={({ field }) => {
                        return (
                          <>
                            <input
                              {...field}
                              type="number"
                              placeholder="0"
                              className="w-[70px] p-2 text-center border  rounded-lg focus:outline-none border-grey-600 bg-grey-800 py-2"
                            />
                          </>
                        );
                      }}
                    />
                  </div>
                )}
              </div>

              <div className=" w-full flex justify-end">
                <CustomButton
                  endIcon={<RightThikArrowButton />}
                  name="Next"
                  className="w-fit text-base font-semibold px-20 py-3"
                  handleEvent={() => {
                    setStep(1);
                  }}
                />
              </div>
            </div>
          </div>
        )}
        {step === 1 && (
          <GenerationPostCategory
            setValue={setValue}
            setStep={setStep}
            Controller={Controller}
            control={control}
            getValues={getValues}
            isLoading={isLoading}
            handleSubmit={handleSubmit}
            handleSave={handleSave}
          />
        )}
      </form>
    </>
  );
};

export default SetPostPrompt;
