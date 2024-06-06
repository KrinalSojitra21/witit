import { Grid } from "@mui/material";
import React, { useEffect, useState } from "react";
import { CategoryList } from "@/utils/constants/withHtml/CategoryList";
import {
  Control,
  ControllerProps,
  FieldPath,
  FieldValues,
  UseFormGetValues,
  UseFormHandleSubmit,
  UseFormSetValue,
} from "react-hook-form";
import { DefaultValues } from "@/types/createPostType";
import CustomInputTextField from "@/components/shared/CustomInputTextField";
import CustomLoadingButton from "@/components/shared/CustomLoadingButton";

type Props = {
  setValue: UseFormSetValue<Partial<DefaultValues>>;
  setStep: React.Dispatch<React.SetStateAction<number>>;
  getValues: UseFormGetValues<Partial<DefaultValues>>;
  handleSubmit: UseFormHandleSubmit<Partial<DefaultValues>>;
  handleSave: (data: Partial<DefaultValues>) => Promise<void>;
  isLoading: boolean;
  control: Control<Partial<DefaultValues>, any>;
  Controller: <
    TFieldValues extends FieldValues = FieldValues,
    TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
  >(
    props: ControllerProps<TFieldValues, TName>
  ) => import("react").ReactElement<
    any,
    string | import("react").JSXElementConstructor<any>
  >;
};
const styles = {
  responsiveGrid: {
    xxl: 4,
    xl: 4,
    // lg: 5,
    md: 4,
    sm: 8,
    xs: 12,
  },
};
const GenerationPostCategory = ({
  getValues,
  setValue,
  Controller,
  control,
  isLoading,
  handleSubmit,
  handleSave,
}: Props) => {
  const [getCategory, setGetCategory] = useState<String[]>([]);
  const [errorMessage, setErrorMessage] = useState<string>("");

  const handleCategory = (item: string, id: number) => {
    if (!getCategory.includes(item)) {
      setGetCategory([...getCategory, item]);
    } else {
      setGetCategory((preValue) => {
        return preValue.filter((value) => value !== item);
      });
    }
  };

  useEffect(() => {
    setValue("category", getCategory as string[]);
    setErrorMessage("");
  }, [getCategory]);

  return (
    <div className=" overflow-auto flex-grow justify-between ">
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
      <h6 className="font-normal tracking-wide text-sm  text-common-white mt-5">
        Category
      </h6>
      <Grid container spacing={1.5} columns={24} className="mt-2">
        {CategoryList.map((category, index) => {
          return (
            <Grid key={index} item {...styles.responsiveGrid}>
              <div
                className={`flex  justify-start px-2.5 gap-1.5 items-center py-3 w-full  rounded-lg cursor-pointer
       border border-grey-700   hover:text-common-white hover:bg-primary-main
       ${
         getCategory.find((item) => item === category.name)
           ? "bg-primary-main text-common-white"
           : "text-grey-200 bg-grey-800"
       }   
    `}
                onClick={() => {
                  handleCategory(category.name, index);
                }}
              >
                <p className=" scale-75 items-center">{category.startIcon}</p>
                <p className="text-sm select-none items-center">
                  {category.name}
                </p>
              </div>
            </Grid>
          );
        })}
      </Grid>
      <div className="w-full flex flex-col items-center justify-center ">
        <p className="text-error-main h-[10px] mb-3">{errorMessage}</p>
        <CustomLoadingButton
          loading={isLoading}
          name="Save"
          className="w-fit text-base font-semibold px-20 mt-[38px]"
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

export default GenerationPostCategory;
