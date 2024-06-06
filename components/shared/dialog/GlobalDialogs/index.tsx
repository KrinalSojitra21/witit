import LevelUp from "@/components/shared/dialog/GlobalDialogs/components/levelUp";
import CreatePostDialog from "@/components/shared/dialog/GlobalDialogs/components/CreatePostDialog";
import { useAuthContext } from "@/context/AuthContext";
import React from "react";
import CreditViewPromptDialog from "@/components/circle/CreditViewPromptDialog";
import CreditDialogbox from "../../Topbar/components/CreditDialogbox";

const GlobalDialogs = () => {
  const { customDialogType } = useAuthContext();

  return (
    <div className="w-full">
      {customDialogType === "LEVELUP" ? <LevelUp /> : null}
      {customDialogType === "POST" ? <CreatePostDialog /> : null}
      {customDialogType === "CREDITS-VIEWPROMPT" ? (
        <CreditViewPromptDialog />
      ) : null}
      {customDialogType === "CREDITS-GETCREDITS" ? <CreditDialogbox /> : null}
      {customDialogType === "CREDITS-WITHDRAW" ? <CreditDialogbox /> : null}
    </div>
  );
};

export default GlobalDialogs;
