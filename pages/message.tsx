import Image from "next/image";
import React, { useEffect, useState } from "react";
import CustomInputTextField from "@/components/shared/CustomInputTextField";
import SearchIcon from "@/utils/icons/topbar/SearchIcon";
import SendIcon from "@/utils/icons/circle/SendIcon";
import { Divider, useMediaQuery } from "@mui/material";
import CustomDrawer from "@/components/shared/drawer/CustomDrawer";
import { useAuthContext } from "@/context/AuthContext";
import PlusIcon from "@/utils/icons/shared/PlusIcon";
import ThreeVerticalDots from "@/utils/icons/circle/ThreeVerticalDots";
import { theme } from "@/theme";
import PersonalChat from "@/components/message/PersonalChat";
// import { MessageInfo } from "@/types";
import twoMessageBox from "@/utils/images/twoMessageBox.svg";
import RecentMessageListDrawer from "@/components/message/RecentMessageListDrawer";
import Head from "next/head";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import MessageContext from "@/components/message/context/MessageContext";
import Lottie from "lottie-react";
import { startChatingLottie } from "@/utils/lottie";

const Message = () => {
  const [isMessageListOpen, setisMessageListOpen] = useState(true);
  const [isMessageBoxOpen, setIsMessageBoxOpen] = useState<Boolean>(false);

  const isSmallScreen = useMediaQuery(theme.breakpoints.down("xl")); // shift to useAuthContext

  useEffect(() => {
    if (isSmallScreen) {
      setisMessageListOpen(false);
    } else {
      setisMessageListOpen(true);
    }
  }, [isSmallScreen]);

  return (
    <>
      <Head>
        <title>Witit - Message</title>
      </Head>
      <MessageContext>
        <div className="flex w-full h-full">
          <div className={` transition-all duration-[800ms] w-[400px] `}>
            <RecentMessageListDrawer
              setIsMessageBoxOpen={setIsMessageBoxOpen}
            />
          </div>

          {isMessageBoxOpen ? (
            <PersonalChat />
          ) : (
            <div className="bg-grey-900 flex flex-col flex-grow justify-center items-center gap-2">
              {" "}
              <Lottie
                animationData={startChatingLottie}
                className=" w-[150px]"
              />
              <p className=" text-lg mt-5 ">Start Chatting</p>
              <p className=" text-grey-200">By click on the User Name</p>
            </div>
          )}
        </div>
      </MessageContext>
    </>
  );
};

export default Message;
