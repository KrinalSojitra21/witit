import CustomButton from "@/components/shared/CustomButton";
import { theme } from "@/theme";
import DollerIcon from "@/utils/icons/setting/DollerIcon";
import DocumentPending from "@/utils/icons/setting/DocumentPending";
import { Divider } from "@mui/material";
import React, { useState } from "react";
import { getBankSetupUrl } from "@/api/stripe/getBankSetupUrl";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { useRouter } from "next/router";
import { useAuthContext } from "@/context/AuthContext";
import CustomLoadingButton from "@/components/shared/CustomLoadingButton";

const DetailsPendingStatus = () => {
  const [isLoding, setIsLoading] = useState<boolean>(false);
  const user = useSelector((state: RootState) => state.user);
  const { sendNotification } = useAuthContext();

  if (!user) {
    return <></>;
  }
  const handleSubmit = async () => {
    setIsLoading(true);
    const url = window.location.protocol + "//" + window.location.host;

    const response = await getBankSetupUrl({
      returnUrl: url,
      refreshUrl: url,
      user_id: user.userId,
    });
    if (response.status === 200) {
      window.open(response.data.url, "_blank");
      setIsLoading(false);
      return;
    }
    setIsLoading(false);
    sendNotification({ type: "ERROR", message: response.error });
  };

  return (
    <div className="flex flex-col justify-between h-full items-center py-10 px-20 ">
      <div className=" flex flex-col gap-5 justify-center items-center flex-grow">
        <div className=" scale-110">
          {" "}
          <DocumentPending />
        </div>
        <p className="text-base tracking-wider text-center">Document Pending</p>
        <p className="text-grey-100 text-sm tracking-wider font-light text-center w-[80%] pb-5">
          To verify your account, we require additional information. Please
          provide them to proceed with the verification process.
        </p>
      </div>
      <CustomLoadingButton
        loading={isLoding}
        name="Continue"
        className=" py-3"
        handleEvent={() => {
          handleSubmit();
        }}
      />
    </div>
  );
};

export default DetailsPendingStatus;
