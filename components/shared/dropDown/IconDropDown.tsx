import { theme } from "@/theme";
import { DropDownItem } from "@/types";
import ThreeVerticalDots from "@/utils/icons/circle/ThreeVerticalDots";
import { IconButton } from "@mui/material";
import { useState } from "react";
import CustomDropDown from "./components/CustomDropDown";

type Position = {
  vertical: "top" | "center" | "bottom";
  horizontal: "left" | "center" | "right";
};

type Props = {
  Icon?: JSX.Element;
  position: Position;
  handleItemSelect?: (type: string) => void;
  listItems: DropDownItem[];
} & Record<string, any>;

export const IconDropDown = ({
  Icon,
  handleItemSelect,
  listItems,
  position,
}: Props) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
    return;
  };

  const handleCloseMenu = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    setAnchorEl(null);
  };

  return (
    <>
      <IconButton
        sx={{
          color: anchorEl
            ? theme.palette.primary.main
            : theme.palette.common.white,
        }}
        aria-label="more"
        id="long-button"
        aria-controls={open ? "long-menu" : undefined}
        aria-expanded={open ? "true" : undefined}
        aria-haspopup="true"
        onClick={handleClick}
        className={`p-0 w-fit h-fit`}
      >
        {Icon ?? (
          <div className="scale-75">
            <ThreeVerticalDots />
          </div>
        )}
      </IconButton>
      <CustomDropDown
        listItems={listItems}
        handleClose={handleCloseMenu}
        handleItemSelect={(type: string) => {
          if (handleItemSelect) {
            handleItemSelect(type);
            setAnchorEl(null);
          }
        }}
        anchorEl={anchorEl}
        position={position}
      />
    </>
  );
};
