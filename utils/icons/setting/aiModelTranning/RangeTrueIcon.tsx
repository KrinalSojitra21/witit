import { theme } from "@/theme";
import React from "react";
type Props = {
  photosLength: number;
};
const RangeTrueIcon = ({ photosLength }: Props) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="22"
      height="22"
      viewBox="0 0 22 22"
      fill="none"
    >
      <rect
        width="22"
        height="22"
        rx="11"
        fill={
          photosLength <= 10
            ? theme.palette.error.main
            : photosLength <= 20
            ? theme.palette.orange.main
            : theme.palette.success.main
        }
      />
      <path
        d="M9.58306 13.7751C9.35598 13.7752 9.13819 13.6849 8.97775 13.5242L7.14769 11.6948C6.95077 11.4978 6.95077 11.1785 7.14769 10.9816C7.34467 10.7846 7.66397 10.7846 7.86095 10.9816L9.58306 12.7037L14.1391 8.14769C14.336 7.95077 14.6553 7.95077 14.8523 8.14769C15.0492 8.34467 15.0492 8.66397 14.8523 8.86095L10.1884 13.5242C10.0279 13.6849 9.81015 13.7752 9.58306 13.7751Z"
        fill="white"
        stroke="white"
      />
    </svg>
  );
};

export default RangeTrueIcon;
