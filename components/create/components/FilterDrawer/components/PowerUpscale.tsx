import { HiResSettings } from "@/types/ai";
import React from "react";
import CustomButton from "@/components/shared/CustomButton";
import CustomCheckbox from "@/components/shared/CustomCheckbox";
import { CustomSlider } from "@/components/shared/CustomSlider";
import { imageSizes } from "@/utils/constants/withoutHtml/ai";
import {
  ResolutionList,
  aspectRatioList,
} from "@/utils/constants/withoutHtml/common";
import CheckBoxEmptyIcon from "@/utils/icons/shared/CheckBoxEmptyIcon";
import CheckBoxTickCheckedIcon from "@/utils/icons/shared/CheckBoxTickCheckedIcon";
import { ChangeEvent } from "react";

type Props = {
  hiResSettings: HiResSettings | null;
  setHiResSettings: (creationSettings: HiResSettings | null) => void;
};

const PowerUpscale = ({ hiResSettings, setHiResSettings }: Props) => {
  const handleCreationSettingChange = (changes: Partial<HiResSettings>) => {
    if (!hiResSettings) return;

    setHiResSettings({
      ...hiResSettings,
      ...changes,
    });
  };
  return (
    <div className="gap-6 flex flex-col h-full p-5 overflow-y-auto overflow-x-hidden">
      <div className="flex items-start gap-3">
        <CustomCheckbox
          className="w-auto p-0.5 [&.Mui-checked]:text-primary-main text-grey-200"
          icon={<CheckBoxEmptyIcon />}
          checkedIcon={<CheckBoxTickCheckedIcon />}
          checked={hiResSettings ? true : false}
          onChange={(e: ChangeEvent<HTMLInputElement>) => {
            if (e.target.checked) {
              setHiResSettings({
                definition: 50,
                similarityStrength: 0.5,
                increaseResolution: 1,
              });
            } else {
              setHiResSettings(null);
            }
          }}
        />
        <div className="flex flex-col gap-1.5 mt-1">
          <h5
            className="text-sm text-common-white cursor-pointer"
            onClick={() => {
              if (hiResSettings) {
                setHiResSettings(null);
              } else {
                setHiResSettings({
                  definition: 50,
                  similarityStrength: 0.5,
                  increaseResolution: 1,
                });
              }
            }}
          >
            Configure Advance Recreation Settings
          </h5>
        </div>
      </div>

      {hiResSettings ? (
        <div className="flex flex-col gap-1.5 -mb-2.5">
          <div className="flex flex-col">
            <div className=" flex flex-col gap-1.5">
              <h5 className="text-sm text-common-white">Defination</h5>
              <p className="text-xs text-grey-300 leading-[18px]">
                This will increase the number of iterations our AI will make
                when producing your photos. This can change your cost per
                creation.
              </p>
            </div>
            <div className="px-1 pt-2">
              <CustomSlider
                valueLabelDisplay="auto"
                valueLabelFormat={(value) => `${value}%`}
                aria-label="pretto slider"
                value={hiResSettings?.definition}
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
          </div>{" "}
          <div className="flex flex-col justify-between">
            <div className=" flex flex-col gap-1.5">
              <h5 className="text-sm text-common-white">Similarity Strength</h5>
              <p className="text-xs text-grey-300 leading-[18px]">
                This determines how much Witit’s AI should stick too your
                prompt. Too much or too little can create and undesirable
                effect.
              </p>
            </div>
            <div className="px-1 pt-1">
              {/* reverted */}

              <CustomSlider
                marks={false}
                valueLabelDisplay="auto"
                valueLabelFormat={(v) => (Math.round(v * 10) / 10) * 100 + "%"}
                aria-label="pretto slider"
                value={1 - hiResSettings?.similarityStrength}
                step={0.1}
                max={1}
                min={0}
                onChange={(event, newVal) =>
                  handleCreationSettingChange({
                    similarityStrength:
                      Math.round((1 - (newVal as number)) * 10) / 10,
                  })
                }
              />
            </div>
          </div>{" "}
          <div className="text-sm">
            <h5 className=" text-common-white">Increase Resolution</h5>
            <div className="mt-2.5 flex gap-2.5  text-common-white">
              {ResolutionList.map((item, index) => {
                return (
                  <div key={index}>
                    <CustomButton
                      className={`px-2 py-1.5 rounded-md border border-solid ${
                        item.tag === hiResSettings?.increaseResolution
                          ? "bg-primary-main border-primary-main"
                          : "bg-grey-800 text-grey-300 border-grey-700"
                      } tracking-wider min-w-0 w-[50px] text-center text-[13px] leading-5`}
                      name={item.displayName}
                      onClick={() =>
                        handleCreationSettingChange({
                          increaseResolution: item.tag,
                        })
                      }
                    />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default PowerUpscale;
