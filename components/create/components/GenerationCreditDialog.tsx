import { Divider, IconButton } from "@mui/material";
import CustomToggleSwitch from "../../shared/CustomToggleSwitch";
import CreditIcon from "@/utils/icons/topbar/CreditIcon";
import { theme } from "@/theme";
import React, { useEffect, useState } from "react";
import CustomDialog from "../../shared/dialog/CustomDialog";
import CloseIcon from "@/utils/icons/shared/CloseIcon";
import { creditDialogBg } from "@/utils/images";
import CustomButton from "../../shared/CustomButton";
import {
  Control,
  Controller,
  UseFormGetValues
} from "react-hook-form";
import { AiCharges, PostAiGeneration } from "@/types/ai";
import RocketIcon from "@/utils/icons/shared/RocketIcon";
import { CustomImagePreview } from "../../shared/CustomImagePreview";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import CustomLoadingButton from "@/components/shared/CustomLoadingButton";
import TermsOfServices from "@/components/footerDialogs/TermsOfServices";
import PrivacyPolicy from "@/components/footerDialogs/PrivacyPolicy";
import { useGenerationContext } from "../context/GenerationContext";
import { useAuthContext } from "@/context/AuthContext";
import CustomInsufficientCredit from "@/components/shared/CustomInsufficientCredit";

type Props = {
  setIsCreditDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  handleSubmit: () => void;
  generationCharge: AiCharges;
  control: Control<PostAiGeneration>;
  getValues: UseFormGetValues<PostAiGeneration>;
  isButtonLoading: boolean;
  isnotEnoughCredit: boolean;
  setIsnotEnoughCredit: React.Dispatch<React.SetStateAction<boolean>>;
};

export const GenerationCreditDialog = ({
  setIsCreditDialogOpen,
  isnotEnoughCredit,
  handleSubmit,
  setIsnotEnoughCredit,
  generationCharge,
  control,
  getValues,
  isButtonLoading,
}: Props) => {
  const user = useSelector((state: RootState) => state.user);

  const { setCalculatedCharge, calculatedCharge } = useGenerationContext();
  const { setCustomDialogType } = useAuthContext();

  const [policy, setPolicy] = useState<string | null>(null);

  const handleChargeChange = () => {
    const [numberOfGenerations, superShoot] = getValues([
      "numberOfGenerations",
      "superShoot",
    ]);

    const { creditPerGeneration } = superShoot
      ? generationCharge.withSuperShoot
      : generationCharge.withOutSuperShoot;

    const divisibleFactor =
      generationCharge.numberOfGeneration / numberOfGenerations;

    setCalculatedCharge(creditPerGeneration / divisibleFactor);
  };

  useEffect(() => {
    handleChargeChange();
  }, []);

  if (!user?.credit) return <></>;

  const { nonTransferableCredit, tempCredit, transferableCredit } = user.credit;
  const openGetCreditDialog = () => {
    setCustomDialogType("CREDITS-GETCREDITS");
  };

  const closeDialoag = () => {
    setIsnotEnoughCredit(false);
  };
  return (
    <>
      <CustomDialog
        isOpen={true}
        onCancel={() => setIsCreditDialogOpen(false)}
        className="w-full max-w-[430px] h-fit  flex flex-col gap-5  max-h-[630px]  justify-start items-center"
      >
        <div className="pb-5 w-full">
          <div className=" relative w-full flex flex-col  gap-5 ">
            <IconButton
              className=" absolute right-3 top-3 z-20 text-common-white"
              onClick={() => setIsCreditDialogOpen(false)}
            >
              <CloseIcon isBorderRounded={true} />
            </IconButton>
            <div className=" h-[180px]   w-full relative  z-0 rounded-md">
              <CustomImagePreview image={creditDialogBg} />
            </div>
            <div className=" absolute bottom-[-28px] px-7 w-full">
              <div className=" h-14 bg-grey-800 border border-grey-700 py-4 px-6 rounded-xl flex justify-between items-center">
                <p className=" text-grey-300">Total Credit Balance</p>
                <div className=" flex items-end">
                  <p className=" text-lg tracking-widest align-bottom">
                    {tempCredit + transferableCredit + nonTransferableCredit}
                  </p>
                  <div className=" scale-[0.65]">
                    <CreditIcon />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="w-full px-7 flex flex-col gap-5 pt-5">
          <div className=" flex justify-between">
            <p>Number of photos</p>
            <Controller
              name="numberOfGenerations"
              control={control}
              render={({ field }) => (
                <div className="flex bg-grey-700 rounded-full ">
                  {[2, 4, 8].map((item, index) => {
                    return (
                      <div key={index}>
                        <CustomButton
                          className={`p-4 w-4 h-4 rounded-full border border-solid ${
                            item === field.value
                              ? "bg-primary-main "
                              : "bg-grey-700 text-grey-300 "
                          } tracking-wider min-w-0 w-[50px] text-center text-[13px] leading-5 border-none `}
                          name={item.toString()}
                          onClick={() => {
                            field.onChange(item);
                            handleChargeChange();
                          }}
                        />
                      </div>
                    );
                  })}
                </div>

                // <CustomToggleSwitch
                //   isChecked={field.value === 4 ? false : true}
                //   handleToggle={() => {
                //     field.onChange(field.value === 4 ? 8 : 4);
                //     handleChargeChange();
                //   }}
                //   startNumber={4}
                //   endNumber={8}
                // />
              )}
            />
          </div>
          <div className=" flex justify-between">
            <div className="flex flex-col">
              <p>Super Shoot</p>
              <p className=" text-grey-400 text-[0.65rem] pb-2">
                10x the number of images created
              </p>
              <p className=" text-primary-light border rounded-sm font-extralight border-primary-light w-fit px-2 text-[0.65rem]">
                10% off with supershoot
              </p>
            </div>
            <Controller
              name="superShoot"
              control={control}
              render={({ field }) => (
                <CustomToggleSwitch
                  isChecked={field.value}
                  handleToggle={() => {
                    field.onChange(!field.value);
                    handleChargeChange();
                  }}
                  startIcon={
                    <div className="scale-[0.6] text-grey-700">
                      <RocketIcon />
                    </div>
                  }
                  endIcon={
                    <div className="scale-[0.6] text-primary-main">
                      <RocketIcon />
                    </div>
                  }
                />
              )}
            />
          </div>
          <Divider
            sx={{
              borderStyle: "dashed",
              borderColor: theme.palette.grey[500],
              width: "100%",
            }}
          />
          <div className=" flex w-full justify-between items-center">
            <p className=" ">Total Order Amount</p>
            <div className="flex items-end">
              <p
                className={`text-xl ${
                  isnotEnoughCredit ? "text-error-main" : "text-primary-main"
                }  font-semibold`}
              >
                {calculatedCharge}
              </p>
              <div className=" scale-[0.6]">
                <CreditIcon />
              </div>
            </div>
          </div>
          <Divider
            sx={{
              borderStyle: "dashed",
              borderColor: theme.palette.grey[500],
              width: "100%",
            }}
          />
        </div>
        <div className=" flex flex-col items-center py-5 w-full">
          <CustomLoadingButton
            name="Send Credits"
            disabled={isnotEnoughCredit}
            className={`py-3 text-sm font-normal w-[88%] ${
              isnotEnoughCredit ? "bg-grey-800 text-common-white" : ""
            }`}
            handleEvent={() => handleSubmit()}
            loading={isButtonLoading}
          />
          <p className="pt-5 text-xs font-light text-grey-300 text-center">
            By submitting this request you agree to witit’s
          </p>
          <p className="text-xs font-light text-grey-300 text-center">
            <span
              className=" text-primary-main font-semibold pl-1 cursor-pointer"
              onClick={() => {
                setPolicy("PRIVACY_POLICYS");
              }}
            >
              Privacy Policy
            </span>
            and
            <span
              className=" text-primary-main font-semibold pl-1 cursor-pointer"
              onClick={() => {
                setPolicy("TERMS_OF_SERVICES");
              }}
            >
              Terms of Use
            </span>
          </p>
        </div>
        {isnotEnoughCredit && (
          <div className="absolute  bottom-[2%] w-[80%]">
            <CustomInsufficientCredit
              onCancel={closeDialoag}
              handleEvent={openGetCreditDialog}
            />
          </div>
        )}
      </CustomDialog>
      {policy && (
        <CustomDialog
          isOpen={true}
          className="  min-h-[300px]  h-fit w-[600px]"
        >
          {policy === "TERMS_OF_SERVICES" ? (
            <TermsOfServices
              onCancel={() => {
                setPolicy(null);
              }}
            />
          ) : policy === "PRIVACY_POLICYS" ? (
            <PrivacyPolicy
              onCancel={() => {
                setPolicy(null);
              }}
            />
          ) : null}
        </CustomDialog>
      )}
    </>
  );
};
