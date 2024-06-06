import React, { useRef } from "react";
import WititLogoIcon from "@/utils/icons/shared/WititLogoIcon";
import OpenLockIcon from "@/utils/icons/shared/OpenLockIcon";
import CustomButton from "../../../shared/CustomButton";
import CloseIcon from "@/utils/icons/shared/CloseIcon";
import { useAuthContext } from "@/context/AuthContext";
import { Model } from "@/types/ai";
import { RootState } from "@/redux/store";
import { useSelector } from "react-redux";
import { FriendModelContainer } from "./components/FriendModels";
import { ModelListItem } from "./components/ModelItem";
import { useGenerationContext } from "../../context/GenerationContext";
import { it } from "node:test";

type Props = {
  handleCloseDrawer: () => void;
};

const ModelSelectionDrawer = ({ handleCloseDrawer }: Props) => {
  const ref = useRef<HTMLDivElement | null>(null);

  const { selectedModel, setSelectedModel } = useGenerationContext();

  const models = useSelector((state: RootState) => state.models);

  if (!selectedModel) return <></>;

  const handleScrollTop = () => {
    if (!ref.current) return;
    ref.current.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="relative flex flex-col h-full">
      <div className="p-5 bg-grey-900 border-b border-b-grey-500 flex justify-between items-center">
        <p className="text-[15px] tracking-wider">Select Model</p>
        <div
          className="text-grey-400 scale-150 cursor-pointer hover:text-common-white"
          onClick={() => handleCloseDrawer()}
        >
          <CloseIcon />
        </div>
      </div>
      <div className="flex flex-col relative flex-grow overflow-auto">
        <div
          ref={ref}
          className="relative flex flex-col flex-grow overflow-auto px-4"
        >
          <div className="sticky top-0 z-10 py-4 bg-secondary-main">
            {models.baseModelList.map((item, index) => (
              <ModelListItem
                key={index}
                modelName={item.modelName}
                isActive={item.isActive}
                isSelected={selectedModel.modelId === item.modelId}
                startIcon={<WititLogoIcon />}
                handleSelectModel={() =>
                  setSelectedModel({
                    modelId: item.modelId,
                    modelName: item.modelName,
                    classType: "Style",
                  })
                }
              />
            ))}
          </div>
          <div className="sticky top-[5.7rem] z-1 bg-secondary-main pb-3">
            <p className="bg-secondary-main pt-1">Your Model</p>
            <div className="mt-2 flex flex-col gap-2.5">
              {models.userModelList.map((item, index) => (
                <ModelListItem
                  key={index}
                  modelName={item.modelName}
                  isSelected={selectedModel.modelId === item.modelId}
                  isActive={item.isActive}
                  handleSelectModel={() => {
                    if (item.isActive) {
                      setSelectedModel({
                        modelId: item.modelId,
                        modelName: item.modelName,
                        classType: item.classType,
                      });
                    }
                  }}
                />
              ))}
            </div>
            <div className="mt-4 bg-gradient-to-r from-blue-main to-blue-light rounded-lg p-[1px]">
              <div className="bg-secondary-main rounded-lg">
                <CustomButton
                  name="Unlock More Models"
                  startIcon={
                    <div className="scale-75 text-primary-light">
                      <OpenLockIcon />
                    </div>
                  }
                  className="lg:px-10 px-5 py-3 text-sm bg-primary-main bg-opacity-[0.16] rounded-lg text-primary-light"
                />
              </div>
            </div>
          </div>
          <FriendModelContainer handleScrollTop={handleScrollTop} />
        </div>
        <div className="p-5">
          <CustomButton
            name="Done"
            className="py-2"
            onClick={() => handleCloseDrawer()}
          />
        </div>
      </div>
    </div>
  );
};

export default ModelSelectionDrawer;
