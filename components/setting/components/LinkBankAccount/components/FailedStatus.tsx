import { getBankSetupUrl } from "@/api/stripe/getBankSetupUrl";
import CustomButton from "@/components/shared/CustomButton";
import CustomLoadingButton from "@/components/shared/CustomLoadingButton";
import { useAuthContext } from "@/context/AuthContext";
import { RootState } from "@/redux/store";
import { theme } from "@/theme";
import DollerIcon from "@/utils/icons/setting/DollerIcon";
import CancelIcon from "@/utils/icons/setting/statusDialog/CancelIcon";
import { Divider } from "@mui/material";
import { useState } from "react";
import { useSelector } from "react-redux";

const FailedStatus = () => {
  const [isLoding, setIsLoading] = useState<boolean>(false);

  const user = useSelector((state: RootState) => state.user);
  const { sendNotification } = useAuthContext();

  const handleSubmit = async () => {
    setIsLoading(true);
    const url = window.location.protocol + "//" + window.location.host;
    if (!user) {
      return <></>;
    }
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
          <CancelIcon />
        </div>
        <p className="text-base tracking-wider text-center">
          Verification Pending
        </p>
        <p className="text-grey-100 text-sm tracking-wider font-light text-center w-[80%] pb-5">
          Sorry, we were unable to verify your bank account. please Try Again.
        </p>
      </div>
      <CustomLoadingButton
        loading={isLoding}
        name="Try Again"
        className=" py-3"
        handleEvent={() => {
          handleSubmit();
        }}
      />
    </div>
  );
};

export default FailedStatus;
