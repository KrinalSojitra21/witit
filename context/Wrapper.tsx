import { theme } from "@/theme";
import {
  StyledEngineProvider,
  ThemeProvider,
  useMediaQuery,
} from "@mui/material";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import localFont from "@next/font/local";
import Navbar from "@/components/shared/Navbar";
import { useRouter } from "next/router";
import Topbar from "@/components/shared/Topbar";
import { useEffect } from "react";
import { useAuthContext } from "./AuthContext";
import appConstant from "@/utils/constants/withoutHtml/appConstant";
import GlobalDialogs from "@/components/shared/dialog/GlobalDialogs";
import GlobalDrawers from "@/components/shared/drawer/GlobalDrawers";
import { isMobile } from "react-device-detect";
import MobileScreen from "@/components/shared/MobileScreen";
import Loader from "@/components/shared/Loader";

// const poppins = Poppins({
//   weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
//   subsets: ["latin"],
//   preload: true,
// });
const poppins = localFont({
  src: "../public/fonts/Poppins-Regular.ttf",
});

const { small, medium } = appConstant.drawerWidth;

const withoutNavPaths = ["/", "/account-setup", "/app/subscription", "/test"]; // put `/` before every pathname

const Wrapper = ({ children }: any) => {
  const router = useRouter();
  const reduxUser = useSelector((state: RootState) => state.user);

  const { setCustomDrawerType, setCustomDialogType, firebaseUser } =
    useAuthContext();

  useEffect(() => {
    setCustomDrawerType(null);
    setCustomDialogType(null);
  }, [children]);

  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={theme}>
        
        <div>
          {withoutNavPaths.includes(router.pathname) ? (
            <div
              className={`${poppins?.className} flex md:h-sceen h-[100dvh] min-h-full bg-secondary-main flex-col`}
            >
              {children}
            </div>
          ) : (
            <>
              {!reduxUser ? (
                <Loader loading={true} />
              ) : (
                <>
                  {isMobile ? (
                    <div className="w-full md:h-sceen h-[100dvh] min-h-full bg-secondary-main">
                      <MobileScreen />
                    </div>
                  ) : (
                    <div
                      className={`${poppins?.className} relative flex md:h-sceen h-[100dvh] min-h-[730px] bg-secondary-main flex-col`}
                    >
                      <div className="flex w-full h-full mx-auto">
                        {/* don't remove this div */}
                        <div className="h-full">
                          <Navbar />
                        </div>
                        <div className="flex-grow w-full flex flex-col">
                          <Topbar />
                          <div className="flex-grow overflow-hidden relative">
                            {children}
                            <GlobalDrawers />
                            <GlobalDialogs />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </>
              )}
            </>
          )}
        </div>
      </ThemeProvider>
    </StyledEngineProvider>
  );
};

export default Wrapper;
