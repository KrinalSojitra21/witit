import CustomButton from "@/components/shared/CustomButton";
import BankIcon from "@/utils/icons/setting/BankIcon";
import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { useAuthContext } from "@/context/AuthContext";
import { getBankSetupUrl } from "@/api/stripe/getBankSetupUrl";

const NotLinkedStatus = () => {
  const user = useSelector((state: RootState) => state.user);
  const { sendNotification } = useAuthContext();
  

  if (!user) {
    return <></>;
  }
  const handleSubmit = async () => {
    const url = window.location.protocol + "//" + window.location.host;

    const response = await getBankSetupUrl({
      returnUrl: url,
      refreshUrl: url,
      user_id: user.userId,
    });
    if (response.status === 200) {
      window.open(response.data.url, '_blank');
      return;
    }
    sendNotification({ type: "ERROR", message: response.error });
  };

  return (


      <div className="flex flex-col justify-between h-full items-center py-10 px-20 ">
        <div className=" flex flex-col gap-5 justify-center items-center flex-grow">
          <div className=" scale-110">
            {" "}
            <BankIcon />
          </div>
          <p className="text-base tracking-wider text-center">
            Bank account not linked
          </p>
          <p className="text-grey-100 text-sm tracking-wider font-light text-center w-[80%] pb-5">
            Connect bank account to receive payments from witit.
          </p>
        </div>
        <CustomButton
          name="Link Bank Account"
          className=" py-3"
          handleEvent={() => {
            handleSubmit();
          }}
        />
      </div>
  );
};

export default NotLinkedStatus;
