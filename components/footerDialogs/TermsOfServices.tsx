import React from "react";
import CustomDialogCommonTopBar from "../shared/dialog/GlobalDialogs/components/shared/CustomDialogCommonTopBar";
type Props = {
  onCancel?: () => void;
};

const TermsOfServices = ({ onCancel }: Props) => {
  return (
    <div className=" flex flex-col">
      <CustomDialogCommonTopBar title="Terms Of Services" onCancel={onCancel} />

      <div className="flex flex-col gap-4 p-5 overflow-auto flex-grow">
        <p className=" text-xs tracking-wider text-grey-200 font-semibold ">
          What is NSFW Content?
        </p>
        <h6 className=" text-xs tracking-wider text-grey-200 ">
          NSFW is an abbreviation for the phrases such as: “Not Safe For Wife”,
          “Not Suitable For Work”, but mostly used as “Not Safe For Work”
        </h6>
        <h6 className=" text-xs tracking-wider text-grey-200 ">
          It is an internet slang that is often used to describe internet posts
          and content that is mainly involves nudity, sexual activity, heavy
          profanity and more...
        </h6>
        <h6 className=" text-xs tracking-wider text-grey-200 ">
          With Witit, we want to provide a safe place for people to freely
          express art or interests that they couldn’t otherwise share on other
          platforms. However doing so comes with some requirements, such as
          needing to turn on the ability to see and post NSFW content.
        </h6>
        <h6 className=" text-xs tracking-wider text-grey-200 ">
          NSFW is also not a free pass to post anything you want, we at Witit
          just allow you fewer restricts than our social media companions. We
          still do not tolerate obscene violence or illegal activity of any
          sort.
        </h6>
        <h6 className=" text-xs tracking-wider text-grey-200 ">
          Accounts that post NSFW content have been marked with a red
          verification badge.
        </h6>
      </div>
    </div>
  );
};

export default TermsOfServices;
