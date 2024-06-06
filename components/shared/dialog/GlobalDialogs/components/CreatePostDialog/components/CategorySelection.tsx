import React, { useState } from "react";
import CustomInputTextField from "../../../../../CustomInputTextField";
import {
  Control,
  Controller,
  UseFormGetValues,
  UseFormHandleSubmit,
  UseFormSetValue,
} from "react-hook-form";
import CategoryListInfo from "./CategoryListInfo";
import { DefaultValues } from "@/types/createPostType";
import CustomLoadingButton from "@/components/shared/CustomLoadingButton";

type Props = {
  control: Control<Partial<DefaultValues>, any>;
  handleSubmit: UseFormHandleSubmit<Partial<DefaultValues>>;
  handleSave: (data: Partial<DefaultValues>) => Promise<void>;
  setValue: UseFormSetValue<Partial<DefaultValues>>;
  isLoading: Boolean;
  getValues: UseFormGetValues<Partial<DefaultValues>>;
};
const CategorySelection = ({
  getValues,
  control,
  handleSubmit,
  handleSave,
  setValue,
  isLoading,
}: Props) => {
  const [errorMessage, setErrorMessage] = useState<string>("");
  return (
    <div className="w-full h-full flex gap-5 flex-col p-6">
      <div>
        <Controller
          name="caption"
          control={control}
          render={({ field }) => {
            return (
              <CustomInputTextField
                onChange={field.onChange}
                placeholder="Write Caption"
                tag="Caption"
                multiline
                rows={3}
              />
            );
          }}
        />
      </div>
      <div className="flex flex-col">
        <h6 className="font-normal tracking-wide text-sm  text-common-white">
          Category
        </h6>
        <Controller
          name="category"
          control={control}
          render={() => {
            return (
              <>
                <CategoryListInfo
                  setValue={setValue}
                  setErrorMessage={setErrorMessage}
                />
              </>
            );
          }}
        />
      </div>
      <div className="w-full flex flex-col items-center justify-center px-16 ">
        <p className="text-error-main h-[10px] mb-3">{errorMessage}</p>
        <CustomLoadingButton
          loading={isLoading}
          name="Save"
          className="w-fit text-base font-semibold px-20 py-3 mt-[20px]"
          handleEvent={() => {
            if (getValues("category") && getValues("category")!.length < 1) {
              setErrorMessage("Please Select Category");
              return;
            }
            handleSubmit(handleSave)();
          }}
        />
      </div>
    </div>
  );
};

export default CategorySelection;
