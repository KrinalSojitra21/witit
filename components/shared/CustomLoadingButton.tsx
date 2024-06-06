import { theme } from "@/theme";
import { LoadingButton } from "@mui/lab";
import { Button, IconButton, SvgIconTypeMap } from "@mui/material";
import { OverridableComponent } from "@mui/material/OverridableComponent";

type Props = {
  type?: "button" | "reset" | "submit";
  name?: string;
  handleEvent?: () => void;
  startIcon?: React.ReactElement;
  endIcon?: React.ReactElement;
} & Record<string, any>;

const CustomLoadingButton = (props: Props) => {
  const { type, name, handleEvent, startIcon, endIcon, ...restProps } = props;
  return (
    <LoadingButton
      sx={{
        width: "100%",
        display: "flex",
        justifyContent: "center",
        borderRadius: "0.375rem",
        paddingX: "0.75rem",
        fontSize: "1rem",
        fontWeight: 500,
        lineHeight: "1.5rem",
        letterSpacing: "0.05em",
        background: theme.palette.primary.main + "!important",
        color: theme.palette.common.white,
        py: 1.5,
        transition: "all 0.3s ease-in-out",
        "&:focus-visible": {
          outline: "inherit",
          "&:after": {
            outline: "2px solid",
          },
          "&:before": {
            outlineOffset: "2px",
          },
        },
        "& .MuiLoadingButton-loadingIndicator": {
          color: theme.palette.common.white,
        },
      }}
      startIcon={startIcon && startIcon}
      endIcon={endIcon && endIcon}
      type={type ? type : "button"}
      onClick={handleEvent ? handleEvent : undefined}
      {...restProps}
    >
      {name}
    </LoadingButton>
  );
};

export default CustomLoadingButton;
