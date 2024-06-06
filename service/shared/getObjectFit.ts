import { ObjectFit } from "@/types";

type Props = {
  w: number;
  h: number;
};

export const getObjectFit = ({ w, h }: Props) => {
  let data: ObjectFit = "horizontal-cover";

  if (h - w < 80) {
    data = "vertical-cover";
  } else {
    data = "horizontal-cover";
  }

  return data;
};
