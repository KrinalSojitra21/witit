import { theme } from "@/theme";
import { LockIcon } from "@/utils/icons/shared";
import { Box } from "@mui/material";

type Props = {
  modelName: string;
  startIcon?: JSX.Element;
  handleSelectModel: () => void;
  isSelected: boolean;
  className?: string;
  isActive: boolean;
};

export const ModelListItem = ({
  modelName,
  startIcon,
  handleSelectModel,
  isSelected,
  className = "",
  isActive,
}: Props) => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        gap: 1.5,
        px: 2.5,
        py: 2,
        borderRadius: 3,
        cursor: "pointer",
        border: 1,
        background: theme.palette.grey[800],
        borderColor: theme.palette.grey[800],
        color: theme.palette.grey[300],
      }}
      className={`${className} ${
        isSelected
          ? "border-primary-main bg-primary-dark text-common-white"
          : ""
      }`}
      onClick={() => handleSelectModel()}
    >
      {!isActive ? (
        <div className=" scale-75  text-grey-300">
          <LockIcon />
        </div>
      ) : null}
      {startIcon && startIcon}
      <p>{modelName}</p>
    </Box>
  );
};
