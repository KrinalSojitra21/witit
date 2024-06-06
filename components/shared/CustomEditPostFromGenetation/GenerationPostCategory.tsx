import { Grid } from "@mui/material";
import React, { ChangeEvent, useEffect, useState } from "react";
import { CategoryList } from "@/utils/constants/withHtml/CategoryList";
import CustomInputTextField from "@/components/shared/CustomInputTextField";
import CustomLoadingButton from "@/components/shared/CustomLoadingButton";
import { OwnerPost } from "@/types/post";

type Props = {
  setStep: React.Dispatch<React.SetStateAction<number>>;

  handleSave: (data: Partial<OwnerPost>) => Promise<void>;
  defaultValues: Partial<OwnerPost> | undefined;
  isLoading: boolean;

  setDefaultValues: React.Dispatch<
    React.SetStateAction<Partial<OwnerPost> | undefined>
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
  setDefaultValues,
  isLoading,
  defaultValues,
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
    if (
      defaultValues &&
      defaultValues.category &&
      defaultValues.category.length >= 1
    ) {
      setGetCategory(defaultValues.category);

      return;
    }
  }, []);
  useEffect(() => {
    setDefaultValues({ ...defaultValues, category: getCategory as string[] });
    setErrorMessage("");
  }, [getCategory]);

  return (
    <div className=" overflow-auto flex-grow justify-between ">
      <div>
        <CustomInputTextField
          value={defaultValues?.caption}
          onChange={(e: ChangeEvent<HTMLInputElement>) => {
            setDefaultValues({
              ...defaultValues,
              caption: e.target.value,
            });
          }}
          placeholder="Write Caption"
          tag="Caption"
          multiline
          rows={3}
        />
      </div>
      <h6 className="font-normal tracking-wide text-sm mt-[18px] text-common-white">
        Category
      </h6>
      <Grid container spacing={1.5} columns={24} className="mt-[14px]">
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
      <div className="w-full flex flex-col items-center justify-center px-16 pt-10">
        <p className="text-error-main h-[10px] mb-3">{errorMessage}</p>
        <CustomLoadingButton
          name="Save"
          loading={isLoading}
          className="w-fit text-base font-semibold px-20 py-3 mt-1"
          handleEvent={() => {
            if (defaultValues?.category && defaultValues.category!.length < 1) {
              setErrorMessage("Please Select Category");
              return;
            }
            if (defaultValues) {
              handleSave(defaultValues);
              return;
            }
          }}
        />
      </div>
    </div>
  );
};

export default GenerationPostCategory;
