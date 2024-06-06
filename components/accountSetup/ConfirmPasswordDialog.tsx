import { Box, Dialog, Typography } from "@mui/material";
import { Controller, useForm, useWatch } from "react-hook-form";
import CustomInputTextField from "../shared/CustomInputTextField";
import CustomButton from "../shared/CustomButton";
import CustomLink from "../shared/CustomLink";
import { LockOutlined, Visibility, VisibilityOff } from "@mui/icons-material";
import { useEffect, useState } from "react";
import { LoginToAccount } from "@/service/firebase/auth";
import getFirebaseErrorMessage from "@/service/firebase/errorCode";
import { useDispatch } from "react-redux";
import { useAuthContext } from "@/context/AuthContext";
import CustomDialog from "../shared/dialog/CustomDialog";

type Props = {
  email: string;
  setIsLoginRequired: any;
};

export default function ConfirmPasswordDialog({
  email,
  setIsLoginRequired,
}: Props) {
  const [passwordVisibility, setPasswordVisibility] = useState(false);

  const { sendNotification } = useAuthContext();

  useEffect(() => {
    if (email) {
      setValue("email", email);
    }
  }, [email]);

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

  const onSubmit = async (data: Record<string, any>) => {
    const user: any = await LoginToAccount(data?.email, data?.password);

    if (user?.status === 200) {
      setIsLoginRequired(false);
    } else {
      const errorMessage = await getFirebaseErrorMessage(user?.error);
      sendNotification({ type: "ERROR", message: errorMessage });
    }
  };

  const OnPasswordVisibility = () => {
    setPasswordVisibility(!passwordVisibility);
  };
  return (
    <CustomDialog className="p-5 w-full max-w-[450px]">
      <Typography variant="h5">Confirm Your Identity</Typography>
      <Typography mt={2} variant="body2">
        Confirm Your Password For {""}
        <span className=" text-primary-main">{email}</span>
      </Typography>
      <form onSubmit={handleSubmit(onSubmit)} className="mt-4" method="POST">
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
              type={!passwordVisibility ? "password" : "text"}
              error={errors?.password?.message}
              autoComplete="off"
              // inputRef={field.ref}
              placeholder="Password"
              StartIcon={<LockOutlined />}
              EndIcon={!passwordVisibility ? <Visibility /> : <VisibilityOff />}
              EndIconHandleEvent={OnPasswordVisibility}
              visibility={passwordVisibility}
            />
          )}
        />
        <div className="mt-8 flex flex-col gap-2">
          <CustomButton type="submit" name="Confirm" />
          <CustomLink
            redirectTo="/"
            name="Cancel"
            style="m-auto text-common-white mt-2"
          />
        </div>
      </form>
    </CustomDialog>
  );
}
