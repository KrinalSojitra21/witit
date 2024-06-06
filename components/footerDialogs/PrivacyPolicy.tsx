import { theme } from "@/theme";
import { Divider } from "@mui/material";
import React from "react";
import CustomDialogCommonTopBar from "../shared/dialog/GlobalDialogs/components/shared/CustomDialogCommonTopBar";

type Props = {
  onCancel?: () => void;
};
const PrivacyPolicy = ({ onCancel }: Props) => {
  return (
    <div className="text-common-white flex flex-col  max-h-[650px]  max-w-[650px]  h-full">
      <CustomDialogCommonTopBar title="Privacy Policy" onCancel={onCancel} />

      <div className="px-5 pt-5 gap-4 flex flex-col flex-grow overflow-auto">
        <h5 className=" text-xs tracking-wider text-grey-200 font-semibold ">
          Introduction:
        </h5>
        <h6 className=" text-xs tracking-wider text-grey-200 ">
          Witit is a social media platform that employs artificial intelligence
          (“AI”) to enable users to create and share unique content, such as
          AI-generated images. Upholding the privacy and trust of our users is
          at the heart of our operations, and this Privacy Policy outlines our
          data collection, usage, and sharing practices.
        </h6>
        <h5 className=" text-xs tracking-wider text-grey-200 font-semibold ">
          Information Collection and Use:
        </h5>
        <h6 className=" text-xs tracking-wider text-grey-200 ">
          To deliver our services and enhance the Witit platform, we gather and
          utilize personal data. This might encompass information like your
          name, email address, payment details, and content you generate, post,
          or share on the platform.
        </h6>
        <h6 className=" text-xs tracking-wider text-grey-200 ">
          We also assemble data regarding your interactions with the platform
          and other users, which assists us in improving our services and
          ensuring compliance with our Terms of Service.
        </h6>
        <h5 className=" text-xs tracking-wider text-grey-200 font-semibold ">
          Information Sharing and Disclosure:
        </h5>
        <h6 className=" text-xs tracking-wider text-grey-200 ">
          We respect your privacy and do not sell or rent your personal
          information to third parties for marketing purposes. However, we may
          share your information with affiliates and service providers as
          necessary for the provision and operation of our services.
        </h6>
        <h6 className=" text-xs tracking-wider text-grey-200 ">
          In certain cases, Witit may disclose personal information in
          accordance with legal requirements, such as a court order or subpoena,
          or in response to a law enforcement agency’s request. We may also
          release such data if we believe it necessary to uphold our rights,
          safeguard your security or the safety of others, investigate potential
          fraudulent activity, or answer a government request.
        </h6>
        <h5 className=" text-xs tracking-wider text-grey-200 font-semibold ">
          Security:
        </h5>
        <h6 className=" text-xs tracking-wider text-grey-200 ">
          Witit takes comprehensive measures, including encryption and secure
          servers, to ensure the security of your personal information.
          Nonetheless, no method of transmission over the internet or method of
          electronic storage is completely secure, hence we cannot guarantee the
          absolute security of your data.
        </h6>
        <h5 className=" text-xs tracking-wider text-grey-200 font-semibold ">
          User Verification Information:
        </h5>
        <h6 className=" text-xs tracking-wider text-grey-200 ">
          To maintain the integrity of our platform, we collect identification
          documents, such as driver&apos;s licenses, during our user
          verification process. However, this information is used solely for
          verification purposes and is not used or disclosed for any other
          purpose.
        </h6>
        <h5 className=" text-xs tracking-wider text-grey-200 font-semibold ">
          AI Training Data:
        </h5>
        <h6 className=" text-xs tracking-wider text-grey-200 ">
          We may use the content you upload to Witit as training data for our
          AI. We are committed to handling this data responsibly and will not
          use it for purposes beyond improving our AI capabilities.
        </h6>
        <h5 className=" text-xs tracking-wider text-grey-200 font-semibold ">
          Off-Platform Content Distribution:
        </h5>
        <h6 className=" text-xs tracking-wider text-grey-200 ">
          Please note that we are not responsible for any content generated on
          Witit that is shared or distributed off our platform. Our commitment
          to user privacy extends only to data and content shared within our
          platform.
        </h6>
        <h5 className=" text-xs tracking-wider text-grey-200 font-semibold ">
          Cookies:
        </h5>
        <h6 className=" text-xs tracking-wider text-grey-200 ">
          Witit may employ cookies and similar technologies to monitor and
          gather data about your usage of the Witit platform. You can manage the
          use of cookies via your browser settings.
        </h6>
        <h5 className=" text-xs tracking-wider text-grey-200 font-semibold ">
          Changes to Privacy Policy:
        </h5>
        <h6 className=" text-xs tracking-wider text-grey-200 ">
          Witit may periodically update this Privacy Policy. We recommend you
          review this policy regularly to stay informed about our practices.
          Your continued use of the Witit platform following any modifications
          indicates your acceptance of the updated Privacy Policy.
        </h6>
        <h5 className=" text-xs tracking-wider text-grey-200 font-semibold ">
          Contact Information:
        </h5>
        <h6 className=" text-xs tracking-wider text-grey-200 ">
          For any queries or concerns regarding this Privacy Policy or the Witit
          platform, please reach out to us at support@witit.com. Your privacy
          matters to us, and we&apos;re committed to addressing your concerns
          promptly.
        </h6>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
