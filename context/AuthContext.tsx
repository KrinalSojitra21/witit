import {
  Dispatch,
  SetStateAction,
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { User, onAuthStateChanged } from "firebase/auth";
import auth from "../utils/firebase/firebaseConfig";
import { useDispatch, useSelector } from "react-redux";
import { AmountPerCredit, ImageInfo } from "@/types";
import { generate } from "@/redux/slices/messageSlice";
import { useRouter } from "next/router";
import appConstant, {
  defaultImageConstant,
} from "@/utils/constants/withoutHtml/appConstant";
import { getUser } from "@/api/user/getUser";
import { RootState, clearAll } from "@/redux/store";
import { firebaseLogout } from "@/service/firebase/auth";
import { SendNotification } from "@/types/common";
import { setReduxUser, updateReduxUser } from "@/redux/slices/userSlice";
import { GetAiGeneration, PostAiGeneration } from "@/types/ai";
import { getAmountFromCredit } from "@/api/stripe/getAmountFromCredit";
import { io } from "socket.io-client";
import { ReduxUser } from "@/types/user";
import { ActivityCounts } from "@/types/activity";

type MyContextType = {
  setToLogout: () => void;
  setGenerationPost: React.Dispatch<
    React.SetStateAction<GetAiGeneration | null>
  >;
  firebaseUser: User | null;
  generationPost: GetAiGeneration | null;
  setFirebaseUser: React.Dispatch<React.SetStateAction<User | null>>;
  sendNotification: ({ type, message }: SendNotification) => void;
  customDrawerType: string | null;
  setCustomDrawerType: React.Dispatch<React.SetStateAction<string | null>>;
  customDialogType: string | null;
  setCustomDialogType: React.Dispatch<React.SetStateAction<string | null>>;
  lastVisitedPage: string | null;
  setLastVisitedPage: React.Dispatch<React.SetStateAction<string | null>>;
  discoverSearch: { search: string | null; isSearched?: boolean };
  setDiscoverSearch: React.Dispatch<
    React.SetStateAction<{ search: string | null; isSearched?: boolean }>
  >;
  croppingImage: {
    image: ImageInfo;
    index: number;
    isShowGrid?: boolean;
  };
  setCroppingImage: React.Dispatch<
    React.SetStateAction<{
      image: ImageInfo;
      index: number;
      isShowGrid?: boolean;
    }>
  >;
  amountPerCredit: AmountPerCredit;
  setAmountPerCredit: Dispatch<SetStateAction<AmountPerCredit>>;
  activityCounts: ActivityCounts;
};

const defaultContext: MyContextType = {
  setToLogout: () => {},
  firebaseUser: null,
  setFirebaseUser: () => {},
  sendNotification: () => {},
  customDrawerType: null,
  setCustomDrawerType: () => {},
  customDialogType: null,
  setCustomDialogType: () => {},
  lastVisitedPage: null,
  setLastVisitedPage: () => {},
  discoverSearch: { search: null, isSearched: false },
  setDiscoverSearch: () => {},
  croppingImage: { ...defaultImageConstant, isShowGrid: false },
  setCroppingImage: () => {},
  setGenerationPost: () => {},
  generationPost: null,
  amountPerCredit: {
    add: 0,
    withdraw: 0,
  },
  setAmountPerCredit: () => {},
  activityCounts: {
    notification: 0,
    offerCreated: 0,
    offerReceived: 0,
  },
};

const Context = createContext<MyContextType>(defaultContext);

function AuthContext({ children }: { children: React.ReactNode }) {
  const dispatch = useDispatch();
  const { asPath, push, pathname } = useRouter();
  const currentPath = useRef(asPath);
  const router = useRouter();

  const reduxUser = useSelector((state: RootState) => state.user);

  const [firebaseUser, setFirebaseUser] = useState<User | null>(null);
  const [customDrawerType, setCustomDrawerType] = useState<string | null>(null);
  const [customDialogType, setCustomDialogType] = useState<string | null>(null);
  const [lastVisitedPage, setLastVisitedPage] = useState<string | null>(null);
  const [activityCounts, setActivityCounts] = useState<ActivityCounts>({
    notification: 0,
    offerCreated: 0,
    offerReceived: 0,
  });
  const [generationPost, setGenerationPost] = useState<GetAiGeneration | null>(
    null
  );
  const [discoverSearch, setDiscoverSearch] = useState<{
    search: string | null;
    isSearched?: boolean;
  }>({ search: null, isSearched: false });
  const [croppingImage, setCroppingImage] = useState<{
    image: ImageInfo;
    index: number;
    isShowGrid?: boolean;
  }>({ ...defaultImageConstant, isShowGrid: false });
  const [amountPerCredit, setAmountPerCredit] = useState<AmountPerCredit>({
    add: 0,
    withdraw: 0,
  });

  const sendNotification = ({ type, message }: SendNotification) => {
    dispatch(
      generate({
        type,
        message: message ?? null,
      })
    );
  };

  const getUserData = async ({ userId }: { userId: string }) => {
    const user = await getUser(userId);

    if (user.status === 200) {
      dispatch(setReduxUser(user.data));
      return;
    }
    sendNotification({ type: "ERROR", message: user.error });
  };

  useEffect(() => {
    setLastVisitedPage(currentPath.current);
    currentPath.current = asPath;
  }, [asPath]);

  useEffect(() => {
    if (!firebaseUser && !reduxUser) {
      router.push(appConstant.pageRoute.login);
    }

    if (firebaseUser && reduxUser) {
      getUserData({ userId: firebaseUser.uid });
    }
  }, [firebaseUser]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentuser) => {
      if (currentuser) {
        setFirebaseUser(currentuser);
      }
    });
    return () => {
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (
      currentPath.current !== "/discover" &&
      discoverSearch &&
      discoverSearch?.search &&
      discoverSearch?.search.length > 0 &&
      discoverSearch.isSearched === false
    ) {
      router.push(appConstant.pageRoute.discover);
    }
  }, [currentPath, discoverSearch]);

  useEffect(() => {
    if (discoverSearch.isSearched && currentPath.current !== "/discover") {
      setDiscoverSearch({ search: null, isSearched: false });
    }
  }, [currentPath.current]);

  const setToLogout = async () => {
    sendNotification({ type: "LOADING" });
    const res = await firebaseLogout();
    if (res.status === 200) {
      dispatch(clearAll());
      setFirebaseUser(null);
      sendNotification({ type: "REMOVE" });

      console.log("first");

      router.push(appConstant.pageRoute.login);
    } else {
      console.log(res.error);
      sendNotification({ type: "ERROR", message: res.error });
    }
  };
  useEffect(() => {
    window.addEventListener("online", () => console.log("Became online"));
    window.addEventListener("offline", () => console.log("Became offline"));
  }, []);
  useEffect(() => {
    if (!firebaseUser) return;
    const getCreditAmount = async () => {
      const withdrawalRes = await getAmountFromCredit({
        credit: 1,
        actionType: "WITHDRAWAL",
        user_id: firebaseUser.uid,
      });
      const addRes = await getAmountFromCredit({
        credit: 1,
        actionType: "ADD",
        user_id: firebaseUser.uid,
      });
      if (withdrawalRes.status === 200 || addRes.status === 200) {
        const data = {
          add: addRes.data.amount || 0,
          withdraw: withdrawalRes.data.amount || 0,
        };
        setAmountPerCredit(data);
      }
    };
    getCreditAmount();
  }, [firebaseUser]);

  useEffect(() => {
    if (!reduxUser) return;

    const socket = io(appConstant.backendUrl, {
      path: "/socket.io",
      query: {
        userId: reduxUser.userId,
      },
      transports: ["websocket"],
    });

    socket.on("User", (user: Partial<ReduxUser>) => {
      dispatch(updateReduxUser(user));
    });

    socket.on("ActivityCounts", (counts: ActivityCounts) => {
      setActivityCounts(counts);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <Context.Provider
      value={{
        setToLogout,
        setGenerationPost,
        firebaseUser,
        generationPost,
        setFirebaseUser,
        sendNotification,
        customDrawerType,
        setCustomDrawerType,
        customDialogType,
        setCustomDialogType,
        lastVisitedPage,
        setLastVisitedPage,
        discoverSearch,
        setDiscoverSearch,
        croppingImage,
        setCroppingImage,
        amountPerCredit,
        setAmountPerCredit,
        activityCounts,
      }}
    >
      {children}
    </Context.Provider>
  );
}

export default AuthContext;

export const useAuthContext = () => useContext(Context);
