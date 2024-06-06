import {ImageInfo} from "@/types";

const path = {
  login: "/",
  discover: "/discover",
  profile: "/profile",
  create: "/create",
  setting: "/setting",
  circle: "/circle",
  message: "/message",
  accountSetup: "/account-setup",
};

const appConstant = {
  backendUrl: process.env.NEXT_PUBLIC_API_URL,
  drawerWidth: {
    small: 80,
    medium: 200,
  },
  defaultaspectRatio: "4/5",
  aspectRatioList: ["1/1", "2/3", "3/2", "4/5", "5/4"],
  pageRoute: path,
  defaultProfileImage:
    "https://firebasestorage.googleapis.com/v0/b/witit-dcc9d.appspot.com/o/witit_images%2Fprofile_placeholder_image.png?alt=media&token=89758d76-12d6-4c4d-9d31-14ba03cee4c0",
};

export default appConstant;

export const defaultImageConstant: {image: ImageInfo; index: number} = {
  image: {
    name: "",
    src: "",
    croppedImageSrc: "",
    objectFit: "contain",
    aspectRatio: "4/5",
    zoom: 1,
    crop: {x: 0, y: 0},
    croppedPixels: {x: 0, y: 0},
    size: {width: 0, height: 0},
  },
  index: 0,
};
