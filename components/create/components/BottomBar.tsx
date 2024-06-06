import { CircularProgress, IconButton } from "@mui/material";
import PlusIcon from "@/utils/icons/shared/PlusIcon";
import CustomInputTextField from "../../shared/CustomInputTextField";
import LampIcon from "@/utils/icons/shared/LampIcon";
import FilterIcon from "@/utils/icons/shared/FilterIcon";
import { CustomImagePreview } from "../../shared/CustomImagePreview";
import { useAuthContext } from "@/context/AuthContext";
import { defaultImageConstant } from "@/utils/constants/withoutHtml/appConstant";
import { ImageInfo } from "@/types";
import { useEffect, useState } from "react";
import ArrowDownIcon from "@/utils/icons/shared/ArrowDownIcon";
import DeleteIcon from "@/utils/icons/shared/DeleteIcon";
import SendIcon from "@/utils/icons/circle/SendIcon";
import { getPrompt } from "@/api/public/getPrompt";
import { CreateDrawerType } from "@/pages/create";
import { Control, Controller, UseFormSetValue } from "react-hook-form";
import { Model, PostAiGeneration } from "@/types/ai";
import { useGenerationContext } from "../context/GenerationContext";
import InputCropSingleImage from "@/components/shared/cropImage/singleCropImage/InputCropSingleImage";

type Props = {
  handleChangeDrawerType: (type: CreateDrawerType) => void;
  control: Control<PostAiGeneration>;
  setValue: UseFormSetValue<PostAiGeneration>;
  handleGetGenerationCharge: () => void;
  isGetChargeLoading: boolean;
};

export const BottomBar = ({
  handleChangeDrawerType,
  control,
  setValue,
  handleGetGenerationCharge,
  isGetChargeLoading,
}: Props) => {
  const [isPromptLoading, setIsPromptLoading] = useState(false);
  const [isShowDeleteIcon, setIsShowDeleteIcon] = useState(false);

  const { customDrawerType, sendNotification } = useAuthContext();

  const { selectedModel, selectedImage, setSelectedImage } =
    useGenerationContext();

  const getMyPrompt = async () => {
    setIsPromptLoading(true);
    const res = await getPrompt({
      path: selectedModel?.classType ?? "Man",
    });

    if (res.status === 200) {
      setValue("prompt", res.data.prompt);
      setIsPromptLoading(false);
      return;
    }

    sendNotification({ type: "ERROR", message: res.error });
  };

  useEffect(() => {
    setValue("prompt", "");
    () => setValue("prompt", "");
  }, [selectedModel?.classType]);

  useEffect(() => {
    setIsShowDeleteIcon(false);
  }, [selectedImage]);

  return (
    <div className="p-4 w-full justify-between flex items-center gap-3 bg-secondary-main">
      <div
        className="h-[60px] aspect-square flex justify-center items-center bg-grey-900 rounded-xl cursor-pointer"
        onClick={() => {
          if (!isPromptLoading) getMyPrompt();
        }}
      >
        {isPromptLoading ? (
          <IconButton className="w-full h-full text-grey-100">
            <CircularProgress color="inherit" size={26} />
          </IconButton>
        ) : (
          <IconButton className="w-full h-full text-grey-100 hover:text-primary-main">
            <LampIcon />
          </IconButton>
        )}
      </div>
      <div className="h-[60px] aspect-square bg-grey-900 rounded-xl">
        {!selectedImage ? (
          <IconButton className=" w-full h-full  rounded-lg text-grey-100 hover:text-primary-main   p-0 m-0 ">
            <InputCropSingleImage
              type="CREATE"
              aspect={"1/1"}
              finalImage={selectedImage}
              setFinalImage={setSelectedImage}
              placeholder={{
                placeholderImg: (
                  <div className="scale-75 hover:text-primary-main">
                    <PlusIcon />
                  </div>
                ),
                placeholderTitle: <></>,
              }}
            />
          </IconButton>
        ) : (
          <div
            className="relative h-full w-full rounded-lg overflow-hidden cusor-pointer"
            onClick={() => {
              setSelectedImage(null);
              setIsShowDeleteIcon(false);
            }}
            onMouseEnter={() => setIsShowDeleteIcon(true)}
            onMouseLeave={() => setIsShowDeleteIcon(false)}
          >
            {isShowDeleteIcon ? (
              <div className="absolute w-full h-full flex items-center justify-center z-10 bg-common-black bg-opacity-60 text-error-main cursor-pointer opacity-0 hover:opacity-100">
                <DeleteIcon />
              </div>
            ) : null}
            <CustomImagePreview image={selectedImage.imagePreview} />
          </div>
        )}
      </div>
      <div className="flex-grow">
        <Controller
          name="prompt"
          control={control}
          rules={{
            required: {
              value: true,
              message: "Prompt is required field",
            },
            minLength: {
              value: 3,
              message: "Prompt must be atleast 3 characters long",
            },
          }}
          render={({ field }) => (
            <CustomInputTextField
              inputRef={field.ref}
              multiline
              maxRows={3}
              value={field.value}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                field.onChange(e.target.value);
              }}
              placeholder="What you want to create..?"
              EndIcon={
                isGetChargeLoading ? (
                  <IconButton className="text-grey-300">
                    <CircularProgress color="inherit" size={24} />
                  </IconButton>
                ) : (
                  <IconButton
                    className={
                      field.value && field.value.split(" ").length > 3
                        ? "text-primary-main cursor-pointer"
                        : "text-grey-300 cursor-default"
                    }
                  >
                    <SendIcon />
                  </IconButton>
                )
              }
              EndIconHandleEvent={() => {
                if (field.value && field.value.split(" ").length > 3) {
                  handleGetGenerationCharge();
                }
              }}
              className="text-grey-100 hover:text-primary-main  rounded-xl bg-grey-900 border-0 h-full py-2 min-h-[60px]"
            />
          )}
        />
      </div>
      <div className="flex gap-3 h-[60px]">
        <div
          onClick={() => {
            handleChangeDrawerType("MODEL_SELECTION");
          }}
          className="flex gap-3 h-full items-center bg-grey-900 rounded-xl text-common-white text-sm tracking-widest cursor-pointer font-light p-4"
        >
          {selectedModel?.modelName}
          <IconButton
            className={`p-0 m-0 ${
              customDrawerType === null ? "rotate-0" : "rotate-180"
            }`}
          >
            <div className="-rotate-90 scale-75">
              <ArrowDownIcon />
            </div>
          </IconButton>
        </div>
        <IconButton
          className="aspect-square bg-grey-900 text-grey-100 hover:text-primary-main p-4 rounded-xl"
          onClick={() => {
            handleChangeDrawerType("FILTER");
          }}
        >
          <FilterIcon />
        </IconButton>
      </div>
    </div>
  );
};
