import { type } from "os";
import { Point } from "react-easy-crop";

export type ObjectFit =
  | "horizontal-cover"
  | "vertical-cover"
  | "auto-cover"
  | "contain";

export type ImageInfo = {
  name: string;
  src: string;
  croppedImageSrc: string;
  objectFit: ObjectFit;
  aspectRatio: string;
  zoom: number;
  crop: Point;
  croppedPixels: any;
  size: { width: number; height: number };
};

export type DropDownItem = {
  startIcon?: JSX.Element;
  endIcon?: JSX.Element;
  title: string;
  actionType?: string;
  isMyProfile?: boolean;
};
export type SingleImagePlaceholder = {
  placeholderTitle: React.ReactElement;
  placeholderImg: React.ReactElement;
};

export type DialogBoxType =
  | null
  | "CREDITS-VIEWPROMPT"
  | "CREDITS-MESSAGE"
  | "CREDITS-WITHDRAW"
  | "CREDITS-VIEWPROMPT"
  | "CREDITS-VIEWPROMPT"
  | "CREATEMOMENT"
  | "DOUNBLOCK"
  | "CREATEOFFERDETAILS"
  | "CREATEOFFER"
  | "EDITMODEL"
  | "PRIVACYPOLICY"
  | "TERMSOFSERVICE"
  | "CONTENTPOLICY"
  | "CONTACTUS"
  | "AIMODELTRAINING"
  | "LEVELUP"
  | "CIRCLEPOST"
  | "FILTER"
  | "VIEWOFFER-${number}";

export type AmountPerCredit = {
  add: number;
  withdraw: number;
};
