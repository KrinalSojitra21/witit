import CustomButton from "@/components/shared/CustomButton";
import { theme } from "@/theme";
import DeleteIcon from "@/utils/icons/shared/DeleteIcon";
import { AvatarGroup, Avatar, IconButton } from "@mui/material";
import React, { useState } from "react";
import { UserModel } from "@/types/ai";
import dayjs from "dayjs";
import { CustomImagePreview } from "@/components/shared/CustomImagePreview";
import { EditModelDialog } from "./components/EditModelDialog";
import CustomDialog from "@/components/shared/dialog/CustomDialog";
import deleteAiModel from "@/api/ai/deleteAiModel";
import { useAuthContext } from "@/context/AuthContext";
import { RootState } from "@/redux/store";
import { useDispatch, useSelector } from "react-redux";
import { getBaseAndSelfModels } from "@/api/ai/getBaseAndSelfModels";
import { updateModels } from "@/redux/slices/modelSlice";
import CustomLoadingButton from "@/components/shared/CustomLoadingButton";
import ConfirmationDialog from "@/components/shared/ConfirmationDialog";
import { deleteModelBin } from "@/utils/images";

type Props = {
  model: UserModel;
};

const ModelItem = ({ model }: Props) => {
  const [isModelDialogOpen, setIsModelDialogOpen] = useState(false);
  const [isDeleteModel, setisDeleteModel] = useState(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const user = useSelector((state: RootState) => state.user);
  const models = useSelector((state: RootState) => state.models);
  const { sendNotification } = useAuthContext();

  const dispatch = useDispatch();
  const { userModelList } = models;

  const handleDeleteModel = async () => {
    setIsLoading(true);
    const response = await deleteAiModel({
      user_id: user?.userId,
      modelId: model.modelId,
    });
    if (response.status === 200 && response.data) {
      sendNotification({ type: "SUCCESS", message: response.data });
      const updatedList = userModelList.filter((item) => {
        return item.modelId !== model.modelId;
      });
      dispatch(
        updateModels({
          userModelList: updatedList,
        })
      );
      setIsLoading(false);
      setisDeleteModel(false);

      return;
    }
    sendNotification({ type: "ERROR", message: response.error });
  };

  return (
    <>
      <div
        className={`bg-grey-800 flex flex-col gap-1 p-5 rounded-lg border border-grey-800 hover:border-grey-700  ${
          model.isActive ? "cursor-pointer" : "opacity-60"
        } `}
        onClick={(e) => {
          if (model.isActive) {
            e.stopPropagation();
            setIsModelDialogOpen(true);
          }
        }}
      >
        <div className=" flex justify-between">
          <AvatarGroup
            total={model.selectedPhotos.length}
            max={4}
            sx={{
              border: "none",
              "& .MuiAvatar-root": {
                border: "2px solid" + theme.palette.grey[800],
                fontSize: "0.875rem",
                background: theme.palette.grey[500],
                width: "34px",
                height: "34px",
              },
            }}
            className=" w-fit"
          >
            {model.selectedPhotos.map((image, index) => {
              return (
                <Avatar key={index} className="bg-grey-600">
                  <CustomImagePreview image={image} />
                </Avatar>
              );
            })}
          </AvatarGroup>
          <div className="flex gap-3">
            <div className="w-fit bg-grey-700 text-grey-100 text-sm rounded-lg font-normal px-5 flex items-center justify-center tracking-wide">
              {model.generationSettings.allowGenerationOnModel
                ? "Public Model"
                : "Private Model"}
            </div>
            <IconButton
              onClick={(e) => {
                e.stopPropagation();
                setisDeleteModel(true);
              }}
              className="bg-grey-700 text-grey-200 rounded-lg border border-solid border-grey-600 hover:border-error-main hover:text-error-main"
            >
              <DeleteIcon />
            </IconButton>
          </div>
        </div>
        <div className=" flex flex-col gap-1">
          <p>{model.modelName}</p>
          <p className=" text-xs text-common-white text-opacity-50">
            Created On {dayjs(model.createdAt).format("DD MMM, YYYY")} |{" "}
            {model.counts.generatedImages} Photos Generated
          </p>
        </div>
      </div>
      {isModelDialogOpen ? (
        <EditModelDialog
          model={model}
          setIsModelDialogOpen={setIsModelDialogOpen}
        />
      ) : null}
      {isDeleteModel && (
        // <CustomDialog
        //   isOpen={isDeleteModel}
        //   onCancel={() => {
        //     setisDeleteModel(false);
        //   }}
        //   className="h-[300px] w-[300px] flex items-center justify-center"
        // >
        //   <CustomLoadingButton
        //     loading={isLoading}
        //     name="Delete Model"
        //     className="w-1/2"
        //     handleEvent={() => {
        //       handleDeleteModel();
        //     }}
        //   />
        // </CustomDialog>

        <ConfirmationDialog
          isOpen={isDeleteModel}
          image={deleteModelBin}
          onCancel={() => {
            setisDeleteModel(false);
          }}
          onConform={() => {
            handleDeleteModel();
          }}
          title={{
            titleMain: "Delete Model?",
            title1: "Sure you want to delete this Model from your account?",
            title2: "You will not be able to recover them again.",
            confirmButton: "Delete",
          }}
        />
      )}
    </>
  );
};

export default ModelItem;
