import CreditIcon from "@/utils/icons/topbar/CreditIcon";
import HypeIcon from "@/utils/icons/topbar/HypeIcon";
import React, { useEffect, useRef, useState } from "react";
import { useAuthContext } from "@/context/AuthContext";
import CustomInputTextField from "../CustomInputTextField";
import SearchIcon from "@/utils/icons/topbar/SearchIcon";
import { CreditOverlay } from "./components/CreditOverlay";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { CreditItem } from "@/types/user";
import { useRouter } from "next/router";
import { CircularProgress } from "@mui/material";
import { useDebounceEffect } from "@/hooks/useDebounceEffect";
import ArrowDownIcon from "@/utils/icons/shared/ArrowDownIcon";
import { IconDropDown } from "../dropDown/IconDropDown";
import { DropDownItem } from "@/types";
import { io } from "socket.io-client";
import appConstant from "@/utils/constants/withoutHtml/appConstant";
import { setPaymentStatus } from "@/redux/slices/paymentStatusSlice";

type CreditVisible = {
  isClicked: boolean;
  isHover: boolean;
};

const initialCreditDialog: CreditVisible = {
  isClicked: false,
  isHover: false,
};

const hypeInitialList: DropDownItem[] = [
  {
    title: "Notifications",
    actionType: "NOTIFICATIONS",
  },
  {
    title: "Offer Created",
    actionType: "OFFER_CREATED",
  },
  {
    title: "Offer Received",
    actionType: "OFFER_RECEIVED",
  },
];

const Topbar = () => {
  const router = useRouter();
  const { asPath } = useRouter();
  const currentPath = useRef(asPath);
  const user = useSelector((state: RootState) => state.user);

  const {
    setCustomDrawerType,
    setCustomDialogType,
    setDiscoverSearch,
    discoverSearch,
    amountPerCredit,
    activityCounts,
  } = useAuthContext();

  const [search, setSearch] = useState<string | null>(null);
  const debouncedSearch = useDebounceEffect(search, 2000);
  const [isSearching, setIsSearching] = useState(false);
  const [hypes, setHypes] = useState<DropDownItem[]>(hypeInitialList);

  useEffect(() => {
    if (!activityCounts) return;

    setHypes((prevHypes) => {
      return prevHypes.map((item) => {
        return {
          ...item,
          ...(item.actionType === "NOTIFICATIONS"
            ? activityCounts.notification > 0
              ? {
                  endIcon: (
                    <div className="text-[10px] bg-primary-light rounded-full px-1 min-w-[20px] h-5 text-center flex items-center justify-center ml-4">
                      {activityCounts.notification}
                    </div>
                  ),
                }
              : {}
            : item.actionType === "OFFER_CREATED"
            ? activityCounts.offerCreated > 0
              ? {
                  endIcon: (
                    <div className="text-[10px] bg-primary-light rounded-full px-1 min-w-[20px] h-5 text-center flex items-center justify-center ml-4">
                      {activityCounts.offerCreated}
                    </div>
                  ),
                }
              : {}
            : activityCounts.offerReceived > 0
            ? {
                endIcon: (
                  <div className="text-[10px] bg-primary-light rounded-full px-1 min-w-[20px] h-5 text-center flex items-center justify-center ml-4">
                    {activityCounts.offerReceived}
                  </div>
                ),
              }
            : {}),
        };
      });
    });
  }, [activityCounts]);

  const initialList: CreditItem[] = [
    {
      name: "Transferable Credit",
      description:
        "Can be transferred to your bank account, and you can also use it throughout the app.",
      credit: user?.credit?.transferableCredit ?? 0,
      amount: 0,
      color: "text-success-main",
    },
    {
      name: "Non Transferable Credit",
      description:
        "Can’t be transferred to your bank account, but you can use it throughout the app.",
      credit: user?.credit?.nonTransferableCredit ?? 0,
      amount: 0,
      color: "text-error-main",
    },
    {
      name: "Temp Credit",
      description:
        "You will get free 100 temp credits everyday and they can be used throughout the app.",
      credit: user?.credit?.tempCredit ?? 0,
      amount: 0,
      color: "text-primary-light",
    },
  ];

  const [creditVisible, setCreditVisible] =
    useState<CreditVisible>(initialCreditDialog);
  const [creditList, setCreditList] = useState<CreditItem[]>(initialList);

  const dispatch = useDispatch();
  useEffect(() => {
    setCreditList(initialList);
  }, [user]);

  const handleButtonClick = ({ type }: { type: string }) => {
    setCustomDrawerType(null);
    setCreditVisible(initialCreditDialog);
    if (type === "ADD") {
      setCustomDialogType("CREDITS-GETCREDITS");
    } else {
      setCustomDialogType("CREDITS-WITHDRAW");
    }
  };

  const handleHover = (isHover: boolean) => {
    setCreditVisible((preCon) => {
      return {
        ...preCon,
        isHover,
      };
    });
  };

  const handleClick = (isClicked: boolean) => {
    setCreditVisible((preCon) => {
      return {
        ...preCon,
        isClicked,
      };
    });
  };

  useEffect(() => {
    if (creditVisible.isClicked) {
      setTimeout(() => {
        handleClick(false);
      }, 3000);
    }
  }, [creditVisible.isClicked]);

  useEffect(() => {
    if (search === debouncedSearch) {
      setIsSearching(false);
    } else if (search && search.length > 2) {
      setIsSearching(true);
    }
  }, [search, debouncedSearch]);

  useEffect(() => {
    if (debouncedSearch && debouncedSearch.length > 0) {
      setDiscoverSearch({ search: debouncedSearch, isSearched: false });
    }
    if (currentPath.current === "/discover" && debouncedSearch?.length === 0) {
      setDiscoverSearch({ search: debouncedSearch, isSearched: false });
    }
  }, [debouncedSearch]);

  useEffect(() => {
    if (discoverSearch.search === null) {
      setSearch(null);
    }
  }, [discoverSearch]);

  if (!user) return <></>;

  return (
    <div className="px-6 py-4 flex justify-between items-center border-b-[1px] border-grey-500">
      <div className="flex-grow">
        <CustomInputTextField
          value={search ? search : ""}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            setSearch(e.target.value);
          }}
          StartIcon={<SearchIcon />}
          EndIcon={
            isSearching && (
              <div className=" text-common-white text-center w-full overflow-hidden">
                <CircularProgress size={16} className="text-common-white" />
              </div>
            )
          }
          placeholder="Search Here"
          className="text-sm  rounded-lg overflow-hidden text-common-white focus-visible:outline-none max-w-[550px] min-w-[360px] py-2 h-12"
        />
      </div>
      <div className="h-full text-common-white flex items-center gap-8">
        <div className="flex items-center gap-5">
          <div
            onMouseEnter={() => {
              handleHover(true);
            }}
            onMouseLeave={() => {
              handleHover(false);
            }}
          >
            <div
              className="relative cursor-pointer w-[30px] h-[30px] p-[3px] z-[101]"
              onClick={() => {
                handleClick(true);
              }}
            >
              <CreditIcon />
            </div>
            {creditVisible.isClicked || creditVisible.isHover ? (
              <CreditOverlay
                creditList={creditList}
                handleButtonClick={handleButtonClick}
              />
            ) : null}
          </div>
          <IconDropDown
            position={{ vertical: "top", horizontal: "center" }}
            listItems={hypes}
            handleItemSelect={(type) => {
              console.log("HYPE_" + type);
              setCustomDrawerType("HYPE_" + type);
            }}
            Icon={
              <div className="cursor-pointer flex gap-3 items-center bg-grey-900 py-2 px-4 rounded-full">
                <div className="flex gap-2 items-center">
                  <HypeIcon
                    isWithBlue={
                      activityCounts.notification > 0 ||
                      activityCounts.offerCreated > 0 ||
                      activityCounts.offerReceived > 0
                    }
                  />
                  <p>Hype</p>
                </div>
                <div className="scale-[0.5] p-1 bg-grey-700 rounded-full">
                  <ArrowDownIcon />
                </div>
              </div>
            }
          />
        </div>
      </div>
    </div>
  );
};
export default Topbar;
