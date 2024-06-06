import React, { useState } from "react";
import CustomInputTextField from "../shared/CustomInputTextField";
import { useAuthContext } from "@/context/AuthContext";
import CustomDialogCommonTopBar from "../shared/dialog/GlobalDialogs/components/shared/CustomDialogCommonTopBar";
import { SelectDropDown } from "../shared/dropDown/SelectDropDown";
import { Controller, useForm } from "react-hook-form";
import CustomLoadingButton from "../shared/CustomLoadingButton";
import sendSupportEmail from "@/api/support/sendSupportEmail";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

const info = ["General", "Account", "Contact", "NSFW Content", "About Witit"];
type Props = {
  onCancel: () => void;
};

const ContactUs = ({ onCancel }: Props) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const {
    handleSubmit,
    control,
    setValue,
    getValues,
    formState: { errors },
  } = useForm({
    defaultValues: {
      subject: "General",
      message: "",
    },
  });
  const { sendNotification } = useAuthContext();
  const user = useSelector((state: RootState) => state.user);

  const handleSelect = (target: string) => {
    setValue("subject", target);
  };

  const sendContact = async (data: { message: string; subject: string }) => {
    setIsLoading(true);
    if (!user) {
      return;
    }
    const response = await sendSupportEmail({ data, user_Id: user.userId });
    if (response.status === 200) {
      sendNotification({ type: "SUCCESS", message: "Email Send Successfully" });
      setIsLoading(false);
      onCancel();
      return;
    }
    setIsLoading(false);
    sendNotification({ type: "ERROR", message: response.error });
  };

  return (
    <div className="text-common-white  flex flex-col justify-between h-full  max-w-[650px] max-h-[90%] ">
      <CustomDialogCommonTopBar title="Contact Us" onCancel={onCancel} />
      <div className="p-5 gap-3 flex-grow  flex flex-col overflow-auto ">
        <div className="mb-[20px]">
          <h6 className=" font-normal pb-[16px] tracking-wide text-sm ">
            Subject
          </h6>
          <SelectDropDown
            listItems={info}
            inputAreaStyle="bg-grey-800 py-[1rem] mt- w-full cursor-pointer"
            handleItemSelect={handleSelect}
            getValues={getValues}
          />
        </div>

        <div className="mb-[14px]">
          <Controller
            name="message"
            rules={{
              required: {
                value: true,
                message: "Fill required",
              },
            }}
            control={control}
            render={({ field }) => {
              return (
                <>
                  <CustomInputTextField
                    {...field}
                    className={`border`}
                    placeholder="Enter Your Text"
                    tag="What’s This About?"
                    multiline
                    rows={3}
                  />
                </>
              );
            }}
          />
          <p className="h-[6px] mt-[4px] text-xs text-error-main">
            {errors.message?.message}
          </p>
        </div>
        <p className="text-xs tracking-wider  text-grey-200">
          We value all of our users, their thoughts, concerns, and support.
          However we aren’t able to get back to everyone. We will do our best to
          review your message as soon as we can.
        </p>
      </div>

      <div className="flex justify-end p-5">
        <CustomLoadingButton
          loading={isLoading}
          name="Send"
          className="bg-primary-main rounded-lg px-8 py-3 text-sm w-[150px]"
          handleEvent={() => {
            handleSubmit(sendContact)();
          }}
        />
      </div>
    </div>
  );
};

export default ContactUs;
