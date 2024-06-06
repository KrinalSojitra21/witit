import { theme } from "@/theme";
import CreaditIcon from "@/utils/icons/setting/CreaditIcon";
import { Button, Divider } from "@mui/material";
import React, { Dispatch, SetStateAction, useState } from "react";
import { ReduxUser } from "@/types/user";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

import {
  Control,
  ControllerProps,
  FieldErrors,
  FieldPath,
  FieldValues,
  UseFormSetValue,
} from "react-hook-form";
import CustomToggleSwitch from "@/components/shared/CustomToggleSwitch";
import NotCreditShowCrown from "@/utils/icons/setting/NotCreditShowCrown";
import CustomButton from "@/components/shared/CustomButton";
import GradientCrown from "@/utils/icons/levelUp/GradientCrown";
import { useAuthContext } from "@/context/AuthContext";

type Props = {
  setValue: UseFormSetValue<Partial<ReduxUser>>;
  setCurrentTab: Dispatch<SetStateAction<string>>;
  Controller: <
    TFieldValues extends FieldValues = FieldValues,
    TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
  >(
    props: ControllerProps<TFieldValues, TName>
  ) => React.ReactElement;
  control: Control<Partial<ReduxUser>, any>;
  errors: FieldErrors<Partial<ReduxUser>>;
};
const CreditSettings = ({
  setValue,
  Controller,
  control,
  setCurrentTab,
  errors,
}: Props) => {
  const user = useSelector((state: RootState) => state.user);
  const [isAllowedOthers, setIsAllowedOthers] = useState(
    user?.generationSettings?.allowGenerationOnPost
  );
  const { setCustomDialogType } = useAuthContext();

  return (
    <>
      <div className=" relative flex flex-col  flex-grow gap-7 bg-grey-900 rounded-xl p-6 h-fit">
        <div className=" flex flex-col  gap-5 ">
          <div className="flex gap-5 items-center">
            <CreaditIcon />
            <p className="text-sm tracking-wider">Credit Settings</p>
          </div>
          <Divider
            sx={{
              borderColor: theme.palette.grey[500],
            }}
          />
        </div>

        <div
          className={` flex flex-col gap-5 overflow-auto ${
            user?.generationSettings ? "blur-none" : " blur-md"
          }`}
        >
          {" "}
          <div
            className={` flex flex-col gap-5 overflow-auto  ${
              user?.generationSettings
                ? "blur-none"
                : " pointer-events-none select-none"
            }`}
          >
            <div className="flex  flex-col gap-2">
              <p className="text-sm tracking-wider text-grey-100 font-semibold">
                Earn with Witit
              </p>
              <p className="text-grey-100 text-xs font-light tracking-wider">
                With Witit, you can allow others to generate images and By doing
                so you can charge credits per transaction and withdrawal those
                credits into cash at the rate of $1 for every 150 credits
              </p>
            </div>
            <div className=" bg-grey-800 rounded-md  p-5 flex flex-col gap-5">
              <div className="flex justify-between">
                <p className="text-sm tracking-wider">
                  Allow others to use your post on their AI
                </p>
                <div className=" scale-[0.8]">
                  <Controller
                    name="generationSettings.allowGenerationOnPost"
                    control={control}
                    render={({ field }) => (
                      <CustomToggleSwitch
                        labelString=""
                        labelStyle=""
                        isChecked={isAllowedOthers}
                        handleToggle={(e: any) => {
                          setIsAllowedOthers(e.target.checked);
                          field.onChange(e.target.checked);
                          if (!e.target.checked) {
                            setValue(
                              "generationSettings.creditPerDerivative",
                              0
                            );
                            return;
                          }
                        }}
                      />
                    )}
                  />
                </div>
              </div>
              {isAllowedOthers && (
                <>
                  <Divider
                    sx={{
                      borderColor: theme.palette.grey[500],
                    }}
                  />
                  <div className="flex justify-between  gap-5 items-center">
                    <div className="flex flex-col gap-1">
                      <p className="text-sm tracking-wider">
                        Cost per derivative
                      </p>
                      <p className="text-grey-100 text-xs font-light tracking-wider">
                        If someone uses your image when generating their image,
                        you will get this credit.
                      </p>
                      <p className="text-xs mt-1 h-[7px] text-error-main">
                        {
                          errors.generationSettings?.creditPerDerivative
                            ?.message
                        }
                      </p>
                    </div>
                    <Controller
                      name="generationSettings.creditPerDerivative"
                      control={control}
                      rules={{
                        ...(user?.generationSettings && {
                          validate: (fieldValue) => {
                            return (
                              fieldValue! >= 1 ||
                              "Credit PerDerivative must be greater than 0"
                            );
                          },
                        }),
                      }}
                      render={({ field }) => (
                        <input
                          {...field}
                          type="number"
                          value={field.value === 0 ? undefined : field.value}
                          placeholder="0"
                          onChange={(e) => {
                            field.onChange(+e.target.value);
                          }}
                          className=" w-[80px] p-2  h-fit text-center border rounded-lg focus:outline-none border-grey-600 bg-grey-800 "
                        />
                      )}
                    />
                  </div>
                </>
              )}
            </div>
            <div className=" bg-grey-800 rounded-md  p-5 flex flex-col gap-5">
              <div className=" flex justify-between gap-5 items-center">
                <div className="flex flex-col gap-1">
                  <p className="text-sm r tracking-wider">Cost per Message</p>
                  <p className="text-grey-100 text-xs font-light tracking-wider">
                    You will get this credit when unverified senders sends a
                    message to you.
                  </p>
                  <p className="h-[7px] text-xs text-error-main">
                    {errors.generationSettings?.creditPerMessage?.message}
                  </p>
                </div>
                <Controller
                  name="generationSettings.creditPerMessage"
                  control={control}
                  rules={{
                    ...(user?.generationSettings && {
                      validate: (fieldValue) => {
                        return (
                          fieldValue! >= 1 ||
                          "Cost per Message must be greater than 0"
                        );
                      },
                    }),
                  }}
                  render={({ field }) => (
                    <input
                      type="number"
                      value={field.value === 0 ? undefined : field.value}
                      placeholder="0"
                      onChange={(e) => {
                        field.onChange(+e.target.value);
                      }}
                      className=" w-[80px] p-2  h-fit text-center border rounded-lg focus:outline-none border-grey-600 bg-grey-800 "
                    />
                  )}
                />
              </div>
            </div>
            <div className="relative  bg-primary-main bg-opacity-[0.16] border border-solid border-primary-main text-xs rounded-xl p-5">
              <p className="text-primary-main text-xs ">
                You can set the price for your AI models so when someone uses
                your AI model to generate an image, you get credits.
              </p>

              <div className=" flex justify-end pt-7">
                <p
                  className=" text-common-white font-semibold text-sm cursor-pointer"
                  onClick={() => {
                    setCurrentTab("AI_MODELS");
                  }}
                >
                  SET PRICE FOR EACH MODEL
                </p>
              </div>
            </div>
            {/* <div className="  flex justify-center">
            <CustomButton
              name="Save Changes"
              className=" w-[80%] py-3"
              handleEvent={() => {
                handleSubmit();
              }}
            />
          </div> */}
          </div>
        </div>
        {!user?.generationSettings && (
          <div className="flex flex-col gap-5 overflow-auto absolute  z-10 items-center justify-center top-[38%] left-[25%] ">
            <NotCreditShowCrown />
            <p className="w-[320px] text-center">
              <span className="text-primary-light font-bold">Earn cash</span>{" "}
              from your AI, posts, prompts or through messaging
            </p>
            <div className="flex gap-3 w-full p-3 overflow-hidden ">
              <CustomButton name="Witit Unlock" className=" rounded-lg" />

              <Button
                className="w-full border border-primary-main border-solid rounded-lg bg-primary-dark border-bg-gradient-to-r from-blue-main to-blue-light"
                onClick={() => {
                  setCustomDialogType("LEVELUP");
                }}
              >
                <span className="absolute bottom-1 -right-7">
                  <GradientCrown />
                </span>{" "}
                <div className="flex gap-1">Witit Premium</div>
              </Button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default CreditSettings;
