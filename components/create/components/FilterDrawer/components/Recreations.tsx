import CustomButton from "@/components/shared/CustomButton";
import { CustomSlider } from "@/components/shared/CustomSlider";
import CustomToggleSwitch from "@/components/shared/CustomToggleSwitch";
import { RecreationSettings } from "@/types/ai";
import { useEffect, useState } from "react";

type Props = {
  recreationSettings: RecreationSettings | null;
  setRecreationSetting: (creationSettings: RecreationSettings) => void;
};

type RecreationItem = {
  displayName: string;
  tag: string;
};

const recreationTypeList: RecreationItem[] = [
  {
    displayName: "Copy Depth",
    tag: "depth",
  },
  {
    displayName: "Copy Pose",
    tag: "pose",
  },
  {
    displayName: "Copy Edges",
    tag: "canny",
  },
];

export const Recreations = ({
  recreationSettings,
  setRecreationSetting,
}: Props) => {
  const [isShowAdvanceSettings, setIsShowAdvanceSettings] = useState(
    recreationSettings?.recreationType ? true : false
  );

  useEffect(() => {
    setIsShowAdvanceSettings(recreationSettings?.recreationType ? true : false);
  }, [recreationSettings?.recreationType]);

  const handleRecreationSettingChange = (
    changes: Partial<RecreationSettings>
  ) => {
    if (!recreationSettings) return;
    setRecreationSetting({
      ...recreationSettings,
      ...changes,
    });
  };

  const handleToggleAdvanceConfig = () => {
    if (isShowAdvanceSettings) {
      handleRecreationSettingChange({
        recreationType: null,
        recreationTypeStrength: null,
      });
      setIsShowAdvanceSettings(false);
      return;
    }

    handleRecreationSettingChange({
      recreationType: "depth",
      recreationTypeStrength: 0.6,
    });
    setIsShowAdvanceSettings(true);
  };

  if (!recreationSettings) return <></>;

  return (
    <>
      <div className="gap-6 flex flex-col h-full p-5 overflow-y-auto overflow-x-hidden">
        <div className="flex justify-between items-center">
          <p>Configure Advance Recreation Settings</p>
          <CustomToggleSwitch
            isChecked={isShowAdvanceSettings}
            handleToggle={() => handleToggleAdvanceConfig()}
          />
        </div>
        {recreationSettings.recreationType ? (
          <div className="text-sm">
            <h5 className="text-common-white">Recreation Type</h5>
            <div className="mt-2.5 flex gap-4 text-common-white">
              {recreationTypeList.map((item, index) => {
                return (
                  <div key={index}>
                    <CustomButton
                      className={`px-4 py-1.5 rounded-md border border-solid ${
                        item.tag === recreationSettings.recreationType
                          ? "bg-primary-main border-primary-main"
                          : "bg-grey-800 text-grey-300 border-grey-700"
                      } tracking-wider text-center text-[13px] leading-5`}
                      name={item.displayName}
                      onClick={() =>
                        handleRecreationSettingChange({
                          recreationType: item.tag,
                        })
                      }
                    />
                  </div>
                );
              })}
            </div>
          </div>
        ) : null}
        {recreationSettings.recreationTypeStrength ? (
          <div className="flex flex-col justify-between">
            <div className=" flex flex-col gap-1.5">
              <h5 className="text-sm text-common-white">
                Recreation Type Strength
              </h5>
              <p className="text-xs text-grey-300 leading-[18px]">
                Recreation type provides additional control over how you’d like
                to recreate a photo.
              </p>
            </div>
            <div className="px-1 pt-1">
              <CustomSlider
                valueLabelDisplay="auto"
                valueLabelFormat={(value) => `${value * 100}%`}
                aria-label="pretto slider"
                value={recreationSettings.recreationTypeStrength}
                step={0.1}
                max={1}
                min={0}
                onChange={(event, newVal) =>
                  handleRecreationSettingChange({
                    recreationTypeStrength: newVal as number,
                  })
                }
              />
            </div>
          </div>
        ) : null}
        <div className="flex flex-col">
          <div className=" flex flex-col gap-1.5">
            <h5 className="text-sm text-common-white">Recreation Strength</h5>
            <p className="text-xs text-grey-300 leading-[18px]">
              Recreation Strength is a value that determines how much Witit’s AI
              will take the recreated photo into account.
            </p>
          </div>
          <div className="px-1 pt-2 ">
            {/* reverted */}
            <CustomSlider
              valueLabelFormat={(v) => (Math.round(v * 10) / 10) * 100 + "%"}
              marks={false}
              valueLabelDisplay="auto"
              aria-label="pretto slider"
              value={1 - recreationSettings.recreationStrength}
              step={0.1}
              max={1}
              min={0}
              onChange={(event, newVal) =>
                handleRecreationSettingChange({
                  recreationStrength:
                    Math.round((1 - (newVal as number)) * 10) / 10,
                })
              }
            />
          </div>
        </div>
      </div>
      {/* <div className="p-5 gap-7 flex flex-col h-full">
        <div className="text-sm">
          <h5 className=" text-common-white">Recreation Type</h5>
          <div className="mt-3 flex gap-4  text-common-white">
            <CustomButton
              className="px-3 py-2.5 rounded-md  bg-primary-main tracking-wider w-[120px] text-[13px] text-center "
              name="Copy Depth"
            />
            <CustomButton
              className="px-3 py-2.5 rounded-md bg-grey-800 text-grey-300 border border-solid border-grey-700 tracking-wider w-[120px] text-[13px] text-center"
              name="Copy Pose"
            />
            <CustomButton
              className="px-3 py-2.5 rounded-md bg-grey-800 text-grey-300 border border-solid border-grey-700 tracking-wider w-[120px] text-[13px] text-center"
              name="Copy Edges"
            />
          </div>
        </div>
        <div className="flex-grow text-common-white text-sm flex gap-10">
          <div className="flex flex-col justify-between w-[50%]">
            <div className="flex flex-col gap-2">
              <h5 className=" text-common-white">Recreation Type Strength</h5>
              <p className="text-xs text-grey-300 leading-[18px] max-w-[85%]">
                Recreation type provides additional control over how you’d like
                to recreate a photo.
              </p>
            </div>
            <div className="px-1">
              <CustomSlider
                valueLabelDisplay="auto"
                aria-label="pretto slider"
                defaultValue={0.5}
                step={0.1}
                max={1}
                min={0}
              />
            </div>
          </div>
          <div className="flex-grow flex flex-col justify-between w-[50%]">
            <div className="flex flex-col gap-2">
              <h5 className=" text-common-white">Recreation Strength</h5>
              <p className="text-xs text-grey-300 leading-[18px]">
                Recreation Strength is a value that determines how much Witit’s
                AI will take the recreated photo into account.
              </p>
            </div>
            <div className="px-1">
              <CustomSlider
                valueLabelDisplay="auto"
                aria-label="pretto slider"
                defaultValue={0.6}
                step={0.1}
                max={1}
                min={0}
              />
            </div>
          </div>
        </div>
      </div> */}
    </>
  );
};
