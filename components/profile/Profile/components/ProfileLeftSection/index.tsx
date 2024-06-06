import React, { useEffect, useState } from "react";
import { useAuthContext } from "@/context/AuthContext";
import LinkCopyIcon from "@/utils/icons/shared/LinkCopyIcon";
import BlockIcon from "@/utils/icons/shared/BlockIcon";
import OutLinedAlertIcon from "@/utils/icons/shared/OutLinedAlertIcon";
import { IconDropDown } from "@/components/shared/dropDown/IconDropDown";
import { Box } from "@mui/material";
import LogoutIcon from "@/utils/icons/shared/LogoutIcon";
import { RootState } from "@/redux/store";
import { useSelector } from "react-redux";
import { DropDownItem } from "@/types";
import { blockOrUnblockUser } from "@/api/user/blockOrUnblockUser";
import { ProfileInfo } from "../ProfileInfo";
import { Members } from "../Members";
import Offering from "../Offering";
import { useProfileContext } from "../../context/ProfileContext";
import ConfirmationDialog from "@/components/shared/ConfirmationDialog";
import ReportDialog from "@/components/shared/ReportDialog";
import { reportUser } from "@/api/user/reportUser";

type Props = {
  handleUser: () => void;
};

const ProfileLeftSection = ({ handleUser }: Props) => {
  const { currentUser, setCurrentUser } = useProfileContext();

  const user = useSelector((state: RootState) => state.user);
  const { setToLogout, sendNotification } = useAuthContext();

  const [contentType, setContentType] = useState<"MEMBERS" | "OFFERING">(
    "MEMBERS"
  );
  const [menuList, setmenuList] = useState<DropDownItem[]>([]);
  const [isBlockDialogOpen, setIsBlockDialogOpen] = useState(false);
  const [isReportDialogOpen, setIsReportDialogOpen] = useState(false);

  const handleItemSelect = (type: string) => {
    if (type === "LOG_OUT") {
      setToLogout();
    }
    if (type === "COPY_PROFILE") {
      handleCopyProfile();
    }
    if (type === "BLOCK") {
      setIsBlockDialogOpen(true);
    }
    if (type === "REPORT") {
      setIsReportDialogOpen(true);
    }
  };

  const blockUser = async () => {
    if (!user) return;
    if (!currentUser) return;

    const res = await blockOrUnblockUser({
      user_id: user?.userId,
      data: {
        isBlock: true,
        blockedUserId: currentUser.userId,
      },
    });
    setIsBlockDialogOpen(false);

    // setCurrentUser(null);
    if (res.status === 200) {
      handleUser();
      // setCurrentUser(null);
      // getUserData(userId);
      return;
    }
    sendNotification({ type: "ERROR", message: res.error });
  };

  const handleCopyProfile = () => {
    // Copy profile link
    navigator.clipboard.writeText(
      "https://witit.com/profile/" + currentUser?.userId
    );

    sendNotification({ type: "SUCCESS", message: "Profile Link Coppied!!" });
  };

  const submitReport = async (inputText: string) => {
    if (!user) return;
    if (!currentUser) return;

    const res = await reportUser({
      user_id: user.userId,
      data: { reportFor: inputText, reportedUserId: currentUser.userId },
    });

    if (res.status === 200) {
      setIsReportDialogOpen(false);

      sendNotification({
        type: "SUCCESS",
        message: "Report Submitted Successfully",
      });
    } else {
      sendNotification({ type: "ERROR", message: res.error });
    }
  };

  useEffect(() => {
    const baseMenu = [];

    if (currentUser?.userId === user?.userId) {
      baseMenu.push({
        startIcon: (
          <div className="scale-75">
            <LogoutIcon />
          </div>
        ),
        title: "Logout",
        actionType: "LOG_OUT",
      });
    } else {
      baseMenu.push({
        startIcon: <OutLinedAlertIcon />,
        title: "Report",
        actionType: "REPORT",
      });
      if (!currentUser?.blockedBy) {
        baseMenu.push({
          startIcon: (
            <div className="scale-90">
              <BlockIcon />
            </div>
          ),
          title: "Block",
          actionType: "BLOCK",
          isMyProfileOption: false,
        });
      }
    }
    baseMenu.push({
      startIcon: (
        <div className="scale-90">
          <LinkCopyIcon />
        </div>
      ),
      actionType: "COPY_PROFILE",
      title: "Copy Profile Link",
      isMyProfileOption: false,
    });
    setmenuList(baseMenu);
  }, [currentUser]);

  return (
    <>
      <Box
        sx={{ boxShadow: "13px 4px 54px 0px rgba(0, 0, 0, 0.20)" }}
        className="w-[450px] h-full bg-grey-900 items-center flex flex-col rounded-lg overflow-hidden relative"
      >
        <div className="flex gap-2 absolute top-0 right-0 p-2 z-10 cursor-pointer">
          <IconDropDown
            listItems={menuList}
            position={{ vertical: "top", horizontal: "left" }}
            handleItemSelect={handleItemSelect}
          />
        </div>
        <div className="items-center flex flex-col gap-2.5 p-5 relative ">
          <ProfileInfo
            setContentType={setContentType}
            contentType={contentType}
          />
        </div>
        <div className="flex-grow flex flex-col gap-3 w-full bg-grey-800 rounded-t-2xl overflow-hidden">
          {contentType === "MEMBERS" ? <Members /> : <Offering />}
        </div>
      </Box>

      {isReportDialogOpen ? (
        <ReportDialog
          isOpen={isReportDialogOpen}
          title="Report"
          buttonName="Report"
          inputField={{
            limit: 10,
            tag: "Why is this inappropriate for Witit?",
            placeholder: "What seems to be the problem...",
          }}
          onConform={(inputText) => submitReport(inputText)}
          onCancel={() => {
            setIsReportDialogOpen(false);
          }}
        />
      ) : null}

      {isBlockDialogOpen ? (
        <ConfirmationDialog
          isOpen={isBlockDialogOpen}
          onCancel={() => {
            setIsBlockDialogOpen(false);
          }}
          onConform={() => {
            setCurrentUser(null);
            blockUser();
          }}
          title={{
            titleMain: "Block " + currentUser?.userName + "?",
            title2:
              currentUser?.userName +
              " won't be able to send you messages, see your posts, connect with members, or join your circle. They won't receive a notification that you've blocked them.",
            confirmButton: "Block",
          }}
        />
      ) : null}
    </>
  );
};

export default ProfileLeftSection;
