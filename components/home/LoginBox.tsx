import VisibilityIcon from "@mui/icons-material/Visibility";
import CustomButton from "@/components/shared/CustomButton";
import { useState } from "react";
import { LoginToAccount } from "@/service/firebase/auth";
import CustomLink from "@/components/shared/CustomLink";
import { getUser } from "@/api/user/getUser";
import { useDispatch } from "react-redux";
import { useRouter } from "next/router";
import { Controller, useForm } from "react-hook-form";
import { Box, Stack, Typography } from "@mui/material";
import getFirebaseErrorMessage from "@/service/firebase/errorCode";
import LoginTag from "@/components/shared/LoginTag";
import { useAuthContext } from "@/context/AuthContext";
import CustomInputTextField from "../shared/CustomInputTextField";
import { setReduxUser } from "@/redux/slices/userSlice";
import VisibilityOffIcon from "@/utils/icons/shared/VisibilityOffIcon";
import { EmailIcon, LockIcon } from "@/utils/icons/shared";
import appConstant from "@/utils/constants/withoutHtml/appConstant";
import { VisibilityOff } from "@mui/icons-material";

type Props = {
  setActiveStep: React.Dispatch<React.SetStateAction<number>>;
};

export default function LoginBox({ setActiveStep }: Props) {
  let dispatch = useDispatch();
  const router = useRouter();

  const { sendNotification, lastVisitedPage } = useAuthContext();

  const [passwordVisibility, setPasswordVisibility] = useState(false);

  const {
    handleSubmit,
    control,
    setValue,
    reset,
    setError,
    clearErrors,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "onChange",
  });

  const onSubmit = async (data: any) => {
    sendNotification({ type: "LOADING" });

    // login to firebase
    const user: any = await LoginToAccount(data?.email, data?.password);
    if (user.status !== 200) {
      const errorMessage = await getFirebaseErrorMessage(user?.error);
      sendNotification({ type: "ERROR", message: errorMessage });
      return;
    }

    // send to verification screen if email not verified
    if (!user?.data?.emailVerified) {
      sendNotification({ type: "REMOVE" });
      setActiveStep(1);
      return;
    }

    const userId = user?.data?.uid;

    const userData = await getUser(userId);
    // if account not found then redirect to account-setup screen
    if (userData?.status === 404) {
      sendNotification({ type: "REMOVE" });
      router.push(appConstant.pageRoute.accountSetup);
      return;
    }

    // if user found redirect to setting screen
    if (user.status === 200) {
      dispatch(setReduxUser(userData.data));
      sendNotification({
        type: "SUCCESS",
        message: "You have Successfully Login",
      });
      if (
        lastVisitedPage === appConstant.pageRoute.login ||
        lastVisitedPage === null
      ) {
        router.push(appConstant.pageRoute.create);
      } else {
        router.push(lastVisitedPage);
      }
    } else {
      sendNotification({ type: "ERROR", message: userData?.error });
    }
  };
  const OnEndIconClick = () => {
    setPasswordVisibility(!passwordVisibility);
  };
  return (
    <div className=" sm:mx-auto sm:w-full sm:max-w-sm">
      <form onSubmit={handleSubmit(onSubmit)} className="" method="">
        <Stack className="gap-3.5">
          <LoginTag
            desWidth={85}
            title="Login to Witit"
            desc="Enter the following information to login to your account"
          />
          <Box>
            <Controller
              name="email"
              control={control}
              rules={{
                required: {
                  value: true,
                  message: "email required",
                },
                pattern: {
                  value: /\S+@\S+\.\S+/,
                  message: "Please enter a valid Email",
                },
              }}
              render={({ field }) => (
                <CustomInputTextField
                  {...field}
                  className=" bg-grey-A700 border-none"
                  error={errors?.email?.message}
                  autoComplete="off"
                  inputRef={field.ref}
                  placeholder="Enter Your Email"
                  StartIcon={<EmailIcon />}
                />
              )}
            />
          </Box>
          <Box>
            <Controller
              name="password"
              control={control}
              rules={{
                required: {
                  value: true,
                  message: "password required",
                },
                minLength: {
                  value: 8,
                  message: "password must be atleast 8 characters",
                },
              }}
              render={({ field }) => (
                <CustomInputTextField
                  {...field}
                  className=" bg-grey-A700 border-none"
                  type={!passwordVisibility ? "password" : "text"}
                  error={errors?.password?.message}
                  autoComplete="off"
                  inputRef={field.ref}
                  placeholder="Password"
                  StartIcon={<LockIcon />}
                  EndIcon={
                    !passwordVisibility ? <VisibilityIcon /> : <VisibilityOff />
                  }
                  EndIconHandleEvent={OnEndIconClick}
                  visibility={passwordVisibility}
                />
              )}
            />
          </Box>
        </Stack>

        <Box className="text-right pt-3 pb-10">
          <p
            onClick={() => setActiveStep(-2)}
            className=" text-error-main text-[0.9rem] cursor-pointer"
          >
            Forgot Password ?
          </p>
        </Box>
        <div className="">
          <CustomButton type="submit" name="Login" />
        </div>
        <p className="mt-6 text-center text-sm font-extralight text-grey-200">
          New Member?
          <span
            onClick={() => setActiveStep(0)}
            className="font-semibold ml-1 leading-6 text-primary-main hover:underline cursor-pointer	"
          >
            Sign up
          </span>
        </p>
      </form>
    </div>
  );
}
