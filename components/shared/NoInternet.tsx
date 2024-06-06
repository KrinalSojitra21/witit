import React, { useState, useEffect } from "react";
import Loader from "./Loader";
import { NoDataFound } from "./NoDataFound";
import { CustomImagePreview } from "./CustomImagePreview";
import NetworkIcon from "@/utils/icons/shared/NetworkIcon";
import { useRouter } from "next/router";

const NoInternetConnection = (props: any) => {
  // state variable holds the state of the internet connection
  const [internetStatus, setInternetStatus] = useState<string | null>(null);
  const router = useRouter();
  // On initization set the isOnline state.
  useEffect(() => {
    setInternetStatus(navigator.onLine ? "ONLINE" : "OFFLINE");
  });

  // event listeners to update the state
  window.addEventListener("online", () => {
    setInternetStatus("ONLINE");
  });

  window.addEventListener("offline", () => {
    setInternetStatus("OFFLINE");
  });

  if (!internetStatus) return <Loader loading={true} />;
  if (internetStatus === "ONLINE") {
    return props.children;
  } else {
    return (
      <div className="flex justify-center items-center h-screen w-full">
        <NoDataFound
          handleEvent={() => {
            router.reload();
          }}
          image={
            <div>
              {" "}
              <NetworkIcon />
            </div>
          }
          buttonName="Try Again"
          buttonStyle="bg-error-main mt-2"
          title="Oops!!"
          descriptionStyle="mt-2"
          titleStyle="mt-2"
          description="No Internet connection found.
          Check your connection or Try again !"
        />
      </div>
    );
  }
};

export default NoInternetConnection;
