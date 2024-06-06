import { getDayFromTimeStamp } from "@/service/shared/getDayFromTimeStamp";
import { theme } from "@/theme";
import { Divider } from "@mui/material";
import { ImageContainer } from "./components/ImageContainer";
import { ModelContainer } from "./components/ModelContainer";
import { GetAiGeneration } from "@/types/ai";
import React, { useEffect, useState } from "react";

type DayItem = {
  id: string;
  day: string;
};

type Props = {
  generation: GetAiGeneration;
  listOfDays: DayItem[];
  setListOfDays: React.Dispatch<React.SetStateAction<DayItem[]>>;
};

export const GenerationItem = ({
  generation,
  listOfDays,
  setListOfDays,
}: Props) => {
  const getDayFromGenerationTime = (time: string) => {
    const resDay = getDayFromTimeStamp({ time });

    if (listOfDays.filter((item) => item.day === resDay).length === 0) {
      setListOfDays((preDays) => {
        return [...preDays, { id: generation.Id, day: resDay }];
      });
    } else {
      const updatedListItems: DayItem[] = listOfDays.map((item) => {
        if (item.day === resDay) {
          return { ...item, id: generation.Id };
        }
        return item;
      });

      setListOfDays(updatedListItems);
    }
  };

  useEffect(() => {
    const resDay = getDayFromGenerationTime(generation.createdAt);

    return () => resDay;
  }, []);

  return (
    <>
      <div id={generation.Id} className="flex flex-col gap-5 pb-5">
        <ModelContainer generation={generation} />
        <ImageContainer generation={generation} />
      </div>
      {/* {listOfDays.filter((item) => item.id === generation.Id).length > 0 ? (
        <Divider
          sx={{
            paddingY: 3,
            color: theme.palette.grey[500],
            "&::before, &::after": {
              borderColor: theme.palette.grey[500],
            },
          }}
          className="sticky top-0"
        >
          {listOfDays.filter((item) => item.id === generation.Id)[0].day}
        </Divider>
      ) : null} */}
    </>
  );
};
