import { theme } from "@/theme";
import {
  Box,
  FormHelperText,
  Icon,
  InputBase,
  InputBaseProps,
  Stack,
} from "@mui/material";
import { forwardRef } from "react";
type Props = {
  type?: "button" | "reset" | "submit";
  name?: string;
  tag?: string;
  tagStyle?: string;
  startIcon?: React.ReactElement;
  StartIconHandleEvent?: () => void;
  StartIconStyle: string;
  endIcon?: React.ReactElement;
  EndIconHandleEvent?: () => void;
  EndIconStyle: string;
  error: string;
  className?: string;
  inputFieldClass?: string;
} & Record<string, any>;

const CustomInputTextField = forwardRef((props: Props, ref) => {
  const {
    name,
    type,
    StartIcon,
    StartIconStyle,
    StartIconHandleEvent,
    EndIcon,
    EndIconStyle,
    EndIconHandleEvent,
    tag,
    tagStyle,
    error,
    className,
    inputFieldClass,
    ...restProps
  } = props;

  return (
    <div className="w-full ">
      {tag && (
        <Box
          sx={{
            fontWeight: 400,
            paddingBottom: 2,
            letterSpacing: "0.025rem",
            fontSize: "0.875rem",
            color: theme.palette.common.white,
          }}
        >
          <h6 className={tagStyle}>{tag}</h6>
        </Box>
      )}
      <Box
        sx={{
          fontSize: "1.25rem",
          display: "flex",
          flexDirection: "row",
          gap: "1rem",
          alignItems: "center",
          width: "100%",
          borderRadius: "0.375rem",
          borderColor: theme.palette.grey[700],
          borderWidth: "1px",
          paddingLeft: "1.25rem",
          paddingRight: "1.25rem",
          paddingTop: "0.75rem",
          paddingBottom: "0.75rem",
          backgroundColor: theme.palette.grey[800],
        }}
        className={className}
      >
        {StartIcon && (
          <Box
            sx={{
              fontSize: "1.25rem",
              color: theme.palette.grey[400],
            }}
            onClick={StartIconHandleEvent}
            className={StartIconStyle}
          >
            {StartIcon}
          </Box>
        )}
        <InputBase
          type={type}
          sx={{
            flexGrow: 1,
            color: theme.palette.common.white,
            fontSize: "0.875rem",
            lineHeight: "1.5rem",
            letterSpacing: "0.04rem",
            input: {
              "&::placeholder": {
                opacity: 1,
                letterSpacing: "0.04rem",
                color: theme.palette.grey[400],
              },
            },
          }}
          className={inputFieldClass}
          {...restProps}
        />
        {EndIcon && (
          <Box
            sx={{
              fontSize: "1.25rem",
              color: theme.palette.grey[400],
            }}
            onClick={EndIconHandleEvent}
            className={EndIconStyle}
          >
            {EndIcon}
          </Box>
        )}
      </Box>
      {error && (
        <FormHelperText error focused>
          {error}
        </FormHelperText>
      )}
    </div>
  );
});

CustomInputTextField.displayName = "CustomInputTextField";

export default CustomInputTextField;
