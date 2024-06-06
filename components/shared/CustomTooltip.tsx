import { theme } from "@/theme";
import { Tooltip } from "@mui/material";
import { ReactElement, ReactNode } from "react";

type Props = {
  children: ReactElement<any, any>;
  title: string;
  placement?:
    | "bottom-end"
    | "bottom-start"
    | "bottom"
    | "left-end"
    | "left-start"
    | "left"
    | "right-end"
    | "right-start"
    | "right"
    | "top-end"
    | "top-start"
    | "top";
};

export const CustomTooltip = ({ children, title, placement }: Props) => {
  return (
    <Tooltip
      title={title ?? "Unknown"}
      arrow
      placement={placement ?? "top"}
      componentsProps={{
        tooltip: {
          sx: {
            borderRadius: 1.25,
            bgcolor: theme.palette.secondary.main + "cc",
            border: "1px solid " + theme.palette.grey[500],
            "& .MuiTooltip-arrow": {
              color: theme.palette.secondary.main + "cc",
              "&::before": {
                border: "1px solid " + theme.palette.grey[500],
              },
            },
          },
        },
      }}
    >
      {children}
    </Tooltip>
  );
};
