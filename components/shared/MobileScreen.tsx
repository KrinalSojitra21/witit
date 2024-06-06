import TriangleAlertIcon from "@/utils/icons/shared/TriangleAlertIcon";
import React from "react";

const MobileScreen = () => {
  return (
    <div className=" w-full h-full flex flex-col justify-center items-center">
      <div className="flex flex-col items-center gap-5">
        <div className=" h-12 w-12  flex flex-col items-center justify-center">
          <div className="scale-[2] text-error-main">
            <TriangleAlertIcon />
          </div>
        </div>
        <p className=" text-2xl font-semibold">Go to the App</p>
        <p className=" text-center w-[80%] text-grey-300 text-sm">
          This link is supported only for large screen. you can operate it on
          large screen or use the <br />
          <a
            href="https://apps.apple.com/us/app/witit/id6445992339"
            target="_blank"
            className=" text-blue-light font-semibold underline"
          >
            witit app
          </a>
        </p>
      </div>
    </div>
  );
};

export default MobileScreen;
