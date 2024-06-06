
import React from "react";
import CustomDialogCommonTopBar from "../shared/dialog/GlobalDialogs/components/shared/CustomDialogCommonTopBar";

type Props = {
  onCancel: () => void;
};
const ContentPolicy = ({ onCancel }: Props) => {
  return (
    <div className="text-common-white max-h-[650px] flex flex-col   max-w-[650px]  h-full">
      <CustomDialogCommonTopBar title="Content Policy" onCancel={onCancel} />

      <div className="p-5 gap-4  flex flex-col flex-grow overflow-auto">
        <h5 className="text-xs tracking-wider text-grey-200 font-semibold">
          Introduction:
        </h5>
        <h6 className="text-xs tracking-wider text-grey-200">
          Witit is a social media platform leveraging artificial intelligence
          (“AI”) to enable users to create and share distinctive content, such
          as AI-generated photographs. We aim to create a safe, respectful
          community and uphold standards for appropriate content. This Content
          Policy guides users in understanding the type of content that can be
          shared on the platform, in alignment with all applicable laws and
          regulations.
        </h6>{" "}
        <h5 className="text-xs tracking-wider text-grey-200 font-semibold">
          Prohibited Content:
        </h5>
        <h6 className="text-xs tracking-wider text-grey-200">
          To maintain a positive user experience, we prohibit sharing of content
          that is illegal, harmful, threatening, abusive, harassing, defamatory,
          obscene, or offensive, which includes but is not limited to:
        </h6>
        <ul className="list ml-10 text-xs tracking-wider text-grey-200 ">
          <li>
            Content promoting or glorifying hate, violence, or discrimination
            based on race, ethnicity, religion, gender, sexual orientation, or
            any other characteristic.
          </li>
          <li>Content depicting or glorifying violence or self-harm.</li>
          <li>Harassing, bullying, or defamatory content.</li>
          <li>Illegal content or content encouraging illegal activities.</li>
          <li>
            Content infringing on the intellectual property rights of third
            parties.
          </li>
        </ul>
        <h6 className="text-xs tracking-wider text-grey-200">
          Witit retains the right to remove any content that violates this
          Content Policy and may terminate the accounts of users engaging in
          prohibited conduct.
        </h6>
        <h5 className="text-xs tracking-wider text-grey-200 font-semibold">
          Reporting Prohibited Content:
        </h5>
        <h6 className="text-xs tracking-wider text-grey-200">
          If you come across content you believe infringes upon this Content
          Policy, please report it to us at support@witit.com. We&apos;ll review
          all reported content and take appropriate action, including, but not
          limited to, removing the content or terminating the user&apos;s
          account.
        </h6>
        <h5 className="text-xs tracking-wider text-grey-200 font-semibold">
          Disclaimer of Responsibility:
        </h5>
        <h6 className="text-xs tracking-wider text-grey-200">
          While we aim to provide a safe platform, Witit is not responsible for
          content uploaded, posted, or shared by its users. We do not endorse or
          guarantee the accuracy, completeness, or reliability of any content.
          Users bear the responsibility for their own content and the
          repercussions of sharing it.
        </h6>{" "}
        <h5 className="text-xs tracking-wider text-grey-200 font-semibold">
          Use of AI-generated Content:
        </h5>
        <h6 className="text-xs tracking-wider text-grey-200">
          Content created using our AI is subject to the same guidelines as any
          other user-generated content on our platform. Users are solely
          responsible for how they use and share AI-generated content.
        </h6>{" "}
        <h5 className="text-xs tracking-wider text-grey-200 font-semibold">
          Verification and Training Data:
        </h5>
        <h6 className="text-xs tracking-wider text-grey-200">
          As part of our user verification process, we may use identification
          documents and personal photos. However, these are used strictly for
          verification and AI training and must not be shared or posted as
          content on our platform.
        </h6>
        <h5 className="text-xs tracking-wider text-grey-200 font-semibold">
          Changes to Content Policy:
        </h5>
        <h6 className="text-xs tracking-wider text-grey-200">
          Witit reserves the right to amend this Content Policy as required. We
          encourage users to review this policy regularly to stay informed about
          changes. Continued use of the Witit platform after modifications
          implies acceptance of the revised Content Policy.
        </h6>
        <h5 className="text-xs tracking-wider text-grey-200 font-semibold">
          Contact Information:
        </h5>
        <h6 className="text-xs tracking-wider text-grey-200">
          Should you have any queries or concerns related to this Content Policy
          or the Witit platform, kindly reach out to us at support@witit.com.
        </h6>
      </div>
    </div>
  );
};

export default ContentPolicy;
