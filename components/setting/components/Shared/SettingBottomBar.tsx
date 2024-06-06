import ContactUs from "@/components/footerDialogs/ContactUs";
import ContentPolicy from "@/components/footerDialogs/ContentPolicy";
import PrivacyPolicy from "@/components/footerDialogs/PrivacyPolicy";
import TermsOfServices from "@/components/footerDialogs/TermsOfServices";
import CustomDialog from "@/components/shared/dialog/CustomDialog";
import { useAuthContext } from "@/context/AuthContext";
import React, { useState } from "react";

const SettingBottomBar = () => {
  const [isOpenDialogString, setIsOpenDialogString] = useState<string | null>(
    null
  );
  return (
    <>
      <div className="flex gap-4  pb-5 relative">
        <p
          className=" font-light text-sm cursor-pointer text-grey-200"
          onClick={() => {
            setIsOpenDialogString("TERMS_OF_SERVICE");
          }}
        >
          Terms Of Services
        </p>
        <p className=" font-light  text-grey-200">|</p>
        <p
          className=" font-light text-sm cursor-pointer text-grey-200"
          onClick={() => {
            setIsOpenDialogString("PRIVACY_POLICY");
          }}
        >
          Privacy Policy
        </p>
        <p className=" font-light  text-grey-200">|</p>{" "}
        <p
          className=" font-light text-sm cursor-pointer text-grey-200"
          onClick={() => {
            setIsOpenDialogString("CONTENT_POLICY");
          }}
        >
          Content Policy
        </p>
        <p className=" font-light  text-grey-200">|</p>{" "}
        <p
          className=" font-light text-sm cursor-pointer text-grey-200"
          onClick={() => {
            setIsOpenDialogString("CONTACT_US");
          }}
        >
          Contact Us
        </p>
      </div>
      {isOpenDialogString && (
        <CustomDialog
          className="min-h-[300px] h-fit w-[600px]"
          isOpen={isOpenDialogString === null ? false : true}
          onCancel={() => {
            setIsOpenDialogString(null);
          }}
        >
          {isOpenDialogString === "TERMS_OF_SERVICE" ? (
            <TermsOfServices
              onCancel={() => {
                setIsOpenDialogString(null);
              }}
            />
          ) : isOpenDialogString === "PRIVACY_POLICY" ? (
            <PrivacyPolicy
              onCancel={() => {
                setIsOpenDialogString(null);
              }}
            />
          ) : isOpenDialogString === "CONTENT_POLICY" ? (
            <ContentPolicy
              onCancel={() => {
                setIsOpenDialogString(null);
              }}
            />
          ) : isOpenDialogString === "CONTACT_US" ? (
            <ContactUs
              onCancel={() => {
                setIsOpenDialogString(null);
              }}
            />
          ) : null}
        </CustomDialog>
      )}
    </>
  );
};

export default SettingBottomBar;
