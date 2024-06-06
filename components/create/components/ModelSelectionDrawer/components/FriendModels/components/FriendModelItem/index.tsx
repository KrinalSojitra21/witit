import { FriendModel, Model } from "@/types/ai";
import { FriendInfo } from "./components/FriendInfo";
import { Collapse } from "@mui/material";
import { useEffect, useState } from "react";
import { ModelListItem } from "../../../ModelItem";
import { useGenerationContext } from "@/components/create/context/GenerationContext";

type Props = {
  item: FriendModel;
};

export const FriendModelItem = ({ item }: Props) => {
  const [isCollapse, setIsCollapse] = useState(false);

  const { selectedModel, setSelectedModel } = useGenerationContext();

  useEffect(() => {
    if (
      selectedModel &&
      item.models.filter((data) => data.modelId === selectedModel.modelId)
        .length > 0
    ) {
      setIsCollapse(true);
    }
  }, []);

  return (
    <div
      className={`mb-1.5 bg-grey-800 flex flex-col rounded-xl cursor-pointer transition-all ${
        isCollapse ? "p-3" : "px-3 pt-3"
      }`}
    >
      <div
        className="flex items-center justify-between pb-3"
        onClick={() => setIsCollapse(!isCollapse)}
      >
        <FriendInfo isOpen={isCollapse} item={item} />
      </div>
      <Collapse in={isCollapse} unmountOnExit timeout="auto">
        <div className="flex flex-col gap-2">
          {item.models.map((model, index) => (
            <ModelListItem
              key={index}
              isSelected={selectedModel?.modelId === model.modelId}
              isActive={true}
              handleSelectModel={() =>
                setSelectedModel({
                  modelId: model.modelId,
                  modelName: model.modelName,
                  classType: model.classType,
                })
              }
              modelName={model.modelName}
              className="border-grey-600 py-3"
            />
          ))}
        </div>
      </Collapse>
    </div>
  );
};
