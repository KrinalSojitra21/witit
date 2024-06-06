import { Checkbox } from "@mui/material";
import CheckBoxFillCheckedIcon from "@/utils/icons/shared/CheckBoxFillCheckedIcon";
import CheckBoxEmptyIcon from "@/utils/icons/shared/CheckBoxEmptyIcon";

type Props = {
  labelText?: string;
  uncheckedColor?: string;
  checkedColor?: string;
  checkedIcon?: JSX.Element;
  icon?: JSX.Element;
} & Record<string, any>;

const CustomCheckbox = ({
  labelText,
  uncheckedColor,
  checkedColor,
  checkedIcon,
  icon,
  ...rest
}: Props) => {
  return (
    <>
      <Checkbox
        disableRipple
        icon={
          <span className="scale-75 text-grey-300">
            {icon ? icon : <CheckBoxEmptyIcon />}
          </span>
        }
        checkedIcon={
          <span className="scale-75">
            {checkedIcon ? checkedIcon : <CheckBoxFillCheckedIcon />}
          </span>
        }
        {...rest}
      />
    </>
  );
};

export default CustomCheckbox;
