import CustomButton from "@/components/shared/CustomButton";
import { theme } from "@/theme";
import { AiApplication } from "@/types/ai";
import { Divider } from "@mui/material";
import dayjs from "dayjs";
import React from "react";

type Props = {
  application: AiApplication;
};
const ApplicationItem = ({ application }: Props) => {
  return (
    <div className="bg-grey-800  flex-col flex p-5 rounded-lg gap-3">
      <div className="bg-grey-800 flex justify-between gap-1 rounded-lg ">
        <div className=" flex flex-col gap-1">
          <p>{application.modelName}</p>
          <p className=" text-xs text-grey-400">
            Created On {dayjs(application.createdAt).format("DD MMM, YYYY")}
          </p>
        </div>
        <CustomButton
          name={application.applicationStatus}
          className={`w-fit bg-grey-800 text-sm rounded-lg font-normal px-5 ${
            application.applicationStatus === "APPROVED"
              ? "text-success-main border-success-main border border-solid"
              : application.applicationStatus === "PENDING"
              ? "text-orange-main border-orange-main border border-solid"
              : application.applicationStatus === "REJECTED"
              ? "text-error-main  border-error-main border border-solid"
              : "text-primary-main  border-primary-main border border-solid"
          } border-opacity-10`}
        />
      </div>
      {application.applicationStatus === "REJECTED" ? (
        <div className=" flex flex-col gap-3">
          <Divider
            sx={{
              borderWidth: "0.2px",
              borderColor: theme.palette.grey[500],
            }}
          />
          <p className="text-xs font-extralight tracking-wider text-error-main">
            {application.message}
          </p>
        </div>
      ) : null}
    </div>
  );
};

export default ApplicationItem;
