import { useGenerationContext } from "@/components/create/context/GenerationContext";
import CustomButton from "@/components/shared/CustomButton";
import CustomCheckbox from "@/components/shared/CustomCheckbox";
import { CustomSlider } from "@/components/shared/CustomSlider";
import { RootState } from "@/redux/store";
import { CreationSettings } from "@/types/ai";
import { imageSizes } from "@/utils/constants/withoutHtml/ai";
import { aspectRatioList } from "@/utils/constants/withoutHtml/common";
import CheckBoxEmptyIcon from "@/utils/icons/shared/CheckBoxEmptyIcon";
import CheckBoxFillCheckedIcon from "@/utils/icons/shared/CheckBoxFillCheckedIcon";
import CheckBoxTickCheckedIcon from "@/utils/icons/shared/CheckBoxTickCheckedIcon";
import { ChangeEvent } from "react";
import { useSelector } from "react-redux";

type Props = {
  creationSettings: CreationSettings;
  setCreationSetting: (creationSettings: CreationSettings) => void;
};

export const Creations = ({ creationSettings, setCreationSetting }: Props) => {
  const baseModels = useSelector(
    (state: RootState) => state.models.baseModelList
  );
  const { selectedModel } = useGenerationContext();

  const handleCreationSettingChange = (changes: Partial<CreationSettings>) => {
    setCreationSetting({
      ...creationSettings,
      ...changes,
    });
  };

  return (
    <div className="gap-6 flex flex-col h-full p-5 overflow-y-auto overflow-x-hidden">
      {baseModels.filter((model) => model.modelId === selectedModel?.modelId)
        .length > 0 && (
        <div className="text-sm">
          <h5 className="text-common-white">Image Size</h5>
          <div className="mt-2.5 flex gap-4 text-common-white">
            {imageSizes.slice(0, 2).map((item, index) => {
              return (
                <div key={index}>
                  <CustomButton
                    className={`px-4 py-1.5 rounded-md border border-solid ${
                      item.tag === creationSettings.imageSize
                        ? "bg-primary-main border-primary-main"
                        : "bg-grey-800 text-grey-300 border-grey-700"
                    } tracking-wider text-center text-[13px] leading-5`}
                    name={item.name}
                    onClick={() =>
                      handleCreationSettingChange({ imageSize: item.tag })
                    }
                  />
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="text-sm">
        <h5 className=" text-common-white">Aspect Ratio</h5>
        <div className="mt-2.5 flex gap-2.5  text-common-white">
          {aspectRatioList.map((item, index) => {
            return (
              <div key={index}>
                <CustomButton
                  className={`px-2 py-1.5 rounded-md border border-solid ${
                    item.tag === creationSettings.aspectRatio
                      ? "bg-primary-main border-primary-main"
                      : "bg-grey-800 text-grey-300 border-grey-700"
                  } tracking-wider min-w-0 w-[50px] text-center text-[13px] leading-5`}
                  name={item.displayName}
                  onClick={() =>
                    handleCreationSettingChange({ aspectRatio: item.tag })
                  }
                />
              </div>
            );
          })}
        </div>
      </div>
      <div className="flex flex-col gap-1.5 -mb-2.5">
        <div className="flex flex-col justify-between">
          <div className=" flex flex-col gap-1.5">
            <h5 className="text-sm text-common-white">Prompt Strength</h5>
            <p className="text-xs text-grey-300 leading-[18px]">
              This determines how much Witit’s AI should stick too your prompt.
              Too much or too little can create and undesirable effect.
            </p>
          </div>
          <div className="px-1 pt-1">
            <CustomSlider
              valueLabelDisplay="auto"
              valueLabelFormat={(value) => `${value * 10}%`}
              aria-label="pretto slider"
              value={creationSettings.promptStrength}
              step={1}
              max={10}
              min={0}
              onChange={(event, newVal) =>
                handleCreationSettingChange({
                  promptStrength: newVal as number,
                })
              }
            />
          </div>
        </div>
        <div className="flex flex-col">
          <div className=" flex flex-col gap-1.5">
            <h5 className="text-sm text-common-white">Defination</h5>
            <p className="text-xs text-grey-300 leading-[18px]">
              This will increase the number of iterations our AI will make when
              producing your photos. This can change your cost per creation.
            </p>
          </div>
          <div className="px-1 pt-2">
            <CustomSlider
              valueLabelDisplay="auto"
              valueLabelFormat={(value) => `${value}%`}
              aria-label="pretto slider"
              value={creationSettings.definition}
              step={10}
              max={100}
              min={0}
              onChange={(event, newVal) =>
                handleCreationSettingChange({
                  definition: newVal as number,
                })
              }
            />
          </div>
        </div>
      </div>
      <div className="flex items-start gap-3">
        <CustomCheckbox
          className="w-auto p-0.5 [&.Mui-checked]:text-primary-main text-grey-200"
          icon={<CheckBoxEmptyIcon />}
          checkedIcon={<CheckBoxTickCheckedIcon />}
          checked={creationSettings.restoreFace}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            handleCreationSettingChange({
              restoreFace: e.target.checked,
            })
          }
        />
        <div className="flex flex-col gap-1.5 mt-1">
          <h5
            className="text-sm text-common-white cursor-pointer"
            onClick={() =>
              handleCreationSettingChange({
                restoreFace: !creationSettings.restoreFace,
              })
            }
          >
            Restore Faces
          </h5>
          <p className="text-xs text-grey-300 leading-[18px]">
            Runs Another AI Model on top to create the face in the image.
          </p>
        </div>
      </div>

      <div className="flex items-start gap-3">
        <CustomCheckbox
          className="w-auto p-0.5 [&.Mui-checked]:text-primary-main text-grey-200"
          icon={<CheckBoxEmptyIcon />}
          checkedIcon={<CheckBoxTickCheckedIcon />}
          checked={creationSettings.preserveFaceDetails ? true : false}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            handleCreationSettingChange({
              preserveFaceDetails: e.target.checked
                ? { preservationStrength: 0.5, definition: 50 }
                : null,
            })
          }
        />
        <div className="flex flex-col gap-1.5 mt-1">
          <h5
            className="text-sm text-common-white cursor-pointer"
            onClick={() => {
              handleCreationSettingChange({
                preserveFaceDetails: creationSettings.preserveFaceDetails
                  ? null
                  : { preservationStrength: 0.5, definition: 50 },
              });
            }}
          >
            Preserve Face Details
          </h5>
          <p className="text-xs text-grey-300 leading-[18px]">
            Run the AI creation process one more time but only on your face to
            ensure high quality results.
          </p>
          {creationSettings.preserveFaceDetails ? (
            <div className="flex flex-col gap-4 -mb-2.5">
              <div className="flex flex-col gap-1 pt-5  ">
                <h5 className="text-sm text-common-white cursor-pointer">
                  Face Preservation Strength
                </h5>
                <p className="text-xs text-grey-300 leading-[18px]">
                  too much or too little may cause undesirable effects
                </p>
                <CustomSlider
                  valueLabelDisplay="auto"
                  valueLabelFormat={(value) => `${value * 100}%`}
                  aria-label="pretto slider"
                  value={
                    creationSettings.preserveFaceDetails?.preservationStrength
                  }
                  step={0.1}
                  max={1}
                  min={0}
                  onChange={(event, newVal) => {
                    if (creationSettings.preserveFaceDetails) {
                      handleCreationSettingChange({
                        ...creationSettings,
                        preserveFaceDetails: {
                          ...creationSettings.preserveFaceDetails,
                          preservationStrength: newVal as number,
                        },
                      });
                    }
                  }}
                />
              </div>
              <div className="flex flex-col gap-1">
                <h5 className="text-sm text-common-white cursor-pointer">
                  Definition
                </h5>
                <p className="text-xs text-grey-300 leading-[18px]">
                  This will increase the number of iterations our AI will make
                  when producing your photos.
                </p>
                <CustomSlider
                  valueLabelDisplay="auto"
                  valueLabelFormat={(value) => `${value}%`}
                  aria-label="pretto slider"
                  value={creationSettings.preserveFaceDetails?.definition}
                  step={10}
                  max={100}
                  min={0}
                  onChange={(event, newVal) => {
                    if (creationSettings.preserveFaceDetails) {
                      handleCreationSettingChange({
                        ...creationSettings,
                        preserveFaceDetails: {
                          ...creationSettings.preserveFaceDetails,
                          definition: newVal as number,
                        },
                      });
                    }
                  }}
                />
              </div>
            </div>
          ) : null}
        </div>
      </div>
      <div className="flex items-start gap-3">
        <CustomCheckbox
          className="w-auto p-0.5 [&.Mui-checked]:text-primary-main text-grey-200"
          icon={<CheckBoxEmptyIcon />}
          checkedIcon={<CheckBoxTickCheckedIcon />}
          checked={creationSettings.preserveHandDetails ? true : false}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            handleCreationSettingChange({
              preserveHandDetails: e.target.checked
                ? { preservationStrength: 0.5, definition: 50 }
                : null,
            })
          }
        />
        <div className="flex flex-col gap-1.5 mt-1">
          <h5
            className="text-sm text-common-white cursor-pointer"
            onClick={() => {
              handleCreationSettingChange({
                preserveHandDetails: creationSettings.preserveHandDetails
                  ? null
                  : { preservationStrength: 0.5, definition: 50 },
              });
            }}
          >
            Preserve Hand Details
          </h5>
          <p className="text-xs text-grey-300 leading-[18px]">
            Run the AI creation process one more time but only on your hand to
            ensure high quality results.
          </p>
          {creationSettings.preserveHandDetails ? (
            <div className="flex flex-col gap-4 -mb-2.5">
              <div className="flex flex-col gap-1 pt-5  ">
                <h5 className="text-sm text-common-white cursor-pointer">
                  Hand Preservation Strength{" "}
                </h5>
                <p className="text-xs text-grey-300 leading-[18px]">
                  too much or too little may cause undesirable effects{" "}
                </p>
                <CustomSlider
                  valueLabelDisplay="auto"
                  valueLabelFormat={(value) => `${value * 100}%`}
                  aria-label="pretto slider"
                  value={
                    creationSettings.preserveHandDetails?.preservationStrength
                  }
                  step={0.1}
                  max={1}
                  min={0}
                  onChange={(event, newVal) => {
                    if (creationSettings.preserveHandDetails) {
                      handleCreationSettingChange({
                        ...creationSettings,
                        preserveHandDetails: {
                          ...creationSettings.preserveHandDetails,
                          preservationStrength: newVal as number,
                        },
                      });
                    }
                  }}
                />
              </div>
              <div className="flex flex-col gap-1">
                <h5 className="text-sm text-common-white cursor-pointer">
                  Definition
                </h5>
                <p className="text-xs text-grey-300 leading-[18px]">
                  This will increase the number of iterations our AI will make
                  when producing your photos.
                </p>
                <CustomSlider
                  valueLabelDisplay="auto"
                  valueLabelFormat={(value) => `${value}%`}
                  aria-label="pretto slider"
                  value={creationSettings.preserveHandDetails?.definition}
                  step={10}
                  max={100}
                  min={0}
                  onChange={(event, newVal) => {
                    if (creationSettings.preserveHandDetails) {
                      handleCreationSettingChange({
                        ...creationSettings,
                        preserveHandDetails: {
                          ...creationSettings.preserveHandDetails,
                          definition: newVal as number,
                        },
                      });
                    }
                  }}
                />
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};
