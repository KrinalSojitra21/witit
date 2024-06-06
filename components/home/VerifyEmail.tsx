import { Box } from "@mui/material";
import CustomButton from "@/components/shared/CustomButton";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useAuthContext } from "@/context/AuthContext";
import { sendEmail } from "@/service/firebase/auth";
import getFirebaseErrorMessage from "@/service/firebase/errorCode";
import LoginTag from "@/components/shared/LoginTag";
import { ExternalLinkIcon, RefreshIcon } from "@/utils/icons/shared";

export default function VerifyEmail() {
  let dispatch = useDispatch();
  const [isEmailSend, setIsEmailSend] = useState<boolean>(false);

  const { firebaseUser } = useAuthContext();

  const { sendNotification } = useAuthContext();

  useEffect(() => {
    if (isEmailSend) {
      setTimeout(() => {
        setIsEmailSend(false);
      }, 60000);
    }
  }, [isEmailSend]);

  const resendEmail = async () => {
    if (!firebaseUser) return;
    if (!isEmailSend) {
      sendNotification({ type: "LOADING" });
      const result = await sendEmail(firebaseUser);
      if (result.status === 200) {
        setIsEmailSend(true);
        sendNotification({ type: "SUCCESS", message: "Check Your email" });
      } else {
        const errorMessage = await getFirebaseErrorMessage(result?.error);
        sendNotification({ type: "ERROR", message: errorMessage });
      }
    }
  };

  return (
    <div className=" sm:mx-auto sm:w-full sm:max-w-sm">
      <LoginTag
        desWidth={85}
        title="Verify your Email"
        desc=" Please check your inbox for a verification link to confirm your identity."
      />
      <Box className=" p-5 mt-5 rounded-xl bg-grey-A700">
        <div className=" flex flex-col gap-1">
          <p className=" text-sm">Verification mail sent to</p>
          <p className="text-primary-main  mb-5 text-sm">
            {firebaseUser?.email}
          </p>
        </div>
        <a
          href={isEmailSend ? "" : "https://mail.google.com"}
          target="_blank"
          rel="noopener noreferrer"
        >
          <CustomButton
            endIcon={<ExternalLinkIcon />}
            className=" py-2"
            type="button"
            name="Open Gmail"
            disabled={isEmailSend}
          />
        </a>
      </Box>
      <Box className="mt-2 py-3 sm:px-5 ">
        <div
          onClick={() => resendEmail()}
          className={`m-auto flex w-fit flex-row items-center gap-2 text-grey-100 justify-center ${
            !isEmailSend ? "cursor-pointer" : "cursor-not-allowed"
          }`}
        >
          <RefreshIcon />
          <p className=" font-extralight text-[0.85rem]">Send a new Link</p>
        </div>
        {/* <p className="discription  font-extralight text-[1.5rem]">|</p>
        <div className="flex items-center gap-[0.4rem] leading-none">
          <CloseIcon />
          <p className="discription font-extralight text-[0.85rem]">
            Use different mail
          </p>
        </div> */}
      </Box>
    </div>
  );
}
