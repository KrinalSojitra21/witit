import React, { useEffect, useState } from "react";

import { useAuthContext } from "@/context/AuthContext";
import { Post } from "@/types/post";
import { Controller, DefaultValues } from "react-hook-form";
import CustomInputTextField from "@/components/shared/CustomInputTextField";

import CustomLoadingButton from "@/components/shared/CustomLoadingButton";
import { CategoryList } from "@/utils/constants/withHtml/CategoryList";
import { Grid } from "@mui/material";
import PlusIcon from "@/utils/icons/shared/PlusIcon";

import { updatePost } from "@/api/post/updatePost";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import CustomDialog from "@/components/shared/dialog/CustomDialog";
import CustomDialogCommonTopBar from "@/components/shared/dialog/GlobalDialogs/components/shared/CustomDialogCommonTopBar";
import { useRouter } from "next/router";
import { updateUserPost } from "@/redux/slices/userPostSlice";
import { updateDiscoverPost } from "@/redux/slices/discoverFeedSlice";
import { updateSimilarDiscoverPost } from "@/redux/slices/discoverSimilarFeedSlice";
import { updateCirclePost } from "@/redux/slices/circleFeedSlice";

type Props = {
  editedValue?: Post | null;
  isOpenEditPost: boolean;
  setIsOpenEditPost: React.Dispatch<React.SetStateAction<boolean>>;
  
};

const EditPostDialog = ({
  editedValue,
  isOpenEditPost,
  setIsOpenEditPost,
}: Props) => {
  const [isLoading, setIsloading] = useState<boolean>(false);
  const [getCategory, setGetCategory] = useState<string[]>([]);
  const [caption, setCaption] = useState<string | null>("");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const { setCustomDialogType, sendNotification } = useAuthContext();
  const router = useRouter();

  const user = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch();
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
  useEffect(() => {
    if (
      editedValue &&
      editedValue.category &&
      editedValue.category.length >= 1
    ) {
      setGetCategory(editedValue.category);

      return;
    }
  }, []);
  useEffect(() => {
    if (editedValue?.caption) {
      setCaption(editedValue.caption);
    }
  }, []);
  const handleCategory = (item: string) => {
    if (!getCategory.includes(item)) {
      setGetCategory([...getCategory, item]);
    } else {
      setGetCategory((preValue) => {
        return preValue.filter((value) => value !== item);
      });
    }
  };

  const fetchData = async () => {
    if (!editedValue) {
      return;
    }
    setIsloading(true);
    const data = {
      postId: editedValue.postId,
      category: getCategory,
      caption:caption?? null,
    };
    const response = await updatePost({ user_id: user?.userId, data });
    if (response.status === 200) {
      sendNotification({
        type: "SUCCESS",
        message: "Post updated Successfuly",
      });
      setIsloading(false);
      dispatch(updateSimilarDiscoverPost(data));
      dispatch(updateCirclePost(data));
      dispatch(updateUserPost(data));
      setIsOpenEditPost(false);
      return;
    }
    setIsloading(false);
    sendNotification({ type: "ERROR", message: response.error });
  };

  return (
    <CustomDialog
      className="w-full  h-fit  flex flex-col gap-2  max-h-[630px]  justify-start items-center"
      isOpen={isOpenEditPost}
      onCancel={() => {
        setIsOpenEditPost(false);
      }}
    >
      <CustomDialogCommonTopBar
        onCancel={() => {
          setIsOpenEditPost(false);
        }}
        title="Edit Post"
      />
      <div className="w-full h-full flex  flex-col px-5 py-2 pb-5">
        <div>
          <CustomInputTextField
            placeholder="Write Caption"
            tag="Caption"
            value={caption}
            multiline
            rows={3}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              setCaption(event.target.value);
            }}
          />
        </div>
        <div className="flex flex-col gap-3">
          <h6 className="font-normal tracking-wide text-sm mt-2 text-common-white">
            Category
          </h6>

          <div className=" overflow-auto flex-grow">
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
                        handleCategory(category.name);
                      }}
                    >
                      <p className=" scale-75 items-center  ">
                        {category.startIcon}
                      </p>
                      <p className="text-sm select-none items-center">
                        {category.name}
                      </p>
                    </div>
                  </Grid>
                );
              })}
            </Grid>
          </div>
        </div>
        <div className="w-full flex flex-col items-center justify-center px-16 pt-10">
          <p className="text-error-main h-[10px] mb-3">{errorMessage}</p>
          <CustomLoadingButton
            loading={isLoading}
            name="Save"
            className="w-fit text-base font-semibold px-20 py-3 mt-2"
            handleEvent={() => {
              if (getCategory.length < 1) {
                setErrorMessage("Please Select Category");
                return;
              }
              fetchData();
              setCustomDialogType(null);
            }}
          />
        </div>
      </div>
    </CustomDialog>
  );
};

export default EditPostDialog;
