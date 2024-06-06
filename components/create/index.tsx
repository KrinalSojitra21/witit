import { generateAiImage } from "@/api/ai/generateTextToImage";
import { getBaseAndSelfModels } from "@/api/ai/getBaseAndSelfModels";
import { getGenerationCharge } from "@/api/ai/getGenerationCharge";
import { useAuthContext } from "@/context/AuthContext";
import { CreateDrawerType } from "@/pages/create";
import { updateModels } from "@/redux/slices/modelSlice";
import { RootState } from "@/redux/store";
import { AiCharges, PostAiGeneration } from "@/types/ai";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { BottomBar } from "./components/BottomBar";
import FilterDrawer from "./components/FilterDrawer";
import { GenerationCreditDialog } from "./components/GenerationCreditDialog";
import { GenerationList } from "./components/Generations";
import ModelSelectionDrawer from "./components/ModelSelectionDrawer";
import { useGenerationContext } from "./context/GenerationContext";
import { uploadImageToStorage } from "@/service/firebase/uploadImage";
import { initialGenerationSetting } from "@/utils/constants/withoutHtml/ai";

const defaultValues = {
  prompt: "",
  numberOfGenerations: 4,
  superShoot: false,
  image: null,
  postId: null,
};

export const Create = () => {
  const dispatch = useDispatch();

  const user = useSelector((state: RootState) => state.user);
  const baseModels = useSelector(
    (state: RootState) => state.models.baseModelList
  );

  const {
    selectedModel,
    setSelectedModel,
    setGenerations,
    selectedImage,
    setSelectedImage,
    prompt,
    calculatedCharge,
  } = useGenerationContext();

  const [drawerType, setDrawerType] = useState<CreateDrawerType | null>(null);
  const [isCreditDialogOpen, setIsCreditDialogOpen] = useState(false);
  const [isGetChargeLoading, setIsGetChargeLoading] = useState(false);
  const [isGenerationSubmitting, setIsGenerationSubmitting] = useState(false);
  const [isnotEnoughCredit, setIsnotEnoughCredit] = useState<boolean>(false);
  const [generationSetting, setGenerationSetting] = useState(
    initialGenerationSetting
  );
  const [generationCharge, setGenerationCharge] = useState<AiCharges | null>(
    null
  );

  const {
    control,
    setValue,
    handleSubmit,
    watch,
    getValues,
    reset,
    resetField,
    formState: { errors, isSubmitting },
  } = useForm<PostAiGeneration>({
    defaultValues,
  });

  const { sendNotification } = useAuthContext();

  const getUserModels = async () => {
    if (!user) return;

    const res = await getBaseAndSelfModels({ user_id: user.userId });
    if (res.status === 200) {
      dispatch(
        updateModels({
          baseModelList: res.data.baseModelList,
          userModelList: res.data.userModelList,
        })
      );

      setSelectedModel({
        modelId: res.data.baseModelList[0].modelId.toString(),
        modelName: res.data.baseModelList[0].modelName,
        classType: "Base",
      });
      return;
    }

    sendNotification({ type: "ERROR", message: res.error });
  };

  useEffect(() => {
    getUserModels();

    // return () => {
    //   getUserModels();
    // };
  }, []);

  useEffect(() => {
    setValue("negativePrompt", generationSetting.negativePrompt);
    setValue("creationSettings", generationSetting.creationSettings);
    setValue("recreationSettings", generationSetting.recreationSettings);
    setValue("hiResSettings", generationSetting.hiResSettings);
    setValue("inPaintingSettings", generationSetting.inPaintingSettings);
  }, [generationSetting]);

  useEffect(() => {
    if (selectedModel) {
      setValue("modelId", selectedModel.modelId.toString());
    }
  }, [selectedModel]);

  useEffect(() => {
    if (prompt) {
      setValue("prompt", prompt);
    }
  }, [prompt]);

  useEffect(() => {
    if (!isCreditDialogOpen) {
      setIsGenerationSubmitting(false);
    }
  }, [isCreditDialogOpen]);

  const handleGetGenerationCharge = async () => {
    if (!user || !selectedModel) return;

    let newCreationSettings = { ...generationSetting.creationSettings };
    newCreationSettings.imageSize = baseModels.find(
      (model) => model.modelId === selectedModel?.modelId
    )
      ? newCreationSettings.imageSize || "md"
      : "lg";

    setIsGetChargeLoading(true);
    const result = await getGenerationCharge({
      user_id: user.userId,
      modelId: selectedModel.modelId.toString(),
      creationSettings: newCreationSettings,
      postId: null,
    });

    if (result.status === 200 && result.data) {
      setGenerationCharge(result.data.charges);
      setIsCreditDialogOpen(true);
      setIsGetChargeLoading(false);
      return;
    }
    if (result.status === 403) {
      setIsnotEnoughCredit(true);
      return;
    }
    sendNotification({ type: "ERROR", message: result.error });
  };

  const onGenerate = async (data: PostAiGeneration) => {
    if (!user) return;

    data.creationSettings.imageSize = baseModels.find(
      (model) => model.modelId === selectedModel?.modelId
    )
      ? data.creationSettings.imageSize
      : "lg";

    setIsGenerationSubmitting(true);

    if (selectedImage) {
      const image = await uploadImageToStorage({
        folderName: "generation_images",
        file: selectedImage.file,
        metadata: {
          userId: user.userId,
        },
      });

      data.image = image;
    }

    const result = await generateAiImage({
      user_id: user.userId,
      generationBody: data,
    });

    if (result.status === 200) {
      setGenerations((preData) => {
        if (result.data) {
          return [result.data, ...preData];
        } else {
          return preData;
        }
      });

      setIsCreditDialogOpen(false);
      // reset();
      resetField("image");
      resetField("postId");
      resetField("numberOfGenerations");
      resetField("prompt");
      resetField("superShoot");

      setSelectedImage(null);

      return;
    }

    setIsGenerationSubmitting(false);
    sendNotification({ type: "ERROR", message: result.error });
  };

  return (
    <form
      className="w-full h-full flex flex-col relative"
      // onDragOver={handleDragOver}
      // onDrop={handleDrop}
      // onDragLeave={handleLeave}
      onSubmit={(e) => e.preventDefault()}
    >
      <div
        className={`flex-grow ${
          drawerType !== null || isCreditDialogOpen
            ? "overflow-hidden  pr-1"
            : "overflow-auto"
        }`}
      >
        <div className="relative rounded-xl h-full px-4 pt-4">
          <GenerationList />
        </div>
      </div>
      <BottomBar
        handleChangeDrawerType={(type) => setDrawerType(type)}
        control={control}
        setValue={setValue}
        handleGetGenerationCharge={() => handleGetGenerationCharge()}
        isGetChargeLoading={isGetChargeLoading}
      />
      {isCreditDialogOpen && generationCharge ? (
        <GenerationCreditDialog
          setIsCreditDialogOpen={setIsCreditDialogOpen}
          handleSubmit={handleSubmit(onGenerate)}
          generationCharge={generationCharge}
          control={control}
          getValues={getValues}
          isButtonLoading={isGenerationSubmitting}
          isnotEnoughCredit={isnotEnoughCredit}
          setIsnotEnoughCredit={setIsnotEnoughCredit}
        />
      ) : null}

      {drawerType ? (
        <div className=" w-full h-full bg-secondary-light absolute top-0 left-0">
          <div
            className={`w-full h-full bg-secondary-main bg-opacity-30 absolute top-0 z-40`}
            onClick={() => setDrawerType(null)}
          ></div>
          <div
            className={`${
              drawerType === "MODEL_SELECTION"
                ? "w-[400px] border-l"
                : drawerType === "FILTER" //previous w-[480px]
                ? " w-[750px] border-l"
                : "w-0"
            }  transition-all duration-[800ms] absolute z-40 right-0 flex flex-col
             top-0 bottom-0 bg-secondary-main border-grey-500`}
          >
            {drawerType === "MODEL_SELECTION" ? (
              <ModelSelectionDrawer
                handleCloseDrawer={() => setDrawerType(null)}
              />
            ) : (
              <FilterDrawer
                generationSetting={generationSetting}
                setGenerationSetting={setGenerationSetting}
                handleCloseDrawer={() => setDrawerType(null)}
              />
            )}
          </div>
        </div>
      ) : null}
    </form>
  );
};
