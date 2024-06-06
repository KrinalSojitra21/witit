import FeedIcon from "@/utils/icons/profile/FeedIcon";
import MomentsIcon from "@/utils/icons/profile/MomentsIcon";
import Head from "next/head";
import Profile from "@/components/profile/Profile";
import { QuestionnariesIcon } from "@/utils/icons/profile/QuestionnariesIcon";
import ProfileContext from "@/components/profile/Profile/context/ProfileContext";

type ContentType = "FEED" | "QUESTIONNAIRES" | "MOMENTS";

type ProfileTab = {
  name: string;
  type: ContentType;
  startIcon: JSX.Element;
};

const profileTabs: ProfileTab[] = [
  {
    name: "Feed",
    type: "FEED",
    startIcon: <FeedIcon />,
  },
  {
    name: "Questionnaires",
    type: "QUESTIONNAIRES",
    startIcon: <QuestionnariesIcon />,
  },
  {
    name: "Moments",
    type: "MOMENTS",
    startIcon: <MomentsIcon />,
  },
];

const ProfilePage = () => {
  return (
    <>
      <Head>
        <title>Witit - Profile</title>
      </Head>

      <ProfileContext>
        <Profile />
      </ProfileContext>
    </>
  );
};

export default ProfilePage;
