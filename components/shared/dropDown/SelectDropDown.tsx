import { theme } from "@/theme";
import ArrowDownIcon from "@/utils/icons/shared/ArrowDownIcon";
import { Box, IconButton } from "@mui/material";
import { useState } from "react";
import CustomSelectDropDown from "./components/CustomSelectDropDown";

type Props = {
  listItems: string[];
  Icon?: JSX.Element;
  inputAreaStyle: string;
  handleItemSelect?: (type: string) => void;
} & Record<string, any>;

export const SelectDropDown = ({
  getValues,
  listItems,
  inputAreaStyle,
  handleItemSelect,
}: Props) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };

  const handleClose = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    setAnchorEl(null);
  };

  return (
    <div className="relative w-full">
      <Box
        sx={{
          width: "100%",
          background: theme.palette.grey[800],
          border: " 1px solid" + theme.palette.grey[700],
          borderRadius: "0.5rem",
          paddingLeft: "1.25rem",
          paddingRight: "1.25rem",
          paddingTop: "0.75rem",
          paddingBottom: "0.75rem",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
        aria-label="more"
        id="long-button"
        aria-controls={open ? "long-menu" : undefined}
        aria-expanded={open ? "true" : undefined}
        aria-haspopup="true"
        onClick={handleClick}
        className={inputAreaStyle}
      >
        <p>{getValues("subject")}</p>
        <IconButton
          className={`p-0 text-grey-400 ${
            anchorEl && "rotate-180 "
          } scale-75 transition-transform`}
        >
          <ArrowDownIcon />
        </IconButton>
      </Box>

      <CustomSelectDropDown
        listItems={listItems}
        handleClose={handleClose}
        anchorEl={anchorEl}
        className="rounded-tl-none w-[300px]"
        handleItemSelect={(type: string) => {
          setAnchorEl(null);
          if (handleItemSelect) {
            handleItemSelect(type);
          }
        }}
      />
    </div>
  );
};
