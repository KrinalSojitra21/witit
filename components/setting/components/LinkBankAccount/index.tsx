import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { useAuthContext } from "@/context/AuthContext";
import { getBankStatus } from "@/api/stripe/getBankStatus";
import NotLinkedStatus from "./components/NotLinkedStatus";
import LinkedStatus from "./components/LinkedStatus";
import DetailsPendingStatus from "./components/DetailsPendingStatus";
import PendingStatus from "./components/PendingStatus";
import { CircularProgress, Divider } from "@mui/material";
import DollerIcon from "@/utils/icons/setting/DollerIcon";
import { theme } from "@/theme";
import SettingBottomBar from "../Shared/SettingBottomBar";

const LinkBankAccount = () => {
  const [bankStatus, setBankStatus] = useState<string>("");

  const { sendNotification } = useAuthContext();
  const user = useSelector((state: RootState) => state.user);

  const fetchBankStatus = async () => {
    const response = await getBankStatus({ user_id: user?.userId });
    if (response.status === 200) {
      setBankStatus(response.data.status);

      return;
    }
    sendNotification({ type: "ERROR", message: response.error });
  };

  useEffect(() => {
    fetchBankStatus();
  }, []);

  return (
    <>
      <div className="h-full flex flex-col justify-between">
        <div className="lg:w-[50%] lg:max-w-[600px] flex flex-col py-6 bg-grey-900 rounded-xl  h-[550px]">
          <div className="flex flex-col px-6 gap-5">
            <div className="flex gap-5 items-center">
              <DollerIcon />
              <p className="text-sm tracking-wider">Bank Account</p>
            </div>
            <Divider
              sx={{
                borderColor: theme.palette.grey[500],
              }}
            />
          </div>
          {bankStatus === "ACCOUNT_NOT_LINKED" && <NotLinkedStatus />}
          {bankStatus === "ACCOUNT_LINKED" && <LinkedStatus />}
          {bankStatus === "ACCOUNT_DETAILS_PENDING" && <DetailsPendingStatus />}
          {bankStatus === "ACCOUNT_VERIFICATION_PENDING" && <PendingStatus />}
          {!bankStatus && (
            <div className="flex justify-center items-center h-full w-full">
              <div className="mt-4 text-common-black text-center w-full overflow-hidden">
                <CircularProgress size={20} className="text-common-white" />
              </div>
            </div>
          )}
        </div>
        <div className="mt-4">
          <SettingBottomBar />
        </div>
      </div>
    </>
  );
};

export default LinkBankAccount;
