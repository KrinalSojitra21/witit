import ToastMessage from "@/components/shared/ToastMessage";
import AuthContext from "@/context/AuthContext";
import Wrapper from "@/context/Wrapper";
import { persistor, store } from "@/redux/store";
import "@/styles/globals.css";
import { theme } from "@/theme";
import { StyledEngineProvider, ThemeProvider } from "@mui/material";
import type { AppProps } from "next/app";
import dynamic from "next/dynamic";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";

const NoInternet = dynamic(() => import("@/components/shared/NoInternet"), {
  ssr: false,
});
export default function App({ Component, pageProps }: AppProps) {
  return (
    <div className="h-full w-full">
      <StyledEngineProvider injectFirst>
        <ThemeProvider theme={theme}>
          <NoInternet>
            <Provider store={store}>
              <PersistGate loading={null} persistor={persistor}>
                <AuthContext>
                  <Wrapper>
                    <Component {...pageProps} />
                    <ToastMessage />
                  </Wrapper>
                </AuthContext>
              </PersistGate>
            </Provider>
          </NoInternet>
        </ThemeProvider>
      </StyledEngineProvider>
    </div>
  );
}
