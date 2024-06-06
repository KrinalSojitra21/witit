import React, { useEffect } from "react";
import CustomButton from "@/components/shared/CustomButton";
import { IconButton, List } from "@mui/material";
import Image from "next/image";
import { useState } from "react";
import CloseIcon from "@/utils/icons/shared/CloseIcon";
import CustomInputTag from "@/components/shared/CustomInputTag";
import { filterImage } from "@/utils/images";
import { Creations } from "./components/Creations";
import { Recreations } from "./components/Recreations";
import { GenerationSetting } from "@/types/ai";
import { initialGenerationSetting } from "@/utils/constants/withoutHtml/ai";
import PowerUpscale from "./components/PowerUpscale";
import Inpainting from "./components/Inpainting";
import CustomAccordion from "@/components/shared/CustomAccordion";
import CustomCheckbox from "@/components/shared/CustomCheckbox";
import CheckBoxEmptyIcon from "@/utils/icons/shared/CheckBoxEmptyIcon";
import CheckBoxTickCheckedIcon from "@/utils/icons/shared/CheckBoxTickCheckedIcon";
import ReverseIcon from "@/utils/icons/shared/ReverseIcon";

const menuOptions = [
  { name: "Negative Prompts", key: "NEGATIVE_PROMPTS" },
  { name: "Creations", key: "CREATIONS" },
  { name: "Recreations", key: "RECREATIONS" },
  { name: "Power Upscale", key: "POWER_UPSCALE" },
  { name: "Inpainting", key: "INPAINTING" },
];

type Props = {
  handleCloseDrawer: () => void;
  generationSetting: GenerationSetting;
  setGenerationSetting: React.Dispatch<React.SetStateAction<GenerationSetting>>;
};

const FilterDrawer = ({
  handleCloseDrawer,
  generationSetting,
  setGenerationSetting,
}: Props) => {
  const [selectedOption, setSelectedOption] =
    useState<string>("NEGATIVE_PROMPTS");
  const [tempGenerationSetting, setTempGenerationSetting] =
    useState(generationSetting);

  const handleChangeGenerationSetting = (
    changes: Partial<GenerationSetting>
  ) => {
    setTempGenerationSetting((preSetting) => {
      return {
        ...preSetting,
        ...changes,
      };
    });
  };

  const handleChanges = ({ isSet }: { isSet: boolean }) => {
    if (isSet) {
      setGenerationSetting(tempGenerationSetting);
      handleCloseDrawer();
      return;
    }

    setGenerationSetting(initialGenerationSetting);
    setTempGenerationSetting(initialGenerationSetting);
  };

  useEffect(() => {
    setTempGenerationSetting(generationSetting);
  }, [generationSetting]);

  return (
    <>
      <div className="p-5 bg-grey-900 border-b border-b-grey-500 flex justify-between items-center">
        <div className="relative flex gap-4 items-center text-common-white">
          <Image fill alt="" src={filterImage} className="relative w-[20px]" />
          <p className="text-base">Filters</p>
        </div>
        <div
          className="text-grey-400 scale-150 cursor-pointer hover:text-common-white"
          onClick={handleCloseDrawer}
        >
          <CloseIcon />
        </div>
      </div>
      <div className="flex-grow flex flex-col overflow-auto justify-between">
        <div className="overflow-auto">
          <CustomAccordion
            name="Negative Prompts"
            element={
              <CustomInputTag
                words={tempGenerationSetting.negativePrompt}
                setWords={(negativePrompt) =>
                  handleChangeGenerationSetting({ negativePrompt })
                }
              />
            }
          />
          <CustomAccordion
            name="Creation Settings"
            element={
              <Creations
                creationSettings={tempGenerationSetting.creationSettings}
                setCreationSetting={(creationSettings) =>
                  handleChangeGenerationSetting({ creationSettings })
                }
              />
            }
          />
          <CustomAccordion
            name="Recreation Settings"
            element={
              <Recreations
                recreationSettings={tempGenerationSetting.recreationSettings}
                setRecreationSetting={(recreationSettings) =>
                  handleChangeGenerationSetting({ recreationSettings })
                }
              />
            }
          />

          <CustomAccordion
            name="Power Upscale Settings"
            element={
              <PowerUpscale
                hiResSettings={tempGenerationSetting.hiResSettings}
                setHiResSettings={(hiResSettings) =>
                  handleChangeGenerationSetting({ hiResSettings })
                }
              />
            }
          />
          <CustomAccordion
            name="Inpainting Settings"
            element={<Inpainting />}
          />
        </div>

        <div>
          <div className=" flex flex-col h-full  overflow-y-auto overflow-x-hidden">
            <div className="flex items-start gap-3 bg-grey-900 py-4 px-3 border border-grey-800">
              <CustomCheckbox
                className="w-auto p-0.5 [&.Mui-checked]:text-primary-main text-grey-200"
                icon={<CheckBoxEmptyIcon />}
                checkedIcon={<CheckBoxTickCheckedIcon />}
                checked={true}
              />
              <div className="flex flex-col gap-1.5 mt-1">
                <h5 className="text-sm text-common-white cursor-pointer">
                  Make this filter default{" "}
                </h5>
                <p className="text-common-white text-opacity-40 text-xs">
                  So that next time our AI wil automatically use this setting.
                </p>
              </div>
            </div>
            <div className="flex items-center justify-between border-t border-t-grey-700 px-3 py-3">
              <IconButton
                className="flex w-fit text-primary-main text-sm gap-2 items-center tracking-wider font-light"
                onClick={() => handleChanges({ isSet: false })}
                disableRipple
              >
                <div className="text-primary-main  ">
                  <ReverseIcon />
                </div>
                <p>Reset to defaults</p>
              </IconButton>
              <CustomButton
                name="Save"
                className="bg-primary-main text-common-white rounded-lg px-7 py-2 text-sm w-[130px]"
                handleEvent={() => handleChanges({ isSet: true })}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default FilterDrawer;
