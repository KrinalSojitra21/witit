import { getBankDashboardUrl } from "@/api/stripe/getBankDashboardUrl";
import CustomButton from "@/components/shared/CustomButton";
import CustomLoadingButton from "@/components/shared/CustomLoadingButton";
import { useAuthContext } from "@/context/AuthContext";
import { RootState } from "@/redux/store";
import CheckCircleOverflowIcon from "@/utils/icons/setting/statusDialog/CheckCircleOverflowIcon";
import React, { useState } from "react";
import { useSelector } from "react-redux";

const LinkedStatus = () => {
  const [isLoding, setIsLoading] = useState<boolean>(false);

  const user = useSelector((state: RootState) => state.user);
  const { sendNotification } = useAuthContext();

  const handleSubmit = async () => {
    setIsLoading(true);
    const response = await getBankDashboardUrl({ user_id: user?.userId });
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
          <CheckCircleOverflowIcon />
        </div>
        <p className="text-base tracking-wider text-center">
          Bank account linked
        </p>
        <p className="text-grey-100 text-sm tracking-wider font-light text-center w-[80%] pb-5">
          Your bank account has been linked successfully. You can withdraw your
          credit from your linked bank account now.
        </p>
      </div>
      <CustomLoadingButton
        loading={isLoding}
        name="Update Bank Account"
        className=" py-3"
        handleEvent={() => {
          handleSubmit();
        }}
      />
      <CustomButton
        name="View Transaction History"
        className=" py-3 bg-grey-700 text-common-white mt-2"
        handleEvent={() => {}}
      />
    </div>
  );
};

export default LinkedStatus;
