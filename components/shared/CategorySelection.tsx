import { useAuthContext } from "@/context/AuthContext";
import { RootState } from "@/redux/store";
import { theme } from "@/theme";
import { CategoryList } from "@/utils/constants/withHtml/CategoryList";
import { Tooltip } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

type Props = {
  sendSelectedCategoryList: (list: string[]) => void;
  setEmpty?: boolean;
};

const CategorySelection = ({ sendSelectedCategoryList, setEmpty }: Props) => {
  const { setDiscoverSearch } = useAuthContext();
  const [selectedCategoryList, setSelectedCategoryList] = useState<string[]>(
    []
  );
  const user = useSelector((state: RootState) => state.user);

  useEffect(() => {
    sendSelectedCategoryList(selectedCategoryList);
  }, [selectedCategoryList]);

  useEffect(() => {
    if (setEmpty) {
      setSelectedCategoryList([]);
    }
  }, [setEmpty]);

  return (
    <div className="py-4">
      <div className="h-full flex flex-col justify-between p-3 bg-grey-800 rounded-md cursor-pointer">
        {CategoryList.map((item, index) => {
          return (
            <>
              {index + 1 === CategoryList.length && !user?.NSFW ? null : (
                <div key={index}>
                  <Tooltip
                    key={index}
                    title={item.name}
                    disableInteractive={true}
                    arrow
                    placement="right"
                    onClick={() => {
                      setDiscoverSearch({ search: null });
                      setSelectedCategoryList((prev) => {
                        if (prev.includes(item.name)) {
                          return prev.filter(
                            (category) => category !== item.name
                          );
                        } else {
                          return [...prev, item.name];
                        }
                      });
                    }}
                    componentsProps={{
                      tooltip: {
                        sx: {
                          paddingX: 1.5,
                          paddingY: 0.8,
                          bgcolor: theme.palette.primary.main,
                          "& .MuiTooltip-arrow": {
                            color: theme.palette.primary.main,
                          },
                        },
                      },
                    }}
                  >
                    <div className="w-[20px] h-[20px] flex justify-center items-center rounded-sm">
                      <div
                        className={`${
                          selectedCategoryList &&
                          selectedCategoryList.includes(item.name)
                            ? " text-common-white bg-primary-main hover:text-common-white"
                            : "text-grey-300 bg-auto hover:text-primary-main"
                        }     p-2 rounded-md scale-75`}
                      >
                        {item.startIcon}
                      </div>
                    </div>
                  </Tooltip>
                </div>
              )}
            </>
          );
        })}
      </div>
    </div>
  );
};

export default CategorySelection;
