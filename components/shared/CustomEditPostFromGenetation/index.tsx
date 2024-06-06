import React, { ChangeEvent, useEffect, useState } from "react";
import { useAuthContext } from "@/context/AuthContext";
import { CustomImagePreview } from "@/components/shared/CustomImagePreview";
import GenerationPostCategory from "./GenerationPostCategory";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import NormalLeftArrowIcon from "@/utils/icons/shared/NormalLeftArrowIcon";
import CustomDialogCommonTopBar from "@/components/shared/dialog/GlobalDialogs/components/shared/CustomDialogCommonTopBar";
import CustomToggleSwitch from "@/components/shared/CustomToggleSwitch";
import CustomButton from "@/components/shared/CustomButton";
import { OwnerPost, Post } from "@/types/post";
import { getOwnerPost } from "@/api/post/getOwnerPost";
import CustomDialog from "@/components/shared/dialog/CustomDialog";
import { updatePost } from "@/api/post/updatePost";
import EditIcon from "@/utils/icons/shared/EditIcon";
import RightThikArrowButton from "@/utils/icons/shared/RightThikArrowButton";
import { updateSimilarDiscoverPost } from "@/redux/slices/discoverSimilarFeedSlice";
import { updateCirclePost } from "@/redux/slices/circleFeedSlice";
import { updateUserPost } from "@/redux/slices/userPostSlice";

type Props = {
  editedValue: Post;
  isOpenEditPost: boolean;
  setIsOpenEditPost: React.Dispatch<React.SetStateAction<boolean>>;
};

const EditGenerationPostPrompt = ({
  editedValue,
  isOpenEditPost,
  setIsOpenEditPost,
}: Props) => {
  const [isAllow, setIsAllow] = useState<boolean | undefined>(false);
  const [step, setStep] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [generationPostData, setGenerationPostData] =
    useState<OwnerPost | null>(null);
  const [defaultValues, setDefaultValues] = useState<Partial<OwnerPost>>();

  const { sendNotification, setCustomDialogType, customDialogType } =
    useAuthContext();
  const user = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch();
  const fetchData = async () => {
    if (!user) {
      return;
    }
    const response = await getOwnerPost({
      user_id: user.userId,
      postId: editedValue.postId,
    });
    if (response.status === 200 && response.data) {
      setGenerationPostData(response.data);
      setIsAllow(response.data?.promptDetails.allowPromptView);
      setDefaultValues({
        caption: response.data.caption ?? null,
        category: editedValue.category ?? [],
        prompt: response.data?.promptDetails.prompt ?? null,
        image: response.data?.image,
        generatedFrom: {
          postId: null,
          modelId: response.data?.generatedFrom?.modelId!,
        },
        promptDetails: {
          creditPerPromptView: response.data?.promptDetails.creditPerPromptView,
          allowPromptView:
            response.data?.promptDetails.allowPromptView ?? false,
        },
      });
      return;
    }
    sendNotification({ type: "ERROR", message: response.error });
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (!isAllow) {
      setDefaultValues({
        ...defaultValues,
        promptDetails: {
          ...defaultValues?.promptDetails,
          creditPerPromptView: 0,
        },
      });
      return;
    }
  }, [isAllow]);

  const handleSave = async (values: Partial<OwnerPost>) => {
    const data = {
      caption: values.caption as string | null,
      category: values.category as string[],
      postId: editedValue.postId,
      promptDetails: values.promptDetails,
    };
    setIsLoading(true);
    const response = await updatePost({
      data,
      user_id: user?.userId,
    });
    if (response.status === 200) {
      sendNotification({
        type: "SUCCESS",
        message: "Data Updated Successfully",
      });
      dispatch(updateSimilarDiscoverPost(data));
      dispatch(updateCirclePost(data));
      dispatch(updateUserPost(data));
      setIsLoading(false);
      setIsOpenEditPost(false);
      setCustomDialogType(null);
      return;
    }
    sendNotification({ type: "ERROR", message: response.error });
    setIsLoading(false);
  };

  if (!generationPostData) {
    return <></>;
  }
  return (
    <CustomDialog
      isOpen={isOpenEditPost}
      onCancel={() => {
        setIsOpenEditPost(false);
        setStep(0);
      }}
      className="w-full max-h-[610px] flex flex-col    justify-start items-center"
    >
      <CustomDialogCommonTopBar
        onCancel={() => {
          setIsOpenEditPost(false);
          setStep(0);
        }}
        startIcon={
          step === 0 ? (
            <div className=" text-common-white  rounded-lg border-solid w-[25px]">
              <EditIcon />
            </div>
          ) : (
            <div
              className=" flex items-center text-common-white w-[25px] "
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
        title="Edit Generation Post"
      />
      <form className="h-full w-full  p-6">
        {step === 0 && (
          <div className="h-full w-full flex gap-10">
            <div className=" h-full  w-[50%] ">
              <div className="relative  h-full  object-cover overflow-hidden rounded-lg">
                {generationPostData?.image && (
                  <CustomImagePreview image={generationPostData.image[0].url} />
                )}
              </div>
            </div>

            <div className=" w-[60%]  flex flex-col justify-between">
              <div className=" flex flex-col ">
                <p className="mb-2">Prompts for the generation</p>
                <div className="border border-grey-700 py-4 px-4 rounded-xl">
                  <p className="text-common-white text-opacity-50">
                    {defaultValues?.prompt}
                  </p>
                </div>

                <div className="flex w-full justify-between items-center py-5 ">
                  <h6 className=" font-normal text-sm tracking-wider  text-common-white ">
                    Allow Others to see your prompt
                  </h6>

                  <CustomToggleSwitch
                    checked={defaultValues?.promptDetails?.allowPromptView}
                    handleToggle={(e: ChangeEvent<HTMLInputElement>) => {
                      setIsAllow(e.target.checked);
                      setDefaultValues({
                        ...defaultValues,
                        promptDetails: {
                          ...defaultValues?.promptDetails,
                          allowPromptView: e.target.checked,
                        },
                      });
                    }}
                  />
                </div>
                {defaultValues?.promptDetails?.allowPromptView && (
                  <div className="w-full  flex justify-between items-center py-5 gap-5">
                    <div className="flex flex-col gap-2">
                      <h6 className=" font-normal text-sm tracking-wider  text-common-white ">
                        Cost to Revel Prompt
                      </h6>
                      <p className="text-grey-300 font-light text-xs">
                        You will receive this credit when you create a post in
                        witit and someone wants to view the prompt of that post.
                      </p>
                      <p className="h-[7px] text-error-main text-xs">
                        {errorMessage}
                      </p>
                    </div>

                    <input
                      value={
                        defaultValues?.promptDetails?.creditPerPromptView! >= 1
                          ? defaultValues?.promptDetails?.creditPerPromptView
                          : ""
                      }
                      type="number"
                      onChange={(e) => {
                        setDefaultValues({
                          ...defaultValues,
                          promptDetails: {
                            ...defaultValues?.promptDetails,
                            creditPerPromptView: +e.target.value,
                          },
                        });
                      }}
                      placeholder="0"
                      className="w-[70px] p-2 text-center border  rounded-lg focus:outline-none border-grey-600 bg-grey-800 py-2"
                    />
                  </div>
                )}
              </div>

              <div className=" w-full flex justify-end">
                <CustomButton
                  name="Next"
                  endIcon={<RightThikArrowButton />}
                  className="w-fit text-base font-semibold px-20 py-3"
                  handleEvent={() => {
                    if (
                      defaultValues?.promptDetails?.allowPromptView &&
                      defaultValues?.promptDetails?.creditPerPromptView! <= 0
                    ) {
                      setErrorMessage(
                        "Cost per View Prompt must be greater than 0"
                      );
                      return;
                    }
                    setErrorMessage("");
                    setStep(1);
                  }}
                />
              </div>
            </div>
          </div>
        )}
        {step === 1 && (
          <GenerationPostCategory
            setStep={setStep}
            setDefaultValues={setDefaultValues}
            isLoading={isLoading}
            defaultValues={defaultValues}
            handleSave={handleSave}
          />
        )}
      </form>
    </CustomDialog>
  );
};

export default EditGenerationPostPrompt;
