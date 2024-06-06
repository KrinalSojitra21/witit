import { useAuthContext } from "@/context/AuthContext";
import React, { ReactNode, useEffect, useState } from "react";
import ReportDialog from "../ReportDialog";
import DrawerContext, {
  useDrawerContext,
} from "./GlobalDrawers/context/DrawerContext";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { reportOffer } from "@/api/offering/reportOffer";

type Props = {
  position: "LEFT" | "RIGHT";
  children: ReactNode;
  isOpen?: boolean;
  onCancel?: () => void;
} & Record<string, any>;

const CustomDrawer = ({ children, position, isOpen, onCancel }: Props) => {
  const user = useSelector((state: RootState) => state.user);

  const { customDrawerType, sendNotification } = useAuthContext();
  const { reportOfferId, setReportOfferId } = useDrawerContext();

  const [anchor, setAnchor] = useState<"LEFT" | "RIGHT">(position);

  useEffect(() => {
    if (customDrawerType === "HYPE") {
      setAnchor("RIGHT");
    } else if (customDrawerType === "CREATOR") {
      setAnchor("LEFT");
    }
  }, [customDrawerType]);

  const submitReport = async (inputText: string) => {
    if (!user || !reportOfferId) return;

    const res = await reportOffer({
      user_id: user.userId,
      body: { reportFor: inputText, offerId: reportOfferId },
    });

    if (res.status === 200) {
      setReportOfferId(null);

      sendNotification({
        type: "SUCCESS",
        message: "Report Submitted Successfully",
      });
      return;
    }
    sendNotification({ type: "ERROR", message: res.error });
  };

  return (
    <div className="w-full h-full absolute right-0 top-0">
      {customDrawerType !== null || isOpen ? (
        <div
          className={`w-full h-full bg-secondary-light  absolute top-0 z-40`}
          onClick={onCancel}
        ></div>
      ) : null}
      <div
        className={` overflow-x-hidden ${
          anchor === "RIGHT"
            ? "w-[450px] border-l  "
            : anchor === "LEFT"
            ? "w-[450px] border-r  "
            : "w-[0%] "
        }  transition-all duration-[800ms] absolute z-40 ${
          anchor === "RIGHT" ? "right-0 " : anchor === "LEFT" ? "left-0" : ""
        } top-0 bottom-0  bg-secondary-main border-grey-500`}
      >
        {children}
      </div>
      {reportOfferId ? (
        <div className="absolute top-0 w-full h-full z-50">
          <ReportDialog
            isOpen={true}
            title="Report"
            buttonName="Report"
            inputField={{
              limit: 10,
              tag: "Why is this inappropriate for Witit?",
              placeholder: "What seems to be the problem...",
            }}
            onConform={(inputText) => submitReport(inputText)}
            onCancel={() => {
              setReportOfferId(null);
            }}
          />
        </div>
      ) : null}
    </div>
  );
};

export default CustomDrawer;
