import { useAuthContext } from "@/context/AuthContext";
import React, { useEffect } from "react";
import Hypes from "./components/hypes";
import Creator from "./components/creator";
import CustomDrawer from "../CustomDrawer";
import DrawerContext from "./context/DrawerContext";

const GlobalDrawers = () => {
  const { customDrawerType, setCustomDrawerType, discoverSearch } =
    useAuthContext();

  useEffect(() => {
    if (discoverSearch?.search && discoverSearch.search.length > 0) {
      setCustomDrawerType(null);
    }
  }, [discoverSearch]);
  return (
    <DrawerContext>
      {customDrawerType?.includes("HYPE") ? (
        <CustomDrawer
          position="RIGHT"
          isOpen={customDrawerType?.includes("HYPE") ? true : false}
          onCancel={() => setCustomDrawerType(null)}
        >
          <Hypes />
        </CustomDrawer>
      ) : null}
      {customDrawerType?.includes("CREATOR") ? (
        <CustomDrawer
          position="LEFT"
          isOpen={customDrawerType === "CREATOR" ? true : false}
          onCancel={() => setCustomDrawerType(null)}
        >
          <Creator />
        </CustomDrawer>
      ) : null}
    </DrawerContext>
  );
};

export default GlobalDrawers;
