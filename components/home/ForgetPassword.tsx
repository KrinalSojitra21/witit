import CustomButton from "@/components/shared/CustomButton";
import { ResetAccountPassword } from "@/service/firebase/auth";
import { useDispatch } from "react-redux";
import { Controller, useForm } from "react-hook-form";
import { Box } from "@mui/material";
import getFirebaseErrorMessage from "@/service/firebase/errorCode";
import LoginTag from "@/components/shared/LoginTag";

import CustomInputTextField from "../shared/CustomInputTextField";
import { useAuthContext } from "@/context/AuthContext";
import { EmailIcon } from "@/utils/icons/shared";

type Props = {
  setActiveStep: React.Dispatch<React.SetStateAction<number>>;
};

export default function ForgetPasswordBox({ setActiveStep }: Props) {
  let dispatch = useDispatch();

  const { sendNotification } = useAuthContext();

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
    },
    mode: "onChange",
  });

  const onSubmit = async (data: any) => {
    sendNotification({ type: "LOADING" });
    const result = await ResetAccountPassword(data?.email);
    if (result.status === 200) {
      sendNotification({ type: "SUCCESS", message: "Check Your Email" });
      setActiveStep(-1);
    } else {
      const errorMessage = await getFirebaseErrorMessage(result?.error);
      sendNotification({ type: "ERROR", message: errorMessage });
    }
  };

  return (
    <div className=" sm:mx-auto sm:w-full sm:max-w-sm">
      <form onSubmit={handleSubmit(onSubmit)} className="" method="POST">
        <LoginTag
          desWidth={85}
          title="Forgot Password"
          desc="Enter the following information to change your account password"
        />
        <Box>
          <Controller
            name="email"
            control={control}
            rules={{
              required: {
                value: true,
                message: "Email required field",
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
        <div className="mt-10">
          <CustomButton type="submit" name="Send Reset Password Link" />
        </div>
        <p className="mt-6 text-center text-sm font-extralight text-grey-200">
          Don’t have an account?
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
