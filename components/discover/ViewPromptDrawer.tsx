import CreateIcon from "@/utils/icons/navbar/CreateIcon";
import AutomodeBlackIcon from "@/utils/icons/shared/AutomodeBlackIcon";
import CommentQuestionIcon from "@/utils/icons/shared/CommentQuestionIcon";
import CopyIcon from "@/utils/icons/shared/CopyIcon";
import DashIcon from "@/utils/icons/shared/DashIcon";
import React, { useEffect } from "react";
import CustomButton from "../shared/CustomButton";
import CustomDrawer from "../shared/drawer/CustomDrawer";
import { PromptDetail } from "@/types/post";
import { imageSizes } from "@/utils/constants/withoutHtml/ai";
import { IconButton } from "@mui/material";
import CloseIcon from "@/utils/icons/shared/CloseIcon";
import { useAuthContext } from "@/context/AuthContext";
import MomentsIcon from "@/utils/icons/profile/MomentsIcon";

type Props = {
  setPromptDetails: React.Dispatch<React.SetStateAction<PromptDetail | null>>;
  promptDetails: PromptDetail;
};
const ViewPromptDrawer = ({ setPromptDetails, promptDetails }: Props) => {
  const { discoverSearch, sendNotification } = useAuthContext();

  useEffect(() => {
    if (discoverSearch?.search && discoverSearch.search.length > 0) {
      setPromptDetails(null);
    }
  }, [discoverSearch]);

  const handleCopyPrompt = () => {
    navigator.clipboard.writeText(promptDetails.prompt);
    sendNotification({ type: "SUCCESS", message: "Prompt Coppied!!" });
  };
  return (
    <CustomDrawer
      position="RIGHT"
      isOpen={promptDetails ? true : false}
      onCancel={() => setPromptDetails(null)}
    >
      <div className="h-full flex flex-col">
        <div className="z-20 flex justify-between items-center px-[20px] border-b border-grey-500 py-2 w-full">
          <div className="flex items-center gap-3">
            <div className="  scale-75 text-common-white">
              <CommentQuestionIcon />
            </div>
            <div className="py-2 text-lg font-medium">Prompt</div>
          </div>
          <IconButton
            className=" scale-90 text-grey-400 p-0 m-0"
            onClick={() => {
              setPromptDetails(null);
            }}
          >
            <CloseIcon isBorderRounded={true} />
          </IconButton>
        </div>

        <div className=" h-full flex-grow overflow-hidden   flex flex-col  ">
          <div className=" flex-grow  overflow-auto flex flex-col px-5 py-7 gap-5">
            <div className=" flex flex-col gap-3">
              <div className=" flex justify-between gap-3">
                <p className=" tracking-wide">Prompts Used</p>
                <IconButton
                  className=" text-grey-200 p-0 m-0 cursor-pointer"
                  onClick={() => handleCopyPrompt()}
                >
                  <CopyIcon />
                </IconButton>
              </div>
              <div className=" min-h-[100px] rounded-lg bg-grey-800 border border-grey-700 p-3 text-sm text-common-white font-light tracking-wider">
                {promptDetails.prompt}
              </div>
            </div>
            <div className=" flex justify-between gap-3">
              <p className=" tracking-wide">Model Name</p>
              <p className=" tracking-wide">{promptDetails.modelName}</p>
            </div>
            <div className=" bg-grey-800 rounded-lg flex flex-col gap-5 p-3">
              {promptDetails.negativePrompt &&
              promptDetails.negativePrompt.length > 0 ? (
                <div className=" flex items-start gap-3">
                  <div className=" w-6 h-6 p-1 rounded-full flex justify-center items-center bg-primary-main">
                    <DashIcon />
                  </div>
                  <div className=" flex flex-col gap-3">
                    <p className=" tracking-wide">Negative Prompts</p>
                    <p className=" text-grey-400">
                      {promptDetails.negativePrompt.map(
                        (prompt, index) =>
                          prompt +
                          (index < promptDetails.negativePrompt.length - 1
                            ? ", "
                            : "")
                      )}
                    </p>
                  </div>
                </div>
              ) : null}
              {promptDetails.creationSettings ? (
                <div className=" flex items-start gap-3">
                  <div className=" w-6 h-6 p-1 rounded-full flex justify-center items-center bg-primary-main">
                    <CreateIcon />
                  </div>
                  <div className=" w-full flex flex-col gap-3">
                    <p className=" tracking-wide">Creation Settings</p>
                    <div className=" flex flex-col gap-2">
                      {/* when imagesize.tag is same as promptDetails.creationSettings.imageSize.toString() that tiem i want tp return imagesize.name
                        write a code */}

                      <ViewPromptModelItem
                        title="ImageSize"
                        value={
                          imageSizes.find(
                            (value) =>
                              value.tag ===
                              promptDetails.creationSettings.imageSize.toString()
                          )?.name || "-"
                        }
                      />
                      <ViewPromptModelItem
                        title="Aspect Ratio"
                        value={promptDetails.creationSettings.aspectRatio.toString()}
                      />
                      <ViewPromptModelItem
                        title="Definition"
                        value={promptDetails.creationSettings.definition.toString()}
                      />
                      <ViewPromptModelItem
                        title="Prompt Strength"
                        value={promptDetails.creationSettings.promptStrength.toString()}
                      />
                      <ViewPromptModelItem
                        title="PreserveFace Details"
                        value={
                          promptDetails.creationSettings.preserveFaceDetails
                            ? "true"
                            : "false"
                        }
                      />
                      <ViewPromptModelItem
                        title="RestoreFace"
                        value={
                          promptDetails.creationSettings.restoreFace
                            ? "true"
                            : "false"
                        }
                      />
                    </div>
                  </div>
                </div>
              ) : null}{" "}
              {promptDetails.recreationSettings ? (
                <div className=" flex items-start gap-3">
                  <div className="w-6 h-6 p-1  rounded-full flex justify-center items-center bg-primary-main">
                    <AutomodeBlackIcon />
                  </div>
                  <div className=" w-full flex flex-col gap-3">
                    <p className=" tracking-wide">Recreation Settings</p>
                    <ViewPromptModelItem
                      title="Prompt Strength"
                      value={promptDetails.recreationSettings.recreationStrength.toString()}
                    />
                    {promptDetails.recreationSettings.recreationType ? (
                      <ViewPromptModelItem
                        title="Recreation Type"
                        value={promptDetails.recreationSettings.recreationType.toString()}
                      />
                    ) : null}

                    {promptDetails.recreationSettings.recreationTypeStrength ? (
                      <ViewPromptModelItem
                        title="Recreation Type Strength"
                        value={promptDetails.recreationSettings.recreationTypeStrength.toString()}
                      />
                    ) : null}
                  </div>
                </div>
              ) : null}
              {promptDetails.hiResSettings ? (
                <div className=" flex items-start gap-3">
                  <div className="w-6 h-6 p-1  rounded-full flex justify-center items-center bg-primary-main">
                    <MomentsIcon />
                  </div>
                  <div className=" w-full flex flex-col gap-2">
                    <p className=" tracking-wide"> Power Upscale Settings</p>
                    <ViewPromptModelItem
                      title="Defination"
                      value={promptDetails.hiResSettings.definition.toString()}
                    />
                    {promptDetails.hiResSettings.similarityStrength ? (
                      <ViewPromptModelItem
                        title="Similarity Strength"
                        value={promptDetails.hiResSettings.similarityStrength.toString()}
                      />
                    ) : null}

                    {promptDetails.hiResSettings.increaseResolution ? (
                      <ViewPromptModelItem
                        title="Increase Resolution"
                        value={
                          promptDetails.hiResSettings.increaseResolution.toString() +
                          "x"
                        }
                      />
                    ) : null}
                  </div>
                </div>
              ) : null}
            </div>
          </div>

          {/* <div className="p-5">
            <CustomButton
              name="Apply Now"
              handleEvent={() => {
                setPromptDetails(null);
              }}
            />
          </div> */}
        </div>
      </div>
    </CustomDrawer>
  );
};

export default ViewPromptDrawer;

type ViewPromptModelItemProps = {
  title: string;
  value: string;
};

const ViewPromptModelItem = ({ title, value }: ViewPromptModelItemProps) => {
  return (
    <div className="  flex justify-between gap-3">
      <p className=" text-grey-400 tracking-wide">{title}</p>
      <p className=" text-grey-400 tracking-wide">{value}</p>
    </div>
  );
};
