import {
  AppBar,
  FormHelperText,
  Stack,
  Toolbar,
  Typography,
} from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import { CalendarMonthOutlined } from "@mui/icons-material";
import { LocalizationProvider, MobileDatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import CustomButton from "@/components/shared/CustomButton";
import React, { useEffect, useState } from "react";
import { createUser } from "@/api/user/createUser";
import { useDispatch } from "react-redux";
import { useRouter } from "next/router";
import { checkUsernameExist } from "@/api/public/checkUsernameExist";
import { uploadImageToStorage } from "@/service/firebase/uploadImage";
import { useAuthContext } from "@/context/AuthContext";
import ConfirmPasswordDialog from "@/components/accountSetup/ConfirmPasswordDialog";
import Loader from "@/components/shared/Loader";
import MainLogo from "@/components/shared/MainLogo";
import LoginTag from "@/components/shared/LoginTag";
import Loginterms from "@/components/shared/Loginterms";
import StepperArea from "@/components/shared/Stepper";
import { ChevronRightRounded } from "@mui/icons-material";
import CongratulationsDialog from "@/components/accountSetup/CongratulationsBox";
import Head from "next/head";
import { ImageInfo } from "@/types";
import CustomInputTextField from "@/components/shared/CustomInputTextField";
import { setReduxUser } from "@/redux/slices/userSlice";
import appConstant, {
  defaultImageConstant,
} from "@/utils/constants/withoutHtml/appConstant";
import { theme } from "@/theme";
import profilePlaceHolder from "@/utils/images/profilePlaceHolder.svg";
import Image from "next/image";
import InputCropSingleImage from "@/components/shared/cropImage/singleCropImage/InputCropSingleImage";

type SelectedImage = {
  imagePreview: string;
  file: File;
};

const AccountSetup = () => {
  let dispatch = useDispatch();
  const router = useRouter();

  const [isLoginSuccess, setIsLoginSuccess] = useState<boolean>(false);
  const [email, setEmail] = useState<string>("");
  const [isLoginRequired, setIsLoginRequired] = useState<boolean>(false);
  const [isLoading, setIsLoding] = useState<boolean>(true);
  const [finalProfileImage, setFinalProfileImage] = useState<{
    image: ImageInfo;
    index: number;
  }>(defaultImageConstant);
  const [selectedImage, setSelectedImage] = useState<SelectedImage | null>(
    null
  );
  const { firebaseUser, sendNotification, croppingImage, customDialogType } =
    useAuthContext();

  const {
    handleSubmit,
    control,
    setValue,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      image: "",
      email: "",
      userName: "",
      firstName: "",
      lastName: "",
      DOB: "",
    },
    mode: "onSubmit",
  });

  useEffect(() => {
    setTimeout(() => {
      setIsLoding(false);
    }, 1000);
  }, []);

  useEffect(() => {
    if (firebaseUser && firebaseUser.email) {
      console.log(firebaseUser.email);
      setValue("email", firebaseUser.email);
      setIsLoginRequired(false);
    } else {
      const queryParameters = new URLSearchParams(window.location.search);
      const email = queryParameters.get("email");
      if (email) {
        console.log(email);
        setValue("email", email);
        setEmail(email);
        setIsLoginRequired(true);
      } else {
        router.replace("/");
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [firebaseUser]);
  useEffect(() => {
    setFinalProfileImage(defaultImageConstant);
  }, []);

  const onSubmit = async (data: Record<string, any>) => {
    if (!firebaseUser) return;

    if (isLoginRequired) {
      sendNotification({ type: "ERROR", message: "Please Login First!" });
      return;
    }
    sendNotification({ type: "LOADING" });
    console.log("submitData", data);

    // check if username already exist
    const username = await checkUsernameExist(data?.userName);
    if (!username?.data?.isAvailable) {
      sendNotification({ type: "REMOVE" });
      setError("userName", {
        type: "custom",
        message: "username already exist",
      });
      return;
    }

    //modify birthdate
    if (data?.DOB !== "") {
      const birthDate = dayjs(data?.DOB).format("YYYY-MM-DD");
      data.DOB = birthDate;
      setValue("DOB", birthDate);
    } else {
      data.DOB = null;
    }

    // // upload image to firebase and get image url
    if (selectedImage) {
      const imageUrl = await uploadImageToStorage({
        folderName: "profile_picture_images",
        file: selectedImage.file,
        metadata: {
          userId: firebaseUser.uid,
        },
      });
      data.image = imageUrl;
      setValue("image", imageUrl);
    } else {
      setValue("image", "");
    }

    const addUser = await createUser({ data, user_id: firebaseUser?.uid });
    if (addUser.status === 200) {
      dispatch(setReduxUser(addUser.data));
      sendNotification({
        type: "SUCCESS",
        message: "You have Successfully SignUp",
      });
      setIsLoginSuccess(true);
      router.push(appConstant.pageRoute.create);
    } else {
      sendNotification({ type: "ERROR", message: addUser?.error });
      console.log(addUser);
    }
  };

  const sendToHome = () => {
    router.replace("/");
  };

  return (
    <>
      <Head>
        <title>Witit - Account Setup</title>
      </Head>
      {isLoading ? (
        <Loader loading={isLoading} />
      ) : (
        <div
          className={`${
            isLoginSuccess ? " overflow-hidden  pr-1" : "overflow-auto"
          } h-full`}
        >
          {isLoginRequired ? (
            <ConfirmPasswordDialog
              setIsLoginRequired={setIsLoginRequired}
              email={email}
            />
          ) : null}
          <AppBar
            className="relative lg:fixed py-3 md:py-6 lg:py-8 px-6 md:px-12 bg-secondary-main z-10"
            elevation={0}
          >
            <Toolbar className="p-0 flex justify-between m-auto w-full">
              <MainLogo onClick={() => sendToHome()} />
            </Toolbar>
          </AppBar>
          <div className="relative mt-4 lg:mt-0 flex min-w-[320px] lg:min-h-[750px] h-[100%] lg:flex-row flex-col lg:justify-center items-center bg-secondary-main md:px-0 px-6">
            <div className="flex flex-col lg:flex-row justify-center items-center w-full max-w-sm lg:max-w-[1180px] lg:px-12">
              <div className="  w-full lg:w-1/2 flex flex-col items-start gap-3 lg:gap-5">
                <StepperArea activeStep={2} completeStep={1} />
                <LoginTag
                  isLineRequired={false}
                  desWidth={100}
                  title="Enter account details"
                  desc="Enter the following information to create an account"
                />

                <div
                  className={`w-[252px] h-[252px] flex justify-center items-center rounded-2xl border-dashed  ${
                    finalProfileImage?.image.croppedImageSrc === ""
                      ? "border"
                      : ""
                  } border-grey-200 `}
                >
                  <Controller
                    name="image"
                    control={control}
                    render={({ field }) => (
                      <InputCropSingleImage
                        type="PROFILEIMG"
                        aspect="1/1"
                        finalImage={selectedImage}
                        setFinalImage={setSelectedImage}
                        {...field}
                        placeholder={{
                          placeholderImg: (
                            <div>
                              <Image
                                fill
                                src={profilePlaceHolder}
                                alt=""
                                className="relative w-[80px] rounded-md"
                              />
                            </div>
                          ),
                          placeholderTitle: (
                            <>
                              <p className="text-center md:pt-5 pt-3">
                                Drag profile pic here,
                              </p>
                              <p className="  text-center">
                                or{" "}
                                <span className="text-primary-main">
                                  browse
                                </span>
                              </p>
                            </>
                          ),
                        }}
                      />
                    )}
                  />
                </div>
              </div>

              <div className="w-[0.005rem] lg:block hidden h-[400px] bg-[hsla(0,0%,100%,0.25)] opacity-1"></div>
              <div className="relative flex w-full lg:w-1/2 lg:items-center h-fit lg:justify-end ">
                <div className={`mt-5 w-full max-w-sm overflow-auto h-fit`}>
                  <form
                    onSubmit={handleSubmit(onSubmit)}
                    method="POST"
                    className=" "
                  >
                    <div className="mt-5">
                      <div>
                        <Typography
                          component="h3"
                          className="text-common-white mb-4"
                        >
                          User name
                        </Typography>
                        <Controller
                          name="userName"
                          control={control}
                          rules={{
                            required: {
                              value: true,
                              message: "Username required",
                            },
                            minLength: {
                              value: 3,
                              message: "Username must be atleat 5 characters",
                            },
                          }}
                          render={({ field }) => (
                            <CustomInputTextField
                              className=" bg-grey-A700 border-none"
                              {...field}
                              error={errors?.userName?.message}
                              autoComplete="off"
                              inputRef={field.ref}
                              placeholder="Enter Your username"
                              // StartIcon={<PersonOutlineRounded />}
                            />
                          )}
                        />
                      </div>
                      <div className="mt-10">
                        <Typography
                          component="h3"
                          className="text-common-white mb-4"
                        >
                          Let’s get to know you
                        </Typography>
                        <Stack className="gap-4">
                          <div>
                            <Controller
                              name="firstName"
                              control={control}
                              rules={{
                                required: {
                                  value: true,
                                  message: "Firstname required",
                                },
                              }}
                              render={({ field }) => (
                                <CustomInputTextField
                                  className=" bg-grey-A700 border-none"
                                  {...field}
                                  error={errors?.firstName?.message}
                                  autoComplete="off"
                                  inputRef={field.ref}
                                  placeholder="Enter Your firstname"
                                  // StartIcon={<PermContactCalendarOutlined />}
                                />
                              )}
                            />
                          </div>
                          <div>
                            <Controller
                              name="lastName"
                              control={control}
                              rules={{
                                required: {
                                  value: true,
                                  message: "Lastname required",
                                },
                              }}
                              render={({ field }) => (
                                <CustomInputTextField
                                  className=" bg-grey-A700 border-none"
                                  {...field}
                                  error={errors?.lastName?.message}
                                  autoComplete="off"
                                  inputRef={field.ref}
                                  placeholder="Enter Your lastname"
                                  // StartIcon={<PermContactCalendarOutlined />}
                                />
                              )}
                            />
                          </div>
                        </Stack>
                      </div>
                      <div className="mt-10 ">
                        <Typography
                          component="h3"
                          className="text-common-white mb-4"
                        >
                          Birthdate
                        </Typography>
                        <Controller
                          name="DOB"
                          control={control}
                          render={({ field }) => (
                            <>
                              <Stack className="flex flex-row gap-4 items-center w-full  bg-grey-A700 rounded-md border-0 py-3 px-5 bg-inputTextBg [&>.MuiFormControl-root]:w-[100%]">
                                <LocalizationProvider
                                  dateAdapter={AdapterDayjs}
                                >
                                  <MobileDatePicker
                                    disableFuture
                                    maxDate={dayjs().subtract(18, "year")}
                                    {...field}
                                    inputRef={field.ref}
                                    autoFocus={false}
                                    sx={{
                                      "& .MuiInputBase-root": {
                                        color: theme.palette.common.white,
                                      },
                                      "& .MuiOutlinedInput-notchedOutline": {
                                        borderColor: "transparent !important",
                                        borderWidth: "0 !important",
                                      },
                                      "& .Mui-focused .MuiOutlinedInput-notchedOutline":
                                        {
                                          borderColor: "transparent !important",
                                          borderWidth: "0 !important",
                                        },
                                      "& .MuiInputBase-root .MuiInputBase-input":
                                        {
                                          fontSize: "0.875rem",
                                          padding: "4px 0 5px",
                                        },
                                      "& .MuiInputBase-root .MuiInputBase-input::placeholder":
                                        {
                                          padding: "10px",
                                          color: theme.palette.common.black,
                                        },
                                    }}
                                  />
                                </LocalizationProvider>{" "}
                                <CalendarMonthOutlined className="text-gery-100 text-2xl" />
                              </Stack>
                              {errors.DOB && (
                                <FormHelperText error focused>
                                  {errors.DOB.message}
                                </FormHelperText>
                              )}
                            </>
                          )}
                        />
                      </div>
                    </div>
                    <div className="mt-10 flex gap-2">
                      <CustomButton
                        type="submit"
                        name="Create an account"
                        endIcon={<ChevronRightRounded />}
                      />
                    </div>
                  </form>
                </div>
              </div>
            </div>
            <Loginterms style="lg:absolute lg:bottom-0 flex" page="SETUP" />
          </div>
          {isLoginSuccess ? <CongratulationsDialog /> : null}
        </div>
      )}
    </>
  );
};

export default AccountSetup;
