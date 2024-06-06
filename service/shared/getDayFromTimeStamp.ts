import dayjs from "dayjs";
type Props = {
  time: string;
};

export const getDayFromTimeStamp = ({ time }: Props) => {
  let day = "";

  if (dayjs(time).unix() > dayjs().subtract(1, "day").unix()) {
    day = "Today";
  } else if (dayjs(time).unix() > dayjs().subtract(2, "day").unix()) {
    day = "Yesterday";
  } else {
    day = dayjs(time).format("DD MMM, YYYY");
  }

  return day;
};
