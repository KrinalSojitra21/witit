import { theme } from "@/theme";
import NotificationIcon from "@/utils/icons/setting/NotificationIcon";
import { Divider } from "@mui/material";
import React, { useEffect, useState } from "react";
import CustomToggleSwitch from "../../../shared/CustomToggleSwitch";
import NSFWIcon from "@/utils/icons/setting/NSFWIcon";
import { Interaction } from "@/types/setting";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { ReduxUser } from "@/types/user";
import { updateUser } from "@/api/user/updateUser";
import { useAuthContext } from "@/context/AuthContext";
import SettingBottomBar from "../Shared/SettingBottomBar";

const NotificationAndNSFW = () => {
  const user = useSelector((state: RootState) => state.user);
  const { sendNotification } = useAuthContext();
  const dispatch = useDispatch();

  const interactions: Interaction[] = [
    {
      type: "Like",
      description: "When Someone Likes Your Uploaded Post.",
      isCheck: user?.pushNotifications?.likes,
      objectType: "likes",
    },
    {
      type: "Comment",
      description: "When Someone Comments Your Uploaded Post.",
      isCheck: user?.pushNotifications?.comments,
      objectType: "comments",
    },
    {
      type: "Direct Message",
      description: "When Someone Messages You Directly.",
      isCheck: user?.pushNotifications?.directMessages,
      objectType: "directMessages",
    },
    {
      type: "Circle Add",
      description: "When Someone Joins Your Circle.",
      isCheck: user?.pushNotifications?.circleAdds,
      objectType: "circleAdds",
    },
    {
      type: "From Witit",
      description: "When Witit Sends You Updates.",
      isCheck: user?.pushNotifications?.fromWitit,
      objectType: "fromWitit",
    },
  ];
  const [updatedList, setUpdatedList] = useState<Interaction[]>(interactions);
  const [isNotification, setIsNotification] = useState<boolean | undefined>(
    user?.pushNotifications?.pauseAllNotification
  );
  const [userObject, setUserObject] = useState<ReduxUser | null>(user);

  const fetchData = (item?: Interaction) => {
    const notificationObj: any = user?.pushNotifications;
    const keys: string[] = Object.keys(notificationObj);
    if (!item) {
      return;
    }
    const getKey: string | undefined = keys.find((value) => {
      return value === item.objectType;
    });
    if (userObject && getKey && userObject.pushNotifications) {
      setUserObject({
        ...userObject,
        pushNotifications: {
          ...userObject.pushNotifications,
          [getKey]: item.isCheck,
          pauseAllNotification: false,
        },
      });
    }
  };

  const handleSwitch = (id: number) => {
    const list = updatedList.map((item, index) => {
      if (index === id) {
        item.isCheck = !item.isCheck;
      }
      return item;
    });

    setUpdatedList(list);
  };

  const handleAllNotification = (checked: boolean) => {
    const obj = {
      pauseAllNotification: checked,
      likes: false,
      comments: false,
      directMessages: false,
      circleAdds: false,
      fromWitit: false,
    };

    if (userObject) {
      setUserObject({
        ...userObject,
        pushNotifications: obj,
      });
    }
  };

  const handleNsfw = (event: boolean) => {
    if (userObject) {
      setUserObject({
        ...userObject,
        NSFW: event,
      });
    }
  };

  useEffect(() => {
    if (!userObject) {
      return;
    }
    handleSubmit();
  }, [userObject, isNotification]);

  const handleSubmit = async () => {
    const response = await updateUser({
      data: {
        pushNotifications: userObject?.pushNotifications,
        NSFW: userObject?.NSFW,
      },
      user_id: user?.userId,
    });

    if (response.status === 200) {
      console.log(response.data);
      return;
    }
    sendNotification({ type: "ERROR", message: response.error });
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex lg:flex-row flex-col gap-5 h-full ">
        {/* left side */}
        <div className=" lg:w-[40%] lg:max-w-[600px] flex flex-col py-5 gap-5 bg-grey-900 rounded-xl h-fit ">
          <div className="flex flex-col px-6 py-1 gap-5">
            <div className="flex gap-5  items-center">
              <div className="text-[#50D5FF]">
                <NotificationIcon />
              </div>
              <p className="text-sm tracking-wider">Notification Settings</p>
            </div>
            <Divider
              sx={{
                borderColor: theme.palette.grey[500],
              }}
            />
          </div>

          <div className="flex flex-col px-5 gap-3 overflow-auto">
            <div className=" flex justify-between">
              <div className="flex flex-col">
                <p className="text-sm">Pause All Notifications</p>
              </div>
              <div className=" scale-[0.8]">
                <CustomToggleSwitch
                  labelString=""
                  labelStyle=""
                  isChecked={isNotification}
                  handleToggle={(e: any) => {
                    setIsNotification(e.target.checked);
                    handleAllNotification(e.target.checked);
                    if (e.target.checked === true) {
                      setUpdatedList(
                        interactions.map((val) => {
                          val.isCheck = false;
                          return val;
                        })
                      );
                    }
                  }}
                />
              </div>
            </div>

            {updatedList.map((item, id) => {
              return (
                <>
                  <div className=" flex justify-between bg-grey-800 py-4 px-4 rounded-lg">
                    <div className="flex flex-col gap-1">
                      <p className="text-sm">{item.type}</p>
                      <p className="text-grey-100 text-xs tracking-wider text-opacity-40 ">
                        {item.description}
                      </p>
                    </div>
                    <div className=" scale-[0.8]">
                      <CustomToggleSwitch
                        labelString=""
                        labelStyle=""
                        isChecked={item.isCheck}
                        handleToggle={() => {
                          handleSwitch(id);
                          if (
                            updatedList.find((item) => item.isCheck === true)
                          ) {
                            setIsNotification(false);
                          }
                          fetchData(item);
                        }}
                      />
                    </div>
                  </div>
                </>
              );
            })}
          </div>
        </div>
        {/* right side */}
        <div className=" lg:w-[55%] lg:max-w-[900px] flex flex-col py-5 gap-5 bg-grey-900 rounded-xl h-fit ">
          <div className="flex flex-col px-5 gap-5">
            <div className="flex gap-5 items-center">
              <NSFWIcon />
              <p className="text-sm tracking-wider">NSFW</p>
            </div>
            <Divider
              sx={{
                borderColor: theme.palette.grey[500],
              }}
            />
          </div>
          <div className="flex flex-col px-5 gap-3 overflow-auto">
            {" "}
            <div className=" flex justify-between">
              <div className="flex flex-col">
                <p className="text-sm">
                  Allow others to watch NSFW Content In Your Account
                </p>
              </div>
              <div className=" scale-[0.8]">
                <CustomToggleSwitch
                  labelString=""
                  labelStyle=""
                  isChecked={user?.NSFW}
                  handleToggle={(e: any) => {
                    handleNsfw(e.target.checked);
                  }}
                />
              </div>
            </div>
            <Divider
              sx={{
                borderColor: theme.palette.grey[500],
              }}
            />
            <div className="flex flex-col gap-6">
              <p className=" text-xs tracking-wider text-grey-200 ">
                What is NSFW Content?
              </p>
              <p className=" text-xs tracking-wider text-grey-200 ">
                NSFW is an abbreviation for the phrases such as: “Not Safe For
                Wife”, “Not Suitable For Work”, but mostly used as “Not Safe For
                Work”
              </p>
              <p className=" text-xs tracking-wider text-grey-200 ">
                It is an internet slang that is often used to describe internet
                posts and content that is mainly involves nudity, sexual
                activity, heavy profanity and more...
              </p>
              <p className=" text-xs tracking-wider text-grey-200 ">
                With Witit, we want to provide a safe place for people to freely
                express art or interests that they couldn’t otherwise share on
                other platforms. However doing so comes with some requirements,
                such as needing to turn on the ability to see and post NSFW
                content.
              </p>
              <p className=" text-xs tracking-wider text-grey-200 ">
                NSFW is also not a free pass to post anything you want, we at
                Witit just allow you fewer restricts than our social media
                companions. We still do not tolerate obscene violence or illegal
                activity of any sort.
              </p>
              <p className=" text-xs tracking-wider text-grey-200 ">
                Accounts that post NSFW content have been marked with a red
                verification badge.
              </p>
            </div>
            <Divider
              sx={{
                borderColor: theme.palette.grey[500],
              }}
            />
            <div className="flex flex-col gap-3">
              <p className=" text-xs tracking-wider text-grey-200 ">
                How can I view or post NSFW content?
              </p>
              <p className=" text-xs tracking-wider text-grey-200 ">
                To turn on, off, or manage your NSFW preferences, you must do so
                from the desktop version of Witit. This is part of the app
                stores terms of service and not a creative decision. You also
                must be 18 years of age or older. Please visit and login to your
                Witit account at http://Witit.com to get started.{" "}
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-4">
        <SettingBottomBar />
      </div>
    </div>
  );
};

export default NotificationAndNSFW;
