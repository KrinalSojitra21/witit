import React, { useEffect, useState } from "react";
import CustomDialog from "./dialog/CustomDialog";
import CustomButton from "./CustomButton";
import CustomDialogCommonTopBar from "./dialog/GlobalDialogs/components/shared/CustomDialogCommonTopBar";
import OutLinedAlertIcon from "@/utils/icons/shared/OutLinedAlertIcon";
import CustomInputTextField from "./CustomInputTextField";
import { Controller, useForm } from "react-hook-form";

type Props = {
  isOpen?: boolean;
  onCancel: () => void;
  onConform: (inputText: string) => void;
  image?: string;
  title?: string;
  buttonName?: string;
  inputField?: {
    limit: number;
    tag: string;
    placeholder: string;
  };
};
const ReportDialog = ({
  isOpen,
  onConform,
  onCancel,
  title,
  inputField,
  buttonName,
}: Props) => {
  const {
    handleSubmit,
    control,
    getValues,
    formState: { errors, isSubmitted },
  } = useForm({
    defaultValues: {
      reportText: "",
    },
    mode: "onChange",
  });

  return (
    <>
      <CustomDialog isOpen={isOpen} className=" border-2 w-[450px] h-fit">
        <form
          onSubmit={handleSubmit(() => {
            inputField &&
              getValues().reportText.length >= inputField.limit &&
              onConform(getValues().reportText);
          })}
          method="POST"
        >
          {title && (
            <CustomDialogCommonTopBar
              startIcon={<OutLinedAlertIcon />}
              title={title}
              onCancel={onCancel}
            />
          )}

          <div className="flex flex-col h-full justify-between  items-end">
            {inputField && (
              <div className="w-full flex flex-col p-5">
                <Controller
                  name="reportText"
                  control={control}
                  rules={{
                    required: {
                      value: true,
                      message: "Reporting Text required",
                    },
                    minLength: {
                      value: 10,
                      message: "Reporting Text must be atleast 10 characters",
                    },
                  }}
                  render={({ field }) => (
                    <CustomInputTextField
                      {...field}
                      multiline
                      minRows={6}
                      error={isSubmitted && errors?.reportText?.message}
                      tag={inputField.tag}
                      placeholder="What seems to be the problem..."
                    />
                  )}
                />
              </div>
            )}
            <div className="flex gap-4 w-full p-5">
              {inputField && (
                <CustomButton
                  name={buttonName ? buttonName : "Save"}
                  // onClick={() => {
                  //   getValues().reportText.length >= inputField.limit &&
                  //     onConform(getValues().reportText);
                  // }}
                  type="submit"
                  className={`border-[#E15F60] text-[#E15F60] bg-[#e15f5f1d] border border-solid   rounded-lg  text-sm  py-2.5 hover:bg-opacity-80	`}
                />
              )}
            </div>
          </div>
        </form>
      </CustomDialog>
    </>
  );
};

export default ReportDialog;
