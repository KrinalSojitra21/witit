import React, { useEffect, useState } from "react";
import { CircularProgress, Divider } from "@mui/material";
import NotificationIcon from "@/utils/icons/setting/NotificationIcon";

import { theme } from "@/theme";
import ApplicationItem from "./components/ApplicationItem";
import ModelItem from "./components/ModelItem";
import AiModelIcon from "@/utils/icons/setting/AiModelIcon";
import AiApplicationIcon from "@/utils/icons/setting/AiApplicationIcon";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import AIModelTraining from "@/components/aiModelTraining";
import { getAiModelApplications } from "@/api/ai/getAiModelApplications";
import { AiApplication } from "@/types/ai";
import InfiniteScroll from "react-infinite-scroll-component";
import { NoDataFound } from "@/components/shared/NoDataFound";
import { noModelFound } from "@/utils/images/setting";
import CustomButton from "@/components/shared/CustomButton";
import { useAuthContext } from "@/context/AuthContext";
import SettingBottomBar from "../Shared/SettingBottomBar";
import { CustomImagePreview } from "@/components/shared/CustomImagePreview";

type GetAiModelProps = {
  lastDocId?: string;
};

const docLimit = 10;

const AiModels = () => {
  const models = useSelector((state: RootState) => state.models);
  const user = useSelector((state: RootState) => state.user);
  const { sendNotification } = useAuthContext();

  const [isTrainModelDialogOpen, setIsTrainModelDialogOpen] = useState(false);
  const [aiApplications, setAiApplications] = useState<AiApplication[]>([]);
  const [hasMoreAiApplication, setHasMoreAiApplication] = useState(true);

  const handleGetAiModelApplications = async ({
    lastDocId,
  }: GetAiModelProps) => {
    if (!user) return;

    const res = await getAiModelApplications({
      user_id: user.userId,
      limit: docLimit,
      ...(lastDocId && { lastDocId }),
    });

    if (res.status === 200) {
      if (res.data.length < docLimit) {
        setHasMoreAiApplication(false);
      }

      if (res.data.length > 0) {
        if (lastDocId) {
          setAiApplications((preApplications) => {
            return [...preApplications, ...res.data];
          });
          return;
        }
        setAiApplications(res.data);
      }
      return;
    }

    sendNotification({ type: "ERROR", message: res.error });
  };

  useEffect(() => {
    handleGetAiModelApplications({});
  }, []);

  const fetchMoreAiApplications = async () => {
    const lastDocId = aiApplications[aiApplications.length - 1].applicationId;
    if (lastDocId) {
      handleGetAiModelApplications({
        lastDocId,
      });
    }
  };

  if (!user) <></>;

  return (
    <div className="h-full flex flex-col">
      <div className="flex lg:flex-row flex-col  h-full gap-5 ">
        {/* left side */}
        <div className="lg:w-[60%] bg-grey-900 rounded-lg gap-5   overflow-auto h-full flex flex-col py-6">
          <div className="flex flex-col px-6 gap-5">
            <div className="flex gap-5 items-center">
              <div className="text-success-main">
                <AiModelIcon />
              </div>
              <p className="text-sm tracking-wider">AI Models</p>
            </div>
            <Divider
              sx={{
                borderColor: theme.palette.grey[600],
              }}
            />
          </div>
          <div className=" overflow-auto flex flex-col gap-2">
            {models.userModelList.map((data, index) => {
              return (
                <div key={index} className="px-6">
                  <ModelItem model={data} />
                </div>
              );
            })}
          </div>
          {models.userModelList.length < 1 && (
            <div className="w-full h-full flex justify-center items-center">
              <NoDataFound
                image={
                  <div className="relative h-[90px] w-[90px]">
                    <CustomImagePreview image={noModelFound} />
                  </div>
                }
                title="No Models Found"
                description="Start train models & enjoy an open and accessible experience!"
              />
            </div>
          )}
        </div>

        {/* right side */}
        <div className="lg:w-[40%] flex flex-col justify-between h-full gap-5">
          <div className="flex-grow bg-grey-900 rounded-lg flex flex-col">
            <div className="flex flex-col px-6 pt-6 gap-5">
              <div className="flex gap-5 items-center">
                <div className="text-orange-main">
                  <AiApplicationIcon />
                </div>
                <p className="text-sm tracking-wider">Applications</p>
              </div>
              <Divider
                sx={{
                  borderColor: theme.palette.grey[600],
                }}
              />
            </div>
            <div
              id="aiApplicationsScrollableDiv"
              className="overflow-auto max-h-[560px] pt-2"
            >
              <InfiniteScroll
                dataLength={aiApplications.length}
                next={fetchMoreAiApplications}
                hasMore={hasMoreAiApplication}
                loader={
                  <div className="mt-4 text-common-black text-center w-full overflow-hidden">
                    <CircularProgress size={20} className="text-common-white" />
                  </div>
                }
                scrollableTarget="aiApplicationsScrollableDiv"
                className="overflow-auto flex flex-col gap-2  px-6 justify-around"
              >
                {aiApplications.map((application, index) => (
                  <ApplicationItem key={index} application={application} />
                ))}
              </InfiniteScroll>
            </div>
            {aiApplications.length < 1 && !hasMoreAiApplication && (
              <div className="w-full h-full flex justify-center items-center">
                <NoDataFound
                  image={
                    <div className="relative h-[90px] w-[90px]">
                      <CustomImagePreview image={noModelFound} />
                    </div>
                  }
                  title="No Applications Found"
                  description="There are no applications pending. Start train models."
                />
              </div>
            )}
          </div>
          <div className=" flex flex-col items-center gap-2">
            {user ? (
              <p>
                {user.allowedModels - models.userModelList.length} Models
                remaining Out Of {user.allowedModels} Free Models
              </p>
            ) : null}
            <CustomButton
              name="Train more models"
              onClick={() => setIsTrainModelDialogOpen(true)}
            />
          </div>
        </div>
        {isTrainModelDialogOpen ? (
          <AIModelTraining
            setIsTrainModelDialogOpen={setIsTrainModelDialogOpen}
          />
        ) : null}
      </div>
      <div className="mt-4">
        <SettingBottomBar />
      </div>
    </div>
  );
};

export default AiModels;
