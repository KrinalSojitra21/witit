import { Category } from "@/types/common";
import ActionCategoryIcon from "../../icons/createPost/selectCategoryIcons/ActionCategoryIcon";
import ArtCategoryIcon from "../../icons/createPost/selectCategoryIcons/ArtCategoryIcon";
import BusinessCategoryIcon from "../../icons/createPost/selectCategoryIcons/BusinessCategoryIcon";
import CasualCategoryIcon from "../../icons/createPost/selectCategoryIcons/CasualCategoryIcon";
import ComedyCategoryIcon from "../../icons/createPost/selectCategoryIcons/ComedyCategoryIcon";
import CosplayCategoryIcon from "../../icons/createPost/selectCategoryIcons/CosplayCategoryIcon";
import DIYCategoryIcon from "../../icons/createPost/selectCategoryIcons/DIYCategoryIcon";
import FantasyCategoryIcon from "../../icons/createPost/selectCategoryIcons/FantasyCategoryIcon";
import FashionCategoryIcon from "../../icons/createPost/selectCategoryIcons/FashionCategoryIcon";
import FitnessCategoryIcon from "../../icons/createPost/selectCategoryIcons/FitnessCategoryIcon";
import HistoricalCategoryIcon from "../../icons/createPost/selectCategoryIcons/HistoricalCategoryIcon";
import HorrorCategoryIcon from "../../icons/createPost/selectCategoryIcons/HorrorCategoryIcon";
import MusicCategoryIcon from "../../icons/createPost/selectCategoryIcons/MusicCategoryIcon";
import NSFWCategoryIcon from "../../icons/createPost/selectCategoryIcons/NSFWCategoryIcon";
import TravelCategoryIcon from "../../icons/createPost/selectCategoryIcons/TravelCategoryIcon";
import WellnessCategoryIcon from "../../icons/createPost/selectCategoryIcons/WellnessCategoryIcon";

export const CategoryList: Category[] = [
  {
    startIcon: <ArtCategoryIcon />,
    name: "Art",
  },
  {
    startIcon: <CasualCategoryIcon />,
    name: "Casual",
  },
  {
    startIcon: <CosplayCategoryIcon />,
    name: "Cosplay",
  },
  {
    startIcon: <FantasyCategoryIcon />,
    name: "Fantasy",
  },
  {
    startIcon: <ComedyCategoryIcon />,
    name: "Comedy",
  },
  {
    startIcon: <WellnessCategoryIcon />,
    name: "Wellness",
  },
  {
    startIcon: <FitnessCategoryIcon />,
    name: "Fitness",
  },
  {
    startIcon: <HorrorCategoryIcon />,
    name: "Horror",
  },
  {
    startIcon: <TravelCategoryIcon />,
    name: "Travel",
  },
  {
    startIcon: <HistoricalCategoryIcon />,
    name: "Historical",
  },
  {
    startIcon: <FashionCategoryIcon />,
    name: "Fashion",
  },
  {
    startIcon: <ActionCategoryIcon />,
    name: "Action",
  },
  {
    startIcon: <MusicCategoryIcon />,
    name: "Music",
  },
  {
    startIcon: <BusinessCategoryIcon />,
    name: "Business",
  },
  {
    startIcon: <DIYCategoryIcon />,
    name: "DIY",
  },
  {
    //NSFW in <CategorySelection /> is dependent on index
    startIcon: <NSFWCategoryIcon />,
    name: "NSFW",
  },
];
