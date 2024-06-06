import { updateAiModelDetails } from "@/api/ai/updateAiModelDetails";
import CustomButton from "@/components/shared/CustomButton";
import CustomInputTag from "@/components/shared/CustomInputTag";
import CustomInputTextField from "@/components/shared/CustomInputTextField";
import CustomLoadingButton from "@/components/shared/CustomLoadingButton";
import CustomToggleSwitch from "@/components/shared/CustomToggleSwitch";
import CustomDialog from "@/components/shared/dialog/CustomDialog";
import CustomDialogCommonTopBar from "@/components/shared/dialog/GlobalDialogs/components/shared/CustomDialogCommonTopBar";
import { useAuthContext } from "@/context/AuthContext";
import { updateModels } from "@/redux/slices/modelSlice";
import { RootState } from "@/redux/store";
import { theme } from "@/theme";
import { UserModel } from "@/types/ai";
import EditIcon from "@/utils/icons/shared/EditIcon";
import { Divider } from "@mui/material";
import React, { ChangeEvent, useContext, useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
type Props = {
  model: UserModel;
  setIsModelDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

export const EditModelDialog = ({ model, setIsModelDialogOpen }: Props) => {
  const dispatch = useDispatch();

  const user = useSelector((state: RootState) => state.user);
  const models = useSelector((state: RootState) => state.models);

  const { sendNotification } = useAuthContext();

  const [isModelSubmitting, setIsModelSubmitting] = useState(false);
  const [generationCostToggle, setGenerationCostToggle] = useState(false);

  const defaultValues: Partial<UserModel> = {
    modelId: model.modelId,
    modelName: model.modelName,
    generationSettings: model.generationSettings,
  };

  useEffect(() => {
    if (!user) return;

    setGenerationCostToggle(model.generationSettings.allowGenerationOnModel);
  }, [model]);

  const {
    control,
    setValue,
    handleSubmit,
    watch,
    getValues,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<Partial<UserModel>>({
    defaultValues,
    mode: "onSubmit",
  });

  const onSubmit = async (data: Partial<UserModel>) => {
    if (!user) return;

    setIsModelSubmitting(true);

    if (
      data?.generationSettings &&
      data.generationSettings.allowGenerationOnModel === false
    ) {
      data.generationSettings.creditPerPhoto = 0;
    }

    const result = await updateAiModelDetails({
      user_id: user.userId,
      data,
    });

    if (result.status === 200) {
      setIsModelSubmitting(false);
      sendNotification({
        type: "SUCCESS",
        message: "Data Updated Successfully",
      });
      setIsModelDialogOpen(false);

      const updatedUserModel = models.userModelList.map((model) => {
        if (model.modelId === data.modelId) {
          return {
            ...model,
            ...data,
          };
        }
        return model;
      });
      dispatch(updateModels({ userModelList: updatedUserModel }));
      return;
    }

    setIsModelSubmitting(false);
    sendNotification({ type: "ERROR", message: result.error });
  };

  return (
    <CustomDialog
      isOpen={true}
      onCancel={() => {
        setIsModelDialogOpen(false);
      }}
      className=" max-w-[700px] h-full  max-h-[90%]"
    >
      <div className="relative h-full flex flex-col">
        <div>
          <CustomDialogCommonTopBar
            startIcon={<EditIcon />}
            title="Edit Model"
            onCancel={() => {
              setIsModelDialogOpen(false);
            }}
          />
          <p className=" text-xs text-primary-main bg-primary-dark p-5">
            Please note that the training image and model class cannot be
            edited. If you wish to retrain the model, kindly delete this one and
            train a new model.
          </p>
        </div>
        <div className="flex-grow flex flex-col overflow-auto p-5 gap-5">
          <div className="flex flex-col gap-3 ">
            <p className="">Banned Words</p>
            <p className=" text-grey-300 font-light text-xs">
              Any words entered into this field will be prohibited to use,
              preventing the generation of images containing those words. By not
              including banned words, your verification badge will be red,
              indicating that nothing is off limits.
            </p>
            <div className="flex-grow bg-grey-800 rounded-lg max-h-[200px] overflow-hidden">
              <div className="w-full h-full p-5 overflow-auto">
                <Controller
                  name="generationSettings.bannedWords"
                  control={control}
                  render={({ field }) => (
                    <CustomInputTag
                      words={field.value}
                      setWords={(negativePrompt) => {
                        field.onChange(negativePrompt);
                      }}
                    />
                  )}
                />
              </div>
            </div>
          </div>
          <div>
            <p>Model Name</p>
            <div className="mt-2">
              <Controller
                name="modelName"
                control={control}
                render={({ field }) => (
                  <CustomInputTextField
                    placeholder="Model Name"
                    value={field.value}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => {
                      field.onChange(e.target.value);
                    }}
                  />
                )}
              />
            </div>
          </div>
          <div className=" flex flex-col gap-3">
            <p>Earn with Witit</p>
            <p className="text-grey-300 font-light text-xs">
              With Witit, you can allow others to generate images and By doing
              so you can charge credits per transaction and withdrawal those
              credits into cash at the rate of $1 for every 150 credits
            </p>
          </div>
          <div className=" bg-grey-800 flex flex-col gap-3 p-5 rounded-lg">
            <div className=" flex justify-between">
              <p className=" text-sm">Allow others to generate on your AI</p>
              <Controller
                name="generationSettings.allowGenerationOnModel"
                control={control}
                render={({ field }) => (
                  <CustomToggleSwitch
                    isChecked={field.value}
                    handleToggle={() => {
                      field.onChange(!field.value);
                      setGenerationCostToggle(!field.value);
                    }}
                  />
                )}
              />
            </div>
            {generationCostToggle && (
              <>
                <Divider
                  sx={{
                    borderColor: theme.palette.grey[500],
                  }}
                />
                <div className="w-full gap-12 flex justify-between items-center">
                  <div className=" flex flex-col gap-1">
                    <p className=" text-sm">Cost per derivative</p>
                    <p className="text-grey-200 text-xs">
                      If someone uses your image when generating their image,
                      you will get this credit.
                    </p>
                  </div>
                  <div className="w-[100px]">
                    <Controller
                      name="generationSettings.creditPerPhoto"
                      control={control}
                      rules={{
                        required: "This field is required",
                        min: {
                          value: 1,
                          message: "credit per photo must be greater than 0",
                        },
                      }}
                      render={({ field }) => (
                        <CustomInputTextField
                          type="number"
                          value={field.value}
                          onChange={(e: ChangeEvent<HTMLInputElement>) => {
                            console.log(e.target.value, "555");
                            field.onChange(e.target.value);
                          }}
                          className={`[&>.MuiInputBase-root>.MuiInputBase-input]:text-center py-2 ${
                            errors.generationSettings?.creditPerPhoto
                              ? "border-error-main"
                              : ""
                          } `}
                        />
                      )}
                    />
                  </div>
                </div>
                {errors.generationSettings?.creditPerPhoto && (
                  <p className="text-xs text-error-main">
                    {errors.generationSettings?.creditPerPhoto.message}
                  </p>
                )}
              </>
            )}
          </div>
        </div>
        <div className="w-full p-5 flex justify-center border-t border-t-grey-500">
          <CustomLoadingButton
            name="Save"
            className="max-w-[300px] py-3"
            handleEvent={handleSubmit(onSubmit)}
            loading={isModelSubmitting}
          />
        </div>
      </div>
    </CustomDialog>
  );
};
