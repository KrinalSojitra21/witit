import { Grid } from "@mui/material";
import React, { useEffect, useState } from "react";
import { CategoryList } from "@/utils/constants/withHtml/CategoryList";
import { ControllerRenderProps, UseFormSetValue } from "react-hook-form";
import { Post } from "@/types/post";
import { DefaultValues } from "@/types/createPostType";

type Props = {
  setValue: UseFormSetValue<Partial<DefaultValues>>;
  setErrorMessage: React.Dispatch<React.SetStateAction<string>>;
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
const CategoryListInfo = ({ setValue, setErrorMessage }: Props) => {
  const [getCategory, setGetCategory] = useState<String[]>([]);

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
  }, [getCategory]);

  return (
    <div className=" overflow-auto flex-grow mt-5">
      <Grid container spacing={1.5} columns={24}>
        {CategoryList.map((category, index) => {
          return (
            <Grid key={index} item {...styles.responsiveGrid}>
              <div
                className={`flex justify-start px-2.5 gap-1.5 items-center py-3 w-full  rounded-lg cursor-pointer
       border border-grey-700   hover:text-common-white hover:bg-primary-main
       ${
         getCategory.find((item) => item === category.name)
           ? "bg-primary-main text-common-white"
           : "text-grey-200 bg-grey-800"
       }   
    `}
                onClick={() => {
                  setErrorMessage("");
                  handleCategory(category.name, index);
                }}
              >
                <p className=" scale-75 items-center  ">{category.startIcon}</p>
                <p className="text-sm select-none items-center">
                  {category.name}
                </p>
              </div>
            </Grid>
          );
        })}
      </Grid>
    </div>
  );
};

export default CategoryListInfo;
