/* eslint-disable @next/next/no-img-element */
/* eslint-disable react-hooks/exhaustive-deps */
import { getProfileDynamicLink } from "@/api/public/getProfileDynamicLink";
import ContactUs from "@/components/footerDialogs/ContactUs";
import ContentPolicy from "@/components/footerDialogs/ContentPolicy";
import PrivacyPolicy from "@/components/footerDialogs/PrivacyPolicy";
import TermsOfServices from "@/components/footerDialogs/TermsOfServices";
import ForgetPasswordBox from "@/components/home/ForgetPassword";
import { ImageSliderAnimationShowBox } from "@/components/home/ImageSliderAnimationShowBox";
import LoginBox from "@/components/home/LoginBox";
import SignUpBox from "@/components/home/SignUp";
import VerifyEmail from "@/components/home/VerifyEmail";
import CustomDialog from "@/components/shared/dialog/CustomDialog";
import Loader from "@/components/shared/Loader";
import Loginterms from "@/components/shared/Loginterms";
import MainLogo from "@/components/shared/MainLogo";
import StepperArea from "@/components/shared/Stepper";
import { useAuthContext } from "@/context/AuthContext";
import { setReduxUser } from "@/redux/slices/userSlice";
import { RootState } from "@/redux/store";
import { AppBar, Toolbar } from "@mui/material";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { isMobile } from "react-device-detect";
import { getUser } from "@/api/user/getUser";
import appConstant from "@/utils/constants/withoutHtml/appConstant";

export default function LoginBg() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { customDialogType, setCustomDialogType } = useAuthContext();
  const reduxUser = useSelector((state: RootState) => state.user);

  const { firebaseUser, sendNotification } = useAuthContext();

  const [activeStep, setActiveStep] = useState(-1);
  const [isLoading, setIsLoading] = useState(true);

  const sendToHome = () => {
    router.reload();
  };

  useEffect(() => {
    if (reduxUser) {
      router.push(appConstant.pageRoute.create);
    }
  }, []);

  const redirectUserToDestinetion = async () => {
    console.log(firebaseUser);
    // send to verification screen if email not verified
    if (!firebaseUser?.emailVerified) {
      setActiveStep(1);
      return;
    }

    const userId = firebaseUser?.uid;

    const userData = await getUser(userId);
    // if account not found then redirect to account-setup screen
    if (userData?.status === 404) {
      router.push(appConstant.pageRoute.accountSetup);
      return;
    }

    // if user found redirect to setting screen
    if (userData.status === 200 && userData.data) {
      dispatch(setReduxUser(userData.data));
      router.push(appConstant.pageRoute.create);
      return;
    }

    sendNotification({ type: "ERROR", message: userData?.error });
    setIsLoading(false);
  };

  useEffect(() => {
    handleUserRequest();
  }, []);

  const handleUserRequest = async () => {
    if (isMobile) {
      const userName = router.asPath.slice(1, router.asPath.length);

      if (userName.length > 0) {
        const dynamicLinkData = await getProfileDynamicLink(userName);

        if (dynamicLinkData.status === 200) {
          const link = dynamicLinkData.data.dynamicProfileLink;

          if (link) {
            router.push(link);
            console.log("redirecterd to:- ", link);
            return;
          }
        }
      }
    }

    if (firebaseUser) {
      redirectUserToDestinetion();
    } else {
      setTimeout(() => {
        setIsLoading(false);
      }, 1000);
    }
  };

  const [height, setHeight] = useState(0);
  const carousel = useRef<any>();
  useEffect(() => {
    if (carousel?.current) {
      setHeight(carousel.current.clientHeight);
      //  setWidth(carousel.current.scrollWidth - carousel.current.offsetWeidth);
    }
  }, []);
  //animation

  document.documentElement.style.setProperty("--height", `${height}`);

  if (isLoading) {
    return <Loader loading={isLoading} />;
  }

  return (
    <>
      <Head>
        <title>Witit</title>
      </Head>
      <div className="relative flex w-full h-full min-h-fit min-w-[320px] lg:flex-row flex-col lg:justify-center justify-between items-center bg-secondary-main md:px-0 px-5 overflow-hidden">
        <div className="lg:w-[50vw] w-full z-20 bg-secondary-main relative h-full justify-center lg:h-full flex flex-col lg:justify-center items-center ">
          <AppBar
            className="relative py-3 md:py-6 lg:py-8 md:px-12 bg-secondary-main z-10"
            elevation={0}
          >
            <Toolbar className="p-0 flex justify-between m-auto w-full">
              <MainLogo onClick={() => sendToHome()} />
            </Toolbar>
          </AppBar>
          <div className="mx-auto w-full max-w-sm flex-grow flex flex-col justify-center">
            {activeStep === 0 ? (
              <>
                <StepperArea
                  activeStep={activeStep}
                  completeStep={activeStep}
                />
                <div className="mt-8">
                  <SignUpBox setActiveStep={setActiveStep} />
                </div>
              </>
            ) : activeStep === 1 ? (
              <>
                <StepperArea
                  activeStep={activeStep}
                  completeStep={activeStep}
                />
                <div className="mt-8">
                  <VerifyEmail />
                </div>
              </>
            ) : activeStep === -2 ? (
              <ForgetPasswordBox setActiveStep={setActiveStep} />
            ) : (
              <LoginBox setActiveStep={setActiveStep} />
            )}
          </div>
          <Loginterms page="LOGIN" style="" />
        </div>
        <ImageSliderAnimationShowBox />
        <CustomDialog>
          {customDialogType === "TERMSOFSERVICE" ? (
            <TermsOfServices
              onCancel={() => {
                setCustomDialogType(null);
              }}
            />
          ) : customDialogType === "PRIVACYPOLICY" ? (
            <PrivacyPolicy
              onCancel={() => {
                setCustomDialogType(null);
              }}
            />
          ) : customDialogType === "CONTENTPOLICY" ? (
            <ContentPolicy
              onCancel={() => {
                setCustomDialogType(null);
              }}
            />
          ) : customDialogType === "CONTACTUS" ? (
            <ContactUs
              onCancel={() => {
                setCustomDialogType(null);
              }}
            />
          ) : null}
        </CustomDialog>
      </div>
    </>
  );
}
