import { styled } from "@mui/material/styles";
import Switch, { SwitchProps } from "@mui/material/Switch";
import { forwardRef } from "react";

type Props = {
  handleToggle?: any;
  isChecked: boolean;
  startIcon?: JSX.Element;
  endIcon?: JSX.Element;
  startNumber?: number;
  endNumber?: number;
} & Record<string, any>;

const ToggleSwitchStyle = styled((props: SwitchProps) => (
  <Switch focusVisibleClassName=".Mui-focusVisible" disableRipple {...props} />
))(({ theme }) => ({
  width: 50,
  height: 28,
  padding: 0,
  display: "flex",
  "&:active": {
    "& .MuiSwitch-thumb": {
      width: 18,
    },
    "& .MuiSwitch-switchBase.Mui-checked": {
      transform: "translateX(20px)",
    },
  },
  "& .MuiSwitch-switchBase": {
    color: theme.palette.grey[100],

    padding: "4px",
    "&.Mui-checked": {
      transform: "translateX(22px)",
      color: theme.palette.common.white,
      "& + .MuiSwitch-track": {
        opacity: 1,
        backgroundColor: theme.palette.primary.main,
      },
    },
  },
  "& .MuiSwitch-thumb": {
    boxShadow: "0 2px 4px 0 rgb(0 35 11 / 20%)",
    width: 20,
    height: 20,
    borderRadius: 12,
    transition: {
      duration: 200,
    },
  },
  "& .MuiSwitch-track": {
    borderRadius: 14,
    opacity: 1,
    backgroundColor: theme.palette.grey[500],
    boxSizing: "border-box",
  },
}));

const IconSwitch = styled(Switch)(({ theme }) => ({
  width: 56,
  height: 34,
  padding: 0,
  alignItems: "center",
  "& .MuiSwitch-switchBase": {
    margin: 1,
    padding: 0,
    transform: "translateX(2px)",
    "&.Mui-checked": {
      color: theme.palette.common.white,
      transform: "translateX(24px)",
      "& + .MuiSwitch-track": {
        opacity: 1,
        backgroundColor: theme.palette.primary.main,
      },
    },
  },
  "& .MuiSwitch-thumb": {
    backgroundColor: theme.palette.mode === "dark" ? "#003892" : "#001e3c",
    width: 26,
    height: 26,
  },
  "& .MuiSwitch-track": {
    opacity: 1,
    backgroundColor: "#3C3D3F",
    borderRadius: 40 / 2,
  },
}));

const TextSwitch = styled(Switch)(({ theme }) => ({
  width: 72,
  height: 34,
  padding: 0,
  alignItems: "center",
  "& .MuiSwitch-switchBase": {
    margin: 1,
    padding: 0,
    transform: "translateX(0px)",
    "&.Mui-checked": {
      color: theme.palette.common.white,
      transform: "translateX(34px)",
      "& + .MuiSwitch-track": {
        opacity: 1,
        backgroundColor: theme.palette.grey[700],
      },
    },
  },
  "& .MuiSwitch-thumb": {
    backgroundColor: theme.palette.primary.main,
    width: 26,
    height: 26,
  },
  "& .MuiSwitch-track": {
    opacity: 1,
    backgroundColor: theme.palette.grey[700],
    borderRadius: 40 / 2,
    "&:after, &:before": {
      color: "white",
      fontSize: "12px",
      position: "absolute",
      top: "8px",
    },
    "&:after": {
      content: "'4'",
      left: "14px",
    },
    "&:before": {
      content: "'8'",
      right: "14px",
    },
  },
}));

const CustomToggleSwitch = forwardRef((props: Props, ref) => {
  const {
    isChecked,
    handleToggle,
    startIcon,
    endIcon,
    startNumber,
    endNumber,
    ...restProps
  } = props;

  if (startIcon) {
    return (
      <IconSwitch
        checked={isChecked}
        onChange={handleToggle}
        icon={
          <div className="bg-grey-200 rounded-full p-[2px] mt-0.5">
            {startIcon}
          </div>
        }
        checkedIcon={
          <div className="bg-common-white rounded-full p-[2px] mt-0.5">
            {endIcon ?? startIcon}
          </div>
        }
        {...restProps}
      />
    );
  }

  if (startNumber) {
    return (
      <TextSwitch
        disableRipple
        checked={isChecked}
        onChange={handleToggle}
        icon={
          <div className="bg-primary-main rounded-full p-[2px] w-[36px] h-[32px] flex justify-center items-center text-xs">
            4
          </div>
        }
        checkedIcon={
          <div className="bg-primary-main rounded-full p-[2px] w-[36px] h-[32px] flex justify-center items-center text-xs">
            {endNumber ?? startNumber}
          </div>
        }
        {...restProps}
      />
    );
  }

  return (
    <ToggleSwitchStyle
      checked={isChecked}
      onChange={handleToggle}
      {...restProps}
    />
  );
});

CustomToggleSwitch.displayName = "CustomToggleSwitch";

export default CustomToggleSwitch;
