import CustomButton from "@/components/shared/CustomButton";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";

import { Box, Dialog, Stack, Typography } from "@mui/material";
import { useState } from "react";

import { Controller, useForm, useWatch } from "react-hook-form";
import { signUpToFirebase } from "@/service/firebase/auth";
import { useDispatch } from "react-redux";
import getFirebaseErrorMessage from "@/service/firebase/errorCode";
import CustomCheckbox from "@/components/shared/CustomCheckbox";
import LoginTag from "@/components/shared/LoginTag";

import CustomInputTextField from "../shared/CustomInputTextField";
import { useAuthContext } from "@/context/AuthContext";
import { EmailIcon, LockIcon } from "@/utils/icons/shared";

type Props = {
  setActiveStep: React.Dispatch<React.SetStateAction<number>>;
};

export default function SignUpBox({ setActiveStep }: Props) {
  let dispatch = useDispatch();

  const { sendNotification } = useAuthContext();

  const [passwordVisibility, setPasswordVisibility] = useState(false);
  const [reTypePasswordvisibility, setReTypePasswordvisibility] =
    useState(false);

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
      confirmPassword: "",
    },
    mode: "onChange",
  });

  const onSubmit = async (data: Record<string, any>) => {
    sendNotification({ type: "LOADING" });

    const verifyEmail = await signUpToFirebase(data?.email, data?.password);
    if (verifyEmail.status === 200) {
      sendNotification({ type: "SUCCESS", message: "Check Your Email" });
      setActiveStep(1);
    } else {
      const errorMessage = await getFirebaseErrorMessage(verifyEmail?.error);
      sendNotification({ type: "ERROR", message: errorMessage });
    }
  };

  const email = useWatch({
    control,
    name: "email",
  });

  const OnPasswordVisibilitychange = () => {
    setPasswordVisibility(!passwordVisibility);
  };

  const setResetPassword = () => {
    setReTypePasswordvisibility(!reTypePasswordvisibility);
  };
  return (
    <>
      <div className=" sm:mx-auto sm:w-full sm:max-w-sm min-px-[10px] ">
        <div className="w-fit">
          <form onSubmit={handleSubmit(onSubmit)} className="" method="POST">
            <Stack className="gap-3.5">
              <LoginTag
                desWidth={85}
                title="Create an account"
                desc="Enter the following information to login to your account"
              />
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
                        passwordVisibility ? (
                          <VisibilityIcon />
                        ) : (
                          <VisibilityOffIcon />
                        )
                      }
                      EndIconHandleEvent={OnPasswordVisibilitychange}
                      visibility={passwordVisibility}
                    />
                  )}
                />
              </Box>
              <Box>
                <Controller
                  name="confirmPassword"
                  control={control}
                  rules={{
                    required: {
                      value: true,
                      message: "confirm password required",
                    },
                    validate: (value, { password }) =>
                      value === password || "Passwords do not match",
                  }}
                  render={({ field }) => (
                    <CustomInputTextField
                      {...field}
                      className=" bg-grey-A700 border-none"
                      type={!reTypePasswordvisibility ? "password" : "text"}
                      error={errors?.confirmPassword?.message}
                      autoComplete="off"
                      inputRef={field.ref}
                      placeholder="Re-type Password"
                      StartIcon={<LockIcon />}
                      EndIcon={
                        reTypePasswordvisibility ? (
                          <VisibilityIcon />
                        ) : (
                          <VisibilityOffIcon />
                        )
                      }
                      EndIconHandleEvent={setResetPassword}
                      visibility={reTypePasswordvisibility}
                    />
                  )}
                />
              </Box>
            </Stack>
            <div className="flex mt-10">
              <CustomButton type="submit" name="Sign Up" />
            </div>
          </form>
        </div>
        <p className="m-6 text-center text-sm font-extralight text-grey-200">
          Already have an account?
          <span
            onClick={() => setActiveStep(-1)}
            className="font-semibold ml-1 leading-6 text-primary-main hover:underline cursor-pointer"
          >
            Login
          </span>
        </p>
      </div>
    </>
  );
}
