import React, {
  ChangeEvent,
  Dispatch,
  SetStateAction,
  useEffect,
  useState,
} from "react";
import { theme } from "@/theme";
import CustomInputTextField from "@/components/shared/CustomInputTextField";
import InstagramIcon from "@/utils/icons/setting/socialMedia/InstagramIcon";
import TwitterIcon from "@/utils/icons/setting/socialMedia/TwitterIcon";
import TiktokIcon from "@/utils/icons/setting/socialMedia/TiktokIcon";
import TwitchIcon from "@/utils/icons/setting/socialMedia/TwitchIcon";
import YouTubeIcon from "@/utils/icons/setting/socialMedia/YouTubeIcon";
import WebsiteIcon from "@/utils/icons/setting/socialMedia/WebsiteIcon";
import EditProfileIcon from "@/utils/icons/setting/EditProfileIcon";
import LinkIcon from "@/utils/icons/setting/LinkIcon";
import CustomToggleSwitch from "@/components/shared/CustomToggleSwitch";
import { CircularProgress, Divider } from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import { ReduxUser } from "@/types/user";
import ImagePlaceHolderGalleryIcon from "@/utils/icons/createPost/ImagePlaceHolderGalleryIcon";
import { getImageObject } from "@/service/shared/getImageObject";
import CustomLoadingButton from "@/components/shared/CustomLoadingButton";
import { convertEmptyToNull } from "@/service/shared/convertEmptyFieldToNull";
import { uploadImageToStorage } from "@/service/firebase/uploadImage";
import { updateUser } from "@/api/user/updateUser";
import { useAuthContext } from "@/context/AuthContext";
import { useDispatch } from "react-redux";
import InputCropSingleImage from "@/components/shared/cropImage/singleCropImage/InputCropSingleImage";
import CreditSettings from "./components/CreditSettings";
import SettingBottomBar from "../Shared/SettingBottomBar";

type Props = {
  user: ReduxUser;
  setCurrentTab: Dispatch<SetStateAction<string>>;
};

const Account = ({ user, setCurrentTab }: Props) => {
  const dispatch = useDispatch();

  const [profileImage, setProfileImage] = useState<{
    imagePreview: string;
    file: File;
  } | null>(null);
  const [isProfileSubmitting, setIsProfileSubmitting] = useState(false);

  const { sendNotification } = useAuthContext();

  const defaultValues: Partial<ReduxUser> = {
    generalInfo: {
      firstName: user.generalInfo.firstName,
      lastName: user.generalInfo.lastName,
      profileImage: user.generalInfo.profileImage,
      bio: user.generalInfo.bio ?? "",
    },
    shouldShowRepost: user.shouldShowRepost,
    userName: user.userName,
    linkedAccounts: {
      instagram: user.linkedAccounts.instagram ?? "",
      twitter: user.linkedAccounts.twitter ?? "",
      youtube: user.linkedAccounts.youtube ?? "",
      twitch: user.linkedAccounts.twitch ?? "",
      tiktok: user.linkedAccounts.tiktok ?? "",
      onlyfans: user.linkedAccounts.onlyfans ?? "",
    },
    generationSettings: {
      allowGenerationOnPost: user.generationSettings?.allowGenerationOnPost,
      creditPerDerivative: user.generationSettings?.creditPerDerivative ?? 0,
      creditPerMessage: user.generationSettings?.creditPerMessage ?? 0,
    },
  };

  const {
    control,
    setValue,
    handleSubmit,
    formState: { errors, isSubmitting, isDirty, isValid },
  } = useForm<Partial<ReduxUser>>({
    defaultValues,
    mode: "onSubmit",
  });

  const handleSetProfileImage = async () => {
    if (!user.generalInfo.profileImage) return;

    const { file } = await getImageObject(user.generalInfo.profileImage);

    setProfileImage({ imagePreview: user.generalInfo.profileImage, file });
    setValue("generalInfo.profileImage", user.generalInfo.profileImage);
  };

  useEffect(() => {
    handleSetProfileImage();
    () => {
      handleSetProfileImage();
    };
  }, [user]);

  const onSubmit = async (data: Partial<ReduxUser>) => {
    setIsProfileSubmitting(true);
    if (user.userType === "GENERAL") {
      delete data.generationSettings;
    }
    data = convertEmptyToNull(data);

    // profileImage && data.generalInfo?.profileImage;

    if (
      profileImage &&
      data.generalInfo &&
      profileImage?.imagePreview.includes("data:")
    ) {
      const image = await uploadImageToStorage({
        folderName: "profile_picture_images",
        file: profileImage.file,
        metadata: {
          userId: user.userId,
        },
      });
      data.generalInfo.profileImage = image;
    }

    const result = await updateUser({
      user_id: user.userId,
      data,
    });

    if (result.status === 200) {
      sendNotification({
        type: "SUCCESS",
        message: "Data Update Successfuly ",
      });

      setProfileImage(null);
      setIsProfileSubmitting(false);
      return;
    }

    setIsProfileSubmitting(false);
    sendNotification({ type: "ERROR", message: result.error });
  };

  return (
    <>
      <form className="flex flex-col" onSubmit={(e) => e.preventDefault()}>
        {/* left side */}
        <div className="flex flex-col gap-5  flex-grow overflow-auto h-full">
          <div className="flex gap-4 h-full">
            <div className="lg:w-[65%] lg:max-w-[1050px] xl:max-w-full bg-grey-900 p-[24px] rounded-xl flex flex-col gap-5 h-full">
              <div className="flex flex-col gap-5">
                <div className="flex gap-5 items-center">
                  <EditProfileIcon />
                  <p className="text-sm tracking-wider">Edit Profile</p>
                </div>
                <Divider
                  sx={{
                    borderColor: theme.palette.grey[500],
                  }}
                />
              </div>
              <div className=" flex gap-10 overflow-auto">
                <div
                  className={`w-[252px] h-[252px] bg-secondary-main rounded-2xl ${
                    profileImage?.imagePreview
                      ? "border-common-white"
                      : "border-grey-500"
                  } border border-solid`}
                >
                  {profileImage || !user.generalInfo.profileImage ? (
                    <InputCropSingleImage
                      type="PROFILEIMG"
                      aspect="1/1"
                      finalImage={profileImage}
                      setFinalImage={setProfileImage}
                      placeholder={{
                        placeholderImg: (
                          <div className="text-grey-500 h-8 scale-[1.8]">
                            <ImagePlaceHolderGalleryIcon />
                          </div>
                        ),
                        placeholderTitle: (
                          <>
                            <h2 className="text-center text-sm md:pt-5 pt-3">
                              Drag & Drop Profile Photo
                            </h2>
                            or
                            <h2 className=" text-primary-main text-sm text-center">
                              Browse
                            </h2>
                          </>
                        ),
                      }}
                    />
                  ) : (
                    <div className="flex justify-center items-center h-full w-full">
                      <div className="mt-4 text-common-black text-center w-full overflow-hidden">
                        <CircularProgress
                          size={20}
                          className="text-common-white"
                        />
                      </div>
                    </div>
                  )}
                </div>
                <div className="flex-1 flex justify-center">
                  <div className="flex flex-grow flex-col gap-2.5">
                    <div>
                      <p className="text-sm mb-2">User name</p>
                      <Controller
                        name="userName"
                        control={control}
                        rules={{
                          required: {
                            value: true,
                            message: "Username is required field",
                          },
                          minLength: {
                            value: 4,
                            message:
                              "Username must be atleast 4 characters long",
                          },
                        }}
                        render={({ field }) => (
                          <>
                            <CustomInputTextField
                              {...field}
                              onChange={(e: ChangeEvent<HTMLInputElement>) => {
                                const value = e.target.value.replace(
                                  /[^A-Za-z0-9._]/gi,
                                  ""
                                );
                                field.onChange(value);
                              }}
                              placeholder="Enter Your Username"
                              className="text-grey-100 border-0 h-full [&>.MuiInputBase-root]:font-light"
                            />
                            <p className="h-[10px] mb-3 mt-1 text-[12px] text-error-main">
                              {errors.userName?.message}
                            </p>
                          </>
                        )}
                      />
                    </div>
                    <div>
                      <p className="text-sm mb-2 ">Your First name</p>
                      <Controller
                        name="generalInfo.firstName"
                        control={control}
                        rules={{
                          required: {
                            value: true,
                            message: "First Name is required field",
                          },
                          minLength: {
                            value: 3,
                            message:
                              "First Name must be atleast 3 characters long",
                          },
                        }}
                        render={({ field }) => (
                          <>
                            <CustomInputTextField
                              {...field}
                              placeholder="Enter Your First Name"
                              className="text-grey-100 border-0 h-full [&>.MuiInputBase-root]:font-light"
                            />
                            <p className="h-[10px] mb-2 mt-1 text-[12px] text-error-main">
                              {errors.generalInfo?.firstName?.message}
                            </p>
                          </>
                        )}
                      />
                    </div>
                    <div>
                      <p className="text-sm mb-2">Your Last name</p>
                      <Controller
                        name="generalInfo.lastName"
                        control={control}
                        rules={{
                          required: {
                            value: true,
                            message: "Last Name is required field",
                          },
                          minLength: {
                            value: 3,
                            message:
                              "Last Name must be atleast 3 characters long",
                          },
                        }}
                        render={({ field }) => (
                          <>
                            <CustomInputTextField
                              {...field}
                              placeholder="Enter Your Last Name"
                              className="text-grey-100 border-0 h-full [&>.MuiInputBase-root]:font-light"
                            />
                            <p className="h-[7px]  text-[12px] text-error-main">
                              {errors.generalInfo?.lastName?.message}
                            </p>
                          </>
                        )}
                      />
                    </div>
                    <div>
                      <p className="text-sm mb-2 mt-2">Bio</p>
                      <Controller
                        name="generalInfo.bio"
                        control={control}
                        rules={{
                          minLength: {
                            value: 3,
                            message: "Bio must be atleast 3 characters long",
                          },
                        }}
                        render={({ field }) => (
                          <>
                            <CustomInputTextField
                              {...field}
                              multiline
                              rows={3}
                              placeholder="Enter Your Bio"
                              className="text-grey-100 border-0 h-full [&>.MuiInputBase-root]:font-light"
                            />
                            <p className="h-[10px] mt-1 text-[12px] text-error-main">
                              {errors.generalInfo?.bio?.message}
                            </p>
                          </>
                        )}
                      />
                    </div>
                    <div className="flex justify-between gap-5">
                      <div className="flex flex-col gap-2">
                        <p className=" text-sm">Show repost on your profile</p>
                        <p className=" text-grey-200 text-xs font-light max-w-[420px]">
                          Turning this on means other people will able to see
                          your reposted post in your profile.
                        </p>
                      </div>
                      <div className=" scale-[0.8]">
                        <Controller
                          name="shouldShowRepost"
                          control={control}
                          render={({ field }) => (
                            <CustomToggleSwitch
                              {...field}
                              isChecked={field.value}
                              handleToggle={() => field.onChange(!field.value)}
                            />
                          )}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* right side */}
            <div className=" lg:max-w-[570px]  flex flex-col  h-fit">
              <CreditSettings
                setValue={setValue}
                Controller={Controller}
                control={control}
                setCurrentTab={setCurrentTab}
                errors={errors}
              />
            </div>
          </div>
          {/*Links*/}
          <div className=" flex flex-col  gap-5 bg-grey-900 p-5 rounded-lg">
            <div className=" flex flex-col gap-5 ">
              <div className="flex gap-5 items-center">
                <div className=" text-success-dark">
                  <LinkIcon />
                </div>
                <p className="text-sm tracking-wider">Linked Accounts</p>
              </div>
              <Divider
                sx={{
                  borderColor: theme.palette.grey[500],
                }}
              />
            </div>
            <div className="  grid md:grid-cols-1 lg:grid-cols-2 gap-1 xl:grid-cols-3 ">
              <Controller
                name="linkedAccounts.instagram"
                control={control}
                rules={{
                  pattern: {
                    value: /^(ftp|http|https):\/\/[^ "]+$/,
                    message: "Invalid link format",
                  },
                }}
                render={({ field }) => (
                  <div
                    className={`flex flex-col h-fit border rounded-md ${
                      errors.linkedAccounts?.instagram?.message
                        ? " border-error-main"
                        : "border-grey-900"
                    }`}
                  >
                    <CustomInputTextField
                      {...field}
                      placeholder="Instagram ID Link"
                      className={`text-grey-100 border-0 [&>.MuiInputBase-root]:font-light`}
                      StartIcon={
                        <div className="text-common-white">
                          <InstagramIcon />
                        </div>
                      }
                    />
                  </div>
                )}
              />
              <Controller
                name="linkedAccounts.twitter"
                control={control}
                rules={{
                  pattern: {
                    value: /^(ftp|http|https):\/\/[^ "]+$/,
                    message: "Invalid link format",
                  },
                }}
                render={({ field }) => (
                  <div
                    className={`flex flex-col h-fit border rounded-md ${
                      errors.linkedAccounts?.twitter?.message
                        ? " border-error-main"
                        : "border-grey-900"
                    }`}
                  >
                    <CustomInputTextField
                      {...field}
                      placeholder="Twitter ID Link"
                      className="text-grey-100 border-0 [&>.MuiInputBase-root]:font-light "
                      StartIcon={
                        <div className="text-common-white">
                          <TwitterIcon />
                        </div>
                      }
                    />
                  </div>
                )}
              />
              <Controller
                name="linkedAccounts.tiktok"
                control={control}
                rules={{
                  pattern: {
                    value: /^(ftp|http|https):\/\/[^ "]+$/,
                    message: "Invalid link format",
                  },
                }}
                render={({ field }) => (
                  <div
                    className={`flex flex-col h-fit border rounded-md ${
                      errors.linkedAccounts?.tiktok?.message
                        ? " border-error-main"
                        : "border-grey-900"
                    }`}
                  >
                    <CustomInputTextField
                      {...field}
                      placeholder="Tiktok ID Link"
                      className="text-grey-100 border-0 [&>.MuiInputBase-root]:font-light"
                      StartIcon={
                        <div className="text-common-white">
                          <TiktokIcon />
                        </div>
                      }
                    />
                  </div>
                )}
              />
              <Controller
                name="linkedAccounts.twitch"
                control={control}
                rules={{
                  pattern: {
                    value: /^(ftp|http|https):\/\/[^ "]+$/,
                    message: "Invalid link format",
                  },
                }}
                render={({ field }) => (
                  <div
                    className={`flex flex-col h-fit border rounded-md ${
                      errors.linkedAccounts?.twitch?.message
                        ? " border-error-main"
                        : "border-grey-900"
                    }`}
                  >
                    <CustomInputTextField
                      {...field}
                      placeholder="Twitch ID Link"
                      className="text-grey-100 border-0 [&>.MuiInputBase-root]:font-light "
                      StartIcon={
                        <div className="text-common-white">
                          <TwitchIcon />
                        </div>
                      }
                    />
                  </div>
                )}
              />
              <Controller
                name="linkedAccounts.youtube"
                control={control}
                rules={{
                  pattern: {
                    value: /^(ftp|http|https):\/\/[^ "]+$/,
                    message: "Invalid link format",
                  },
                }}
                render={({ field }) => (
                  <div
                    className={`flex flex-col h-fit   border rounded-md ${
                      errors.linkedAccounts?.youtube?.message
                        ? " border-error-main"
                        : "border-grey-900"
                    }`}
                  >
                    <CustomInputTextField
                      {...field}
                      placeholder="Youtube ID Link"
                      className="text-grey-100 border-0 [&>.MuiInputBase-root]:font-light"
                      StartIcon={
                        <div className="text-common-white">
                          <YouTubeIcon />
                        </div>
                      }
                    />
                  </div>
                )}
              />
              <Controller
                name="linkedAccounts.onlyfans"
                control={control}
                rules={{
                  pattern: {
                    value: /^(ftp|http|https):\/\/[^ "]+$/,
                    message: "Invalid link format",
                  },
                }}
                render={({ field }) => (
                  <div
                    className={`flex flex-col h-fit border border-grey-900 rounded-md ${
                      errors.linkedAccounts?.onlyfans?.message
                        ? " border-error-main"
                        : "border-grey-900"
                    }`}
                  >
                    <CustomInputTextField
                      {...field}
                      placeholder="Website Link"
                      className="text-grey-100 border-0 [&>.MuiInputBase-root]:font-light "
                      StartIcon={
                        <div className="text-common-white">
                          <WebsiteIcon />
                        </div>
                      }
                    />
                  </div>
                )}
              />
            </div>
          </div>
        </div>
        <div className="mt-4 mb-2 flex justify-end">
          <CustomLoadingButton
            name="Save & Update"
            className={`py-3 px-5 text-base font-normal rounded-lg  w-[30%] ${
              isDirty || profileImage?.imagePreview.includes("data:")
                ? "bg-primary-main "
                : "bg-grey-900 text-common-white text-opacity-25"
            } `}
            // disabled={!isDirty || !profileImage?.imagePreview.includes("data:")}
            onClick={() => {
              if (isDirty || profileImage?.imagePreview.includes("data:")) {
                handleSubmit(onSubmit)();
              }
            }}
            loading={isProfileSubmitting}
          />
        </div>
      </form>
      <SettingBottomBar />
    </>
  );
};

export default Account;
