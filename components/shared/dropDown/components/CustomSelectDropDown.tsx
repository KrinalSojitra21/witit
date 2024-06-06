import { Menu, MenuItem } from "@mui/material";
import { theme } from "@/theme";

type Position = {
  vertical: "top" | "center" | "bottom";
  horizontal: "left" | "center" | "right";
};

type Props = {
  listItems: string[];
  isParentWidth?: boolean;
  handleClose: (event: React.MouseEvent<HTMLElement>) => void;
  handleItemSelect: (type: string) => void;
  anchorEl: null | HTMLElement;
  position?: Position;
} & Record<string, any>;

const CustomSelectDropDown = (props: Props) => {
  const {
    listItems,
    isParentWidth,
    handleClose,
    handleItemSelect,
    anchorEl,
    position,
    ...restProps
  } = props;

  return (
    <Menu
      id="long-menu"
      MenuListProps={{
        "aria-labelledby": "long-button",
      }}
      anchorEl={anchorEl}
      open={Boolean(anchorEl)}
      onClose={handleClose}
      sx={{
        width: 600,
        ".MuiPaper-root": {
          maxWidth: "185% !important",
          width: "600px",
          marginTop: "10px",
          border: "0.5px solid" + theme.palette.grey[600],
          borderRadius: 3,
          color: theme.palette.common.white,
          bgcolor: theme.palette.grey[800],
        },
        ".MuiList-root": {
          p: 0,
        },
      }}
      {...restProps}
    >
      {listItems.map((option, index) => (
        <div key={index}>
          <MenuItem
            onClick={(e) => {
              e.stopPropagation();
              if (option) handleItemSelect(option);
            }}
          >
            <div className="w-full flex gap-3 items-center  tracking-wider py-1.5">
              {option && (
                <div
                  className={`
                    
                        text-common-white text-[14px]
                  `}
                >
                  {option}
                </div>
              )}
            </div>
          </MenuItem>
          {index < listItems.length - 1 ? (
            <div className="h-[1px] w-[100%] m-auto bg-grey-700" />
          ) : null}
        </div>
      ))}
    </Menu>
  );
};

export default CustomSelectDropDown;

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
