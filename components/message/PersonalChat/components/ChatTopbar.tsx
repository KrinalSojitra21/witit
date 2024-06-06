import { IconDropDown } from "@/components/shared/dropDown/IconDropDown";
import { theme } from "@/theme";
import MyProfileIcon from "@/utils/icons/navbar/MyProfileIcon";
import BlockIcon from "@/utils/icons/shared/BlockIcon";
import LinkCopyIcon from "@/utils/icons/shared/LinkCopyIcon";
import NormalLeftArrowIcon from "@/utils/icons/shared/NormalLeftArrowIcon";
import OutLinedAlertIcon from "@/utils/icons/shared/OutLinedAlertIcon";
import { useMediaQuery } from "@mui/material";
import { profilePlaceholderImage } from "@/utils/images";
import { CustomImagePreview } from "@/components/shared/CustomImagePreview";
import { useMessageContext } from "../../context/MessageContext";
import { useAuthContext } from "@/context/AuthContext";
import { useRouter } from "next/router";
import VerifiedIcon from "@/utils/icons/circle/VerifiedIcon";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { ReduxUser } from "@/types/user";

type Props = {
  otherUserDetails: ReduxUser | null;
  isDataLoading: boolean;
  setIsBlockDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setReportingPostIndex: React.Dispatch<React.SetStateAction<boolean>>;
};
const ChatTopbar = ({
  otherUserDetails,
  isDataLoading,
  setIsBlockDialogOpen,
  setReportingPostIndex,
}: Props) => {
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("xl"));
  const { selectedUser, messageCredit } = useMessageContext();
  const user = useSelector((state: RootState) => state.user);
  const { sendNotification } = useAuthContext();
  const router = useRouter();
  const url =
    window.location.protocol +
    "//" +
    window.location.host +
    `/profile?user=${selectedUser?.id}`;

  const handleCopyProps = () => {
    navigator.clipboard.writeText(url);

    sendNotification({ type: "SUCCESS", message: "Link Coppied!!" });
  };

  const handleItemSelect = (Event: string) => {
    if (Event === "Copy Profile Link") {
      handleCopyProps();
      return;
    }

    if (Event === "Go To Profile") {
      router.push(url);
    }
    if (Event === "Block") {
      setIsBlockDialogOpen(true);
    }
    if (Event === "Report") {
      setReportingPostIndex(true);
    }
  };

  const menuList = [
    {
      icon: <MyProfileIcon />,
      title: "Go To Profile",
      actionType: "Go To Profile",
    },
    {
      icon: (
        <div className=" scale-75">
          <LinkCopyIcon />
        </div>
      ),
      title: "Copy Profile Link",
      actionType: "Copy Profile Link",
    },
    {
      icon: (
        <div className=" scale-75">
          <BlockIcon />
        </div>
      ),
      title: "Block",
      actionType: "Block",
    },
    {
      icon: (
        <div className=" scale-75">
          <OutLinedAlertIcon />
        </div>
      ),
      title: "Report",
      actionType: "Report",
    },
  ];

  if (!user || !selectedUser) {
    return <></>;
  }

  if (!selectedUser || !otherUserDetails) {
    return <></>;
  }

  return (
    <div>
      <div className="h-[70px] flex justify-between items-center gap-3 border-b border-grey-500 bg-grey-800 ">
        <div className="flex justify-between items-center  gap-3 p-5">
          {isSmallScreen ? (
            <div
              className=" flex items-center text-common-white "
              // onClick={() => setisMessageListOpen(true)}
            >
              <NormalLeftArrowIcon />
            </div>
          ) : null}
          <div className="relative pl-3">
            {/* <div className=" absolute  bottom-0 right-0  z-10 w-[16px] h-[16px] bg-primary-main rounded-full border-secondary-main border-[2px]" /> */}
            <div className="relative w-[40px] h-[40px] rounded-full bg-grey-600 overflow-hidden">
              <CustomImagePreview
                image={
                  selectedUser.profileImage
                    ? selectedUser.profileImage
                    : profilePlaceholderImage
                }
              />
            </div>
          </div>

          <div className="flex flex-col ">
            <p className=" text-sx font-light ite flex">
              {selectedUser.userName}
              {selectedUser.userType === "VERIFIED" && (
                <span className="text-blue-light scale-[0.6]">
                  <VerifiedIcon />
                </span>
              )}
            </p>
            {!isDataLoading &&
              user.userType !== "VERIFIED" &&
              !otherUserDetails.isMyFollower &&
              otherUserDetails.generationSettings?.creditPerMessage &&
              otherUserDetails.generationSettings.creditPerMessage > 0 &&
              !otherUserDetails.blockedBy && (
                <p className="text-grey-200 text-xs font-light tracking-wide">
                  {otherUserDetails.generationSettings.creditPerMessage} credit
                  / message
                </p>
              )}
          </div>
        </div>
        <div className="mr-7">
          {selectedUser?.id !== user?.userId && otherUserDetails?.blockedBy ? (
            <></>
          ) : (
            <IconDropDown
              position={{ vertical: "top", horizontal: "right" }}
              handleItemSelect={handleItemSelect}
              listItems={menuList}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatTopbar;
