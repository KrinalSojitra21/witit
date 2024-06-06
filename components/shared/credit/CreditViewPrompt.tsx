import { theme } from "@/theme";
import appConstant from "@/utils/constants/withoutHtml/appConstant";
import VerifiedIcon from "@/utils/icons/circle/VerifiedIcon";
import CreditIcon from "@/utils/icons/topbar/CreditIcon";
import { CircularProgress, Divider } from "@mui/material";
import React, { useEffect, useState } from "react";
import { CustomImagePreview } from "../CustomImagePreview";
import { UserBaseInfo } from "@/types/user";
import { RootState } from "@/redux/store";
import { useDispatch, useSelector } from "react-redux";
import { PromptDetail } from "@/types/post";
import { getPromptChargeOfPost } from "@/api/post/getPromptChargeOfPost";
import { useAuthContext } from "@/context/AuthContext";
import { getAccessToViewPromptOfPost } from "@/api/post/getAccessToViewPromptOfPost";
import CustomLoadingButton from "../CustomLoadingButton";
import { getCreditObjectToUpdateCreditModel } from "@/service/manageCredit/getCreditObjectToUpdateCreditModel";
import { updateSimilarDiscoverPostViewPrompt } from "@/redux/slices/discoverSimilarFeedSlice";
import CustomInsufficientCredit from "../CustomInsufficientCredit";

type Props = {
  postedBy: {
    userInfo: UserBaseInfo;
    postId: string;
  } | null;
  setPromptDetails: React.Dispatch<React.SetStateAction<PromptDetail | null>>;
  promptDetails: PromptDetail | null;
};

const CreditViewPrompt = ({
  postedBy,
  promptDetails,
  setPromptDetails,
}: Props) => {
  const user = useSelector((state: RootState) => state.user);
  const { sendNotification, setCustomDialogType } = useAuthContext();
  const dispatch = useDispatch();
  const [creditPerPrompt, setCreditPerPrompt] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isnotEnoughCredit, setIsnotEnoughCredit] = useState<boolean>(false);

  const getPromptCharge = async () => {
    if (!user) return;
    if (!postedBy) return;
    const res = await getPromptChargeOfPost({
      user_id: user.userId,
      postId: postedBy?.postId,
    });

    if (res.status === 200) {
      setCreditPerPrompt(res.data);
    } else {
      sendNotification({ type: "ERROR", message: res.error });
    }
  };

  const getAccessToView = async () => {
    setIsLoading(true);
    if (!user) return;
    if (!postedBy) return;
    const res = await getAccessToViewPromptOfPost({
      user_id: user.userId,
      postId: postedBy?.postId,
    });

    if (res.status === 200 && user.credit && creditPerPrompt) {
      const temp = +creditPerPrompt ?? 0;
      const tempData = getCreditObjectToUpdateCreditModel({
        creditObj: user.credit,
        credit: temp,
      });

      dispatch(
        updateSimilarDiscoverPostViewPrompt({ postId: postedBy?.postId })
      );

      setPromptDetails(res.data);
      return;
    }
    if (res.status === 403) {
      setIsnotEnoughCredit(true);
      setIsLoading(false);
      return;
    }
    setIsLoading(false);
    sendNotification({ type: "ERROR", message: res.error });
  };

  useEffect(() => {
    getPromptCharge();
  }, []);

  useEffect(() => {
    if (promptDetails) {
      setIsLoading(false);
    }
  }, [promptDetails]);
  const openGetCreditDialog = () => {
    setCustomDialogType("CREDITS-GETCREDITS");
  };

  const closeDialoag = () => {
    setIsnotEnoughCredit(false);
  };
  return (
    <div className="w-full h-full flex flex-col gap-5 items-center justify-start px-5">
      <div className="w-full flex flex-col items-center gap-2 ">
        <div className=" flex w-full h-11 justify-between items-center py-2">
          <p className=" ">Total Prompt Amount</p>
          {creditPerPrompt === null ? (
            <div className=" text-common-white overflow-hidden pr-1">
              <CircularProgress
                size={14}
                className="text-common-white p-0 m-0"
              />
            </div>
          ) : (
            <div className="flex items-center">
              <p
                className={`text-xl ${
                  isnotEnoughCredit ? "text-error-main" : "text-primary-main"
                }  font-semibold`}
              >
                {creditPerPrompt}
              </p>
              <div className=" scale-[0.6]">
                <CreditIcon />
              </div>
            </div>
          )}
        </div>
        <Divider
          sx={{
            borderStyle: "dashed",
            borderColor: theme.palette.grey[500],
            width: "100%",
          }}
        />
      </div>

      <CustomLoadingButton
        name="Send Credits"
        className={` text-sm font-normal w-[88%] ${
          isnotEnoughCredit && "bg-grey-800 text-common-white"
        }`}
        handleEvent={getAccessToView}
        disabled={isnotEnoughCredit}
        loading={isLoading}
      />
      {isnotEnoughCredit && (
        <div className="absolute  bottom-[2%] w-[80%]">
          <CustomInsufficientCredit
            onCancel={closeDialoag}
            handleEvent={openGetCreditDialog}
          />
        </div>
      )}
    </div>
  );
};

export default CreditViewPrompt;
