import Image from "next/image";
import React, { useState } from "react";
import startCreatingBg from "@/utils/images/startCreatingBg.jpg";
import { Button, Divider, IconButton } from "@mui/material";
import AutomodeBlackIcon from "@/utils/icons/shared/AutomodeBlackIcon";
import { theme } from "@/theme";
import OpenLockIcon from "@/utils/icons/shared/OpenLockIcon";
import CustomButton from "../../../../CustomButton";
import CloseIcon from "@/utils/icons/shared/CloseIcon";
import GetStartedMirroeIcon from "@/utils/icons/levelUp/GetStartedMirroeIcon";
import { useAuthContext } from "@/context/AuthContext";
import GradientCrown from "@/utils/icons/levelUp/GradientCrown";
import CustomDialog from "../../../CustomDialog";
import TermsOfServices from "@/components/footerDialogs/TermsOfServices";
import PrivacyPolicy from "@/components/footerDialogs/PrivacyPolicy";
import ContentPolicy from "@/components/footerDialogs/ContentPolicy";

type Props = {
  setcurrentStep: React.Dispatch<React.SetStateAction<number>>;
};

const LevelStartCreating = ({ setcurrentStep }: Props) => {
  const { setCustomDialogType, customDialogType } = useAuthContext();
  const [policy, setPolicy] = useState<string | null>(null);
  return (
    <>
      <div className="flex w-full flex-col text-common-white items-center relative">
        <div
          className=" text-common-white absolute top-5 right-5 z-10 cursor-pointer"
          onClick={() => {
            setCustomDialogType(null);
          }}
        >
          <CloseIcon isBorderRounded={true} />
        </div>
        <div className="w-full flex flex-col relative">
          <Image
            fill
            src={startCreatingBg}
            alt=""
            className="relative rounded-md"
          />
          <div className="w-full">
            <Divider
              sx={{
                borderColor: theme.palette.grey[500],
              }}
            />
          </div>
          <div className="flex flex-col absolute bottom-0 px-10 py-7 gap-2">
            <p className=" text-2xl font-semibold">Start Creating</p>
            <p className=" text-xs text-grey-200 font-light tracking-wider leading-relaxed">
              Generate stunning AI-generated images of Yourself within seconds,
              using the premium access features.
            </p>
          </div>
        </div>
        <div className=" flex flex-col gap-7 px-10 py-7 w-full   ">
          <div className=" items-center flex gap-4">
            <IconButton className=" w-8 h-8 text-common-white bg-grey-700 border-grey-500 border border-solid rounded-lg">
              <div className=" scale-[0.65]">
                <AutomodeBlackIcon />
              </div>
            </IconButton>
            <p>
              <span className="  text-primary-main font-semibold ">Create</span>{" "}
              custom photos of yourself
            </p>
          </div>
          <div className=" items-center flex gap-4">
            <IconButton className=" w-8 h-8 text-common-white bg-grey-700 border-grey-500 border border-solid rounded-lg">
              <div className=" scale-[0.65]">
                <OpenLockIcon />
              </div>
            </IconButton>
            <p>
              <span className="  text-primary-main font-semibold">
                Unlock 40 more
              </span>{" "}
              photos of yourself
            </p>
          </div>
          <div className=" items-center flex gap-4">
            <IconButton className=" w-8 h-8 text-common-white bg-grey-700 border-grey-500 border border-solid rounded-lg">
              <div className="">
                <GetStartedMirroeIcon />
              </div>
            </IconButton>
            <p>
              Get
              <span className="  text-primary-main font-semibold ">
                {" "}
                195 credits
              </span>{" "}
              to get started creating
            </p>
          </div>
          <div className="flex gap-3 w-full pt-5">
            <CustomButton name="Witit Unlock" className=" rounded-lg" />

            <Button
              className="w-full border border-primary-main border-solid rounded-lg bg-primary-dark border-bg-gradient-to-r from-blue-main to-blue-light"
              onClick={() => {
                setcurrentStep(1);
              }}
            >
              <span className="absolute bottom-1 -right-7">
                <GradientCrown />
              </span>{" "}
              <div className="flex gap-1">Witit Premium</div>
            </Button>
          </div>
          <p className=" text-center text-[0.8rem] font-light leading-relaxed">
            By tapping $4.99 you agree to be bound by Witit’s{" "}
            <span
              className="  text-primary-main cursor-pointer   "
              onClick={() => {
                setPolicy("TERMS_OF_SERVICES");
              }}
            >
              Terms of Service
            </span>
            ,{" "}
            <span
              className="  text-primary-main  cursor-pointer"
              onClick={() => {
                setPolicy("CONTENT_POLICYS");
              }}
            >
              Content Policy
            </span>
            , and{" "}
            <span
              className="  text-primary-main  cursor-pointer"
              onClick={() => {
                setPolicy("PRIVACY_POLICYS");
              }}
            >
              Privacy Policy.
            </span>
          </p>
        </div>
      </div>

      {policy && (
        <CustomDialog className="  min-h-[300px]  h-fit w-[600px]">
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
          ) : policy === "CONTENT_POLICYS" ? (
            <ContentPolicy
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

export default LevelStartCreating;
