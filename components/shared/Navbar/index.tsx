import { Box, Drawer, useMediaQuery } from "@mui/material";
import VerifyAccountBg from "@/utils/images/verifyAccountBg.png";
import VerificationIcon from "@/utils/icons/circle/VerifiedIcon";
import { NavLink } from "./components/NavLink";
import { theme } from "../../../theme";
import Image from "next/image";
import CreateIcon from "@/utils/icons/navbar/CreateIcon";
import PostIcon from "@/utils/icons/navbar/PostIcon";
import CircleIcon from "@/utils/icons/navbar/CircleIcon";
import DiscoverIcon from "@/utils/icons/navbar/DiscoverIcon";
import SettingIcon from "@/utils/icons/navbar/SettingIcon";
import MyProfileIcon from "@/utils/icons/navbar/MyProfileIcon";
import CreatorIcon from "@/utils/icons/navbar/CreatorIcon";
import appConstant from "@/utils/constants/withoutHtml/appConstant";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import MessageIcon from "@/utils/icons/navbar/MessageIcon";
import { useAuthContext } from "@/context/AuthContext";
import MainLogo from "@/utils/images/wititLogo.svg";
import SmallLogo from "@/utils/images/wititSmall.svg";
import VerifiedIcon from "@/utils/icons/circle/VerifiedIcon";
import { UserType } from "@/types/user";
import { useRouter } from "next/router";
import { CustomImagePreview } from "../CustomImagePreview";

const { small, medium } = appConstant.drawerWidth;

const navbarItems = [
  {
    name: "Create",
    link: appConstant.pageRoute.create,
    startIcon: <CreateIcon />,
  },
  {
    name: "Post",
    link: null,
    startIcon: <PostIcon />,
  },
  {
    name: "Message",
    link: appConstant.pageRoute.message,
    startIcon: <MessageIcon />,
  },
  {
    name: "Circle",
    link: appConstant.pageRoute.circle,
    startIcon: <CircleIcon />,
  },
  {
    name: "Creator",
    link: null,
    startIcon: <CreatorIcon />,
  },
  {
    name: "Discover",
    link: appConstant.pageRoute.discover,
    startIcon: <DiscoverIcon />,
  },
  {
    name: "Setting",
    link: appConstant.pageRoute.setting,
    startIcon: <SettingIcon />,
  },
  {
    name: "My Profile",
    link: appConstant.pageRoute.profile,
    startIcon: <MyProfileIcon />,
  },
];

const Navbar = () => {
  const router = useRouter();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("xl")); // shift to useAuthContext

  const { setCustomDialogType } = useAuthContext();

  const user = useSelector((state: RootState) => state.user);

  const handleProfileRedirect = () => {
    router.push(appConstant.pageRoute.profile);
  };

  if (!user) return <></>;

  const drawer = (
    <>
      <div className="flex flex-col justify-between w-full h-full bg-secondary-main">
        <div>
          <div className="p-5 h-[80px] w-full">
            <div className="w-full h-full relative bg-grey-900">
              <CustomImagePreview
                image={isSmallScreen ? SmallLogo : MainLogo}
              />
            </div>
          </div>
          <div className="flex flex-col gap-3.5 w-full mt-5 ">
            {navbarItems.map((item, index) => {
              return (
                <NavLink
                  key={index}
                  name={item.name}
                  link={item.link}
                  startIcon={item.startIcon}
                  isSmallScreen={isSmallScreen}
                />
              );
            })}
          </div>
        </div>
        <div className="flex flex-col items-center px-3 py-5 gap-5">
          {!isSmallScreen ? (
            <div
              className="text-common-white relative flex justify-center items-center rounded-md overflow-hidden cursor-pointer"
              onClick={() => {
                setCustomDialogType("LEVELUP");
              }}
            >
              <Image
                fill
                src={VerifyAccountBg}
                alt=""
                className="relative  h-[40px]"
              />
              <div className=" absolute flex items-center gap-[0.1rem] ">
                <div className=" scale-[0.7]">
                  <VerificationIcon />
                </div>
                <div className="text-xs">Verify your account</div>
              </div>
            </div>
          ) : (
            <div
              className="text-common-white w-[50px] h-[50px] relative flex justify-center items-center rounded-lg overflow-hidden"
              onClick={() => {
                setCustomDialogType("LEVELUP");
              }}
            >
              <Image fill src={VerifyAccountBg} alt="" className="relative" />
              <div className=" absolute flex items-center gap-1">
                <div className="cursor-pointer scale-90">
                  <VerificationIcon />
                </div>
              </div>
            </div>
          )}

          <div
            className={`flex w-full cursor-pointer gap-2 ${
              isSmallScreen && "justify-center"
            } items-center`}
            onClick={handleProfileRedirect}
          >
            <div className="relative w-[40px] h-[40px]  rounded-xl overflow-hidden">
              <div className="absolute z-10 w-full h-full p-[0.130rem] bg-transparent">
                <div className="w-full h-full rounded-xl border-dashed border-white border-[0.5px]" />
              </div>
              <Image
                fill
                src={
                  user?.generalInfo?.profileImage ??
                  appConstant.defaultProfileImage
                }
                alt="profile-image"
                className="relative"
              />
            </div>
            {!isSmallScreen ? (
              <div className="text-common-white flex flex-col gap-0.5">
                <p className="text-sm flex gap-1 items-center">
                  {user?.userName}
                  {user?.userType === UserType.VERIFIED ? (
                    <span className="text-blue-light scale-50 -ml-1">
                      <VerifiedIcon />
                    </span>
                  ) : null}
                </p>
                <p className="text-grey-100 text-xs font-light tracking-wide">
                  {user?.counts.followerCount} Members
                </p>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </>
  );

  return (
    <Box
      component="nav"
      sx={
        isSmallScreen
          ? { width: small, height: "100%" }
          : { width: medium, height: "100%" }
      }
    >
      <Drawer
        variant="persistent"
        className="bg-opacity-0 h-full [&>.MuiDrawer-paper]:static [&>.MuiDrawer-paper]:bg-black [&>.MuiDrawer-paper]:bg-opacity-0 [&>.MuiDrawer-paper]:border-r-grey-500"
        open
      >
        {drawer}
      </Drawer>
    </Box>
  );
};

export default Navbar;
