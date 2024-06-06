import { AspectRatio, Resolution } from "@/types/ai";

type AspectRatioItem = {
  displayName: string;
  applicable: string;
  tag: AspectRatio;
};

export const aspectRatioList: AspectRatioItem[] = [
  {
    displayName: "3:2",
    applicable: "3/2",
    tag: "3:2",
  },
  {
    displayName: "5:4",
    applicable: "5/4",
    tag: "5:4",
  },
  {
    displayName: "1:1",
    applicable: "1/1",
    tag: "1:1",
  },
  {
    displayName: "4:5",
    applicable: "4/5",
    tag: "4:5",
  },
  {
    displayName: "2:3",
    applicable: "2/3",
    tag: "2:3",
  },
];

type ResolutionItem = {
  displayName: string;
  applicable: string;
  tag: Resolution;
};
export const ResolutionList: ResolutionItem[] = [
  { displayName: "1x", applicable: "1", tag: 1 },
  { displayName: "1.5x", applicable: "1.5", tag: 1.5 },
  { displayName: "2x", applicable: "2", tag: 2 },
];
