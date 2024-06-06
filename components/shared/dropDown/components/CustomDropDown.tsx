import { Menu, MenuItem, PopoverVirtualElement } from "@mui/material";
import { theme } from "@/theme";
import { DropDownItem } from "@/types";

type Position = {
  vertical: "top" | "center" | "bottom";
  horizontal: "left" | "center" | "right";
};

type Props = {
  listItems: DropDownItem[];
  isParentWidth?: boolean;
  handleClose: (event: React.MouseEvent<HTMLElement>) => void;
  handleItemSelect: (type: string) => void;
  anchorEl: null | HTMLElement;
  position?: Position;
} & Record<string, any>;

const CustomDropDown = (props: Props) => {
  const {
    listItems,
    isParentWidth,
    handleClose,
    handleItemSelect,
    anchorEl,
    position,
    ...restProps
  } = props;

  const pos = position ? position.vertical[0] + position?.horizontal[0] : "tl";

  return (
    <Menu
      id="long-menu"
      MenuListProps={{
        "aria-labelledby": "long-button",
      }}
      anchorEl={anchorEl}
      open={Boolean(anchorEl)}
      onClose={handleClose}
      anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      transformOrigin={position}
      sx={{
        ".MuiPaper-root": {
          width: isParentWidth ? anchorEl && anchorEl.offsetWidth : "auto",
          boxShadow: "-4px 2px 40px 4px rgba(0, 0, 0, 0.95)",
          border: "0.5px solid" + theme.palette.grey[600],
          borderRadius: 3,
          color: theme.palette.common.white,
          bgcolor: theme.palette.grey[800],
        },
        ".MuiList-root": {
          p: 0,
        },
      }}
      className={
        position?.horizontal[0] !== "c"
          ? pos === "tr"
            ? "[&>.MuiPaper-root]:rounded-tr-none"
            : pos === "bl"
            ? "[&>.MuiPaper-root]:rounded-bl-none"
            : pos === "br"
            ? "[&>.MuiPaper-root]:rounded-br-none"
            : "[&>.MuiPaper-root]:rounded-tl-none"
          : ""
      }
      {...restProps}
    >
      {listItems.map((option, index) => (
        <div key={index}>
          <MenuItem
            onClick={(e) => {
              e.stopPropagation();
              if (option.actionType) handleItemSelect(option.actionType);
            }}
            sx={{
              "&.Mui-selected": {
                borderRadius: "4px",
                backgroundColor: theme.palette.grey[700],
              },
              "&.Mui-selected:hover": {
                borderRadius: "4px",
                backgroundColor: theme.palette.grey[700],
              },
              "&:hover": {
                backgroundColor: theme.palette.grey[700],
                "& p": {
                  color:
                    option.actionType === "DELETE"
                      ? theme.palette.error.main + " !important"
                      : theme.palette.common.white + " !important",
                },
              },
            }}
          >
            <div className="w-full flex gap-3 items-center text-xs tracking-wider py-1.5">
              {option.startIcon && (
                <div
                  className={`${
                    option.actionType === "DELETE"
                      ? " text-error-main"
                      : " text-common-white"
                  }`}
                >
                  {option.startIcon}
                </div>
              )}
              <p
                className={`w-full flex flex-col justify-center ${
                  option.actionType === "DELETE"
                    ? " text-error-main"
                    : " text-grey-200"
                }`}
              >
                {option.title}
              </p>
              {option.endIcon && (
                <div
                  className={`${
                    option.actionType === "DELETE"
                      ? " text-error-main"
                      : " text-common-white"
                  }`}
                >
                  {option.endIcon}
                </div>
              )}
            </div>
          </MenuItem>
          {index < listItems.length - 1 ? (
            <div className="h-[1px] w-[80%] m-auto bg-grey-700" />
          ) : null}
        </div>
      ))}
    </Menu>
  );
};

export default CustomDropDown;

{
  /* <div className="w-full  flex justify-center">
              <Divider
                sx={{
                  width: "100px",
                  borderColor: theme.palette.grey[500],
                }}
              />
            </div> */
}
{
  /* {list.length - 1 !== index ? (
              <Divider
                sx={{
                  borderColor: theme.palette.grey[600],
                }}
              />
            ) : null} */
}
