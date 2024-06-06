import React from "react";
import { useAuthContext } from "@/context/AuthContext";
import CloseIcon from "@/utils/icons/shared/CloseIcon";
import { Notifications } from "./components/Notifications";
import { OfferCreated } from "./components/OfferCreated";
import { OfferReceived } from "./components/OfferReceived";

const Hypes = () => {
  const {  setCustomDrawerType, customDrawerType } =
    useAuthContext();

  return (
    <div className="h-full flex flex-col">
      <div className="flex gap-4 py-4 px-6 items-center justify-between bg-grey-900 border-b border-grey-700">
        <p className="text-base font-medium">
          {customDrawerType === "HYPE_NOTIFICATIONS"
            ? "Notifications"
            : customDrawerType === "HYPE_OFFER_CREATED"
            ? "Offer Created"
            : "Offer Received"}
        </p>
        <div
          className="scale-150 text-grey-400 cursor-pointer"
          onClick={() => setCustomDrawerType(null)}
        >
          <CloseIcon />
        </div>
      </div>

      {customDrawerType === "HYPE_NOTIFICATIONS" ? (
        <Notifications />
      ) : customDrawerType === "HYPE_OFFER_CREATED" ? (
        <OfferCreated />
      ) : (
        <OfferReceived />
      )}
    </div>
  );
};

export default Hypes;
