import { Box, useMediaQuery } from "@mui/material";
import React, { ReactNode, useEffect, useState } from "react";

import { theme } from "@/theme";
import { useAuthContext } from "@/context/AuthContext";

type Props = {
  children: ReactNode;
  isOpen?: boolean;
  onCancel?: () => void;
} & Record<string, any>;

const CustomDialog = ({ children, isOpen, onCancel, ...restProps }: Props) => {
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("xl")); // shift to useAuthContext
  const { setCustomDialogType, customDialogType } = useAuthContext();

  return (
    <>
      {customDialogType || isOpen ? (
        <div
          className="w-full h-full absolute top-0 left-0 mb-3 bg-secondary-light z-30 flex justify-center items-center"
          onClick={() => {
            if (onCancel) {
              onCancel();
            }
          }}
        >
          <Box
            sx={{
              overflow: "hidden",
              backgroundColor: theme.palette.grey[900],
              maxWidth: "900px",
              maxHeight: "720px",
              width: isSmallScreen ? "90%" : "auto",
              height: "90%",
              zIndex: 13,
              borderRadius: "1.2rem",
              borderColor: theme.palette.grey[500],
              borderStyle: "solid",
              borderWidth: 1,
              color: theme.palette.common.white,
              boxShadow:
                "0px 11px 15px -7px rgba(0,0,0,0.2), 0px 24px 38px 3px rgba(0,0,0,0.14), 0px 9px 46px 8px rgba(0,0,0,0.12)",
            }}
            onClick={(e) => {
              e.stopPropagation();
            }}
            {...restProps}
          >
            {children}
          </Box>
        </div>
      ) : null}
    </>
  );
};

export default CustomDialog;
