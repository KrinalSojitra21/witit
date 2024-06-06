import { theme } from "@/theme";
import styled from "@emotion/styled";
import { Slider } from "@mui/material";

export const CustomSlider = styled(Slider)({
  color: theme.palette.primary.main,
  height: 10,
  "& .MuiSlider-track": {
    border: "none",
  },
  "& .MuiSlider-rail": {
    background: theme.palette.grey[700],
    opacity: 1,
  },
  "& .MuiSlider-thumb": {
    height: 20,
    width: 10,
    backgroundColor: theme.palette.common.white,
    borderRadius: 2,
    "&:focus, &:hover, &.Mui-active, &.Mui-focusVisible": {
      boxShadow: "inherit",
    },
    "&:before": {
      display: "none",
    },
  },
  "& .MuiSlider-valueLabel": {
    borderRadius: 6,
    backgroundColor: theme.palette.primary.main,
    minWidth: 50,
  },
});
// const PrettoSlider = styled(Slider)({
//     color: theme.palette.primary.main,
//     height: 10,
//     "& .MuiSlider-track": {
//       border: "none",
//     },
//     "& .MuiSlider-rail": {
//       background: theme.palette.grey[700],
//       opacity: 1,
//     },
//     "& .MuiSlider-thumb": {
//       height: 16,
//       width: 20,
//       backgroundColor: theme.palette.common.white,
//       borderRadius: 4,
//       "&:focus, &:hover, &.Mui-active, &.Mui-focusVisible": {
//         boxShadow: "inherit",
//       },
//       "&:before": {
//         display: "none",
//       },
//     },
//     "& .MuiSlider-valueLabel": {
//       borderRadius: "25% 25% 25% 25%",
//       backgroundColor: theme.palette.primary.main,
//     },
//   });
