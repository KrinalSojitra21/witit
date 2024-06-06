import { useEffect, useState } from "react";
import { Member } from "./components/Member";
import { UserBaseInfo } from "@/types/user";
import { getFollowers } from "@/api/user/getFollowers";
import { getFollowings } from "@/api/user/getFollowings";
import { CircularProgress } from "@mui/material";
import InfiniteScroll from "react-infinite-scroll-component";
import { useAuthContext } from "@/context/AuthContext";
import { NoDataFound } from "@/components/shared/NoDataFound";
import { blockUserIllustrator } from "@/utils/images";
import { useProfileContext } from "../../context/ProfileContext";
import { CustomImagePreview } from "@/components/shared/CustomImagePreview";

type MemberTab = {
  name: string;
  type: "CIRCLE" | "CIRCLING";
};

const memberTabs: MemberTab[] = [
  {
    name: "Circle Members",
    type: "CIRCLE",
  },
  {
    name: "Circling",
    type: "CIRCLING",
  },
];

type GetMemberProps = {
  memberType: "CIRCLE" | "CIRCLING";
  lastDoc?: { lastDocId: string; searchScore: number };
};

export const Members = () => {
  const { sendNotification } = useAuthContext();
  const { currentUser } = useProfileContext();

  const [memberType, setMemberType] = useState<"CIRCLE" | "CIRCLING">("CIRCLE");
  const [members, setMembers] = useState<UserBaseInfo[]>([]);
  const [hasMoreMember, setHasMoreMember] = useState(true);

  const getUserMembers = async ({ memberType, lastDoc }: GetMemberProps) => {
    if (!currentUser) return;

    if (memberType === "CIRCLE") {
      const membersData = await getFollowers({
        user_id: currentUser.userId,
        limit: 20,
        ...(lastDoc && { ...lastDoc }),
      });

      if (membersData.status === 200) {
        const currentMembers = membersData.data.followers;
        if (currentMembers.length < 20) {
          setHasMoreMember(false);
        }
        if (currentMembers.length > 0) {
          if (lastDoc) {
            setMembers([...members, ...currentMembers]);
          } else {
            setMembers(currentMembers);
          }
        }
      } else {
        sendNotification({ type: "ERROR", message: membersData.error });
      }
    } else {
      const membersData = await getFollowings({
        user_id: currentUser.userId,
        limit: 20,
        ...(lastDoc && { ...lastDoc }),
      });

      if (membersData.status === 200) {
        const currentMembers = membersData.data.followings;
        if (currentMembers.length < 20) {
          setHasMoreMember(false);
        }
        if (currentMembers.length > 0) {
          if (lastDoc) {
            setMembers([...members, ...currentMembers]);
          } else {
            setMembers(currentMembers);
          }
        }
      } else {
        sendNotification({ type: "ERROR", message: membersData.error });
      }
    }
  };

  useEffect(() => {
    setMembers([]);
    setHasMoreMember(true);
    getUserMembers({ memberType });
  }, [memberType, currentUser]);

  const fetchMoreMember = async () => {
    const lastDocId = members[members.length - 1]?.userId;
    const searchScore = members[members.length - 1]?.searchScore ?? 100;

    if (lastDocId && searchScore) {
      getUserMembers({
        memberType,
        lastDoc: {
          lastDocId,
          searchScore,
        },
      });
    }
  };

  return (
    <div className="flex flex-col w-full h-full ">
      <div className="flex justify-center w-full gap-2 text-sm font-medium border-b-[1px] border-b-grey-600 shadow-lg">
        {memberTabs.map((memberTab, index) => (
          <p
            key={index}
            className={`w-[140px] text-center py-4 cursor-pointer ${
              memberType === memberTab.type
                ? "font-medium border-b-2 border-b-primary-main"
                : "text-grey-300"
            }`}
            onClick={() => setMemberType(memberTab.type)}
          >
            {memberTab.name}
          </p>
        ))}
      </div>

      {members.length === 0 && !hasMoreMember ? (
        <div className="  h-full flex flex-col items-center justify-center ">
          <NoDataFound
            title="No Member Found"
            image={
              <div className="relative w-20 h-20 ">
                <CustomImagePreview image={blockUserIllustrator} />
              </div>
            }
          />
        </div>
      ) : (
        <div id="memberScrollableDiv" className="pb-5 flex-grow overflow-auto">
          <InfiniteScroll
            dataLength={members.length}
            next={fetchMoreMember}
            hasMore={hasMoreMember}
            loader={
              <div className="mt-4 text-common-black text-center w-full overflow-hidden">
                <CircularProgress size={20} className="text-common-white" />
              </div>
            }
            scrollableTarget="memberScrollableDiv"
          >
            <div className="flex-grow overflow-auto flex flex-col p-5 gap-6">
              {members.map((member, index) => {
                return <Member key={index} member={member} />;
              })}
            </div>
          </InfiniteScroll>
        </div>
      )}
    </div>
  );
};
