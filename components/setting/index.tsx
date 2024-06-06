import { useEffect, useState } from "react";
import Account from "./components/Account";
import AiModels from "./components/AiModels";
import BlockProfiles from "./components/BlockProfiles";
import LinkBankAccount from "./components/LinkBankAccount";
import NotificationAndNSFW from "./components/NotificationAndNSFW";
import { RootState } from "@/redux/store";
import { useDispatch, useSelector } from "react-redux";
import { NoDataFound } from "../shared/NoDataFound";
import Lottie from "lottie-react";
import { failureLottie, verificationSuccessLottie } from "@/utils/lottie";
import CustomDialog from "../shared/dialog/CustomDialog";
import { useRouter } from "next/router";
import paymentStatusSlice, {
  PaymentMethodStatus,
  setPaymentStatus,
} from "@/redux/slices/paymentStatusSlice";

const tabs = [
  {
    name: "Account",
    type: "ACCOUNT",
  },
  {
    name: "AI Models",
    type: "AI_MODELS",
  },
  {
    name: "Block Profiles",
    type: "BLOCK_PROFILES",
  },
  {
    name: "Bank Account",
    type: "BANK_ACCOUNT",
  },
  {
    name: "Notification & NSFW",
    type: "NOTIFICATION_AND_NSFW",
  },
];

const Settings = () => {
  const [currentTab, setCurrentTab] = useState("ACCOUNT");
  const dispatch = useDispatch();
  const status = useSelector((state: RootState) => state.payments);
  let user = useSelector((state: RootState) => state.user);
  const router = useRouter();
  const url = window.location.protocol + "//" + window.location.host;
  const { success } = router.query;
  useEffect(() => {
    if (success === "true" || success === "false") {
      dispatch(setPaymentStatus(success));
      router.push(url + "/setting");
    }
  }, [success]);
  console.log(status);
  if (!user) return <></>;

  return (
    <>
      <div className=" relative w-full h-full flex flex-col  gap-5">
        <div className="flex lg:gap-16 gap-10 2xl:px-10 px-5">
          {tabs.map((tab, index) => {
            return (
              <div
                key={index}
                className=" flex flex-col w-fit gap-3 cursor-pointer"
                onClick={() => {
                  setCurrentTab(tab.type);
                }}
              >
                <div
                  className={`w-[100%] h-[5px] bg-primary-main  ${
                    currentTab === tab.type ? "" : " opacity-0"
                  } rounded-b-md`}
                />
                <p
                  className={`text-sm tracking-wider ${
                    currentTab === tab.type
                      ? ""
                      : " opacity-30 hover:opacity-100 transition-all duration-300"
                  } `}
                >
                  {tab.name}
                </p>
              </div>
            );
          })}
        </div>
        <div className=" flex-grow overflow-auto px-5  ">
          <div className="h-full">
            {currentTab === "ACCOUNT" ? (
              <Account user={user} setCurrentTab={setCurrentTab} />
            ) : currentTab === "AI_MODELS" ? (
              <AiModels />
            ) : currentTab === "BLOCK_PROFILES" ? (
              <BlockProfiles />
            ) : currentTab === "BANK_ACCOUNT" ? (
              <LinkBankAccount />
            ) : (
              <NotificationAndNSFW />
            )}
          </div>
        </div>

        {status?.paymentStatus && (
          <CustomDialog
            isOpen={status.paymentStatus ? true : false}
            className="flex items-center justify-center h-[400px] w-[400px]"
          >
            {" "}
            {status?.paymentStatus === "true" && (
              <div>
                <NoDataFound
                  image={
                    <div className="w-[160px] p-5">
                      <Lottie animationData={verificationSuccessLottie} />
                    </div>
                  }
                  buttonName="Done"
                  title="Payment Successful"
                  description="Your transaction has successfully been completed. Credit has been added to your account."
                  descriptionStyle="text-xs w-full"
                  buttonStyle="bg-primary-main mt-3"
                  titleStyle=" text-primary-main mb-2"
                  handleEvent={() => {
                    dispatch(setPaymentStatus(""));
                  }}
                />
              </div>
            )}
            {status?.paymentStatus === "false" && (
              <div>
                <NoDataFound
                  image={
                    <div className="w-[160px] p-7">
                      <Lottie animationData={failureLottie} />
                    </div>
                  }
                  buttonName="Try Again"
                  title="Ohh No !!"
                  description="We aren’t able to process your payment.
              Please try again !!"
                  buttonStyle="bg-error-main  mt-3"
                  titleStyle=" text-error-main mb-2"
                  handleEvent={() => {
                    dispatch(setPaymentStatus(""));
                  }}
                />
              </div>
            )}
          </CustomDialog>
        )}
      </div>
    </>
  );
};

export default Settings;
