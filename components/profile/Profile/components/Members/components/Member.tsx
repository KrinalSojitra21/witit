import CustomButton from "@/components/shared/CustomButton";
import { CustomImagePreview } from "@/components/shared/CustomImagePreview";
import { RootState } from "@/redux/store";
import { redirectTouserProfile } from "@/service/shared/redirectTouserProfile";
import { UserBaseInfo, UserType } from "@/types/user";
import VerifiedIcon from "@/utils/icons/circle/VerifiedIcon";
import { profilePlaceholderImage, temp1 } from "@/utils/images";
import Image from "next/image";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
type Props = {
  member: UserBaseInfo;
};

export const Member = ({ member }: Props) => {
  const user = useSelector((state: RootState) => state.user);
  const router = useRouter();

  return (
    <div
      className="flex justify-between items-center cursor-pointer"
      onClick={() => {
        router.push(redirectTouserProfile(member.userId, user?.userId));
      }}
    >
      <div className="flex items-center gap-3 ">
        <div className="relative w-[40px] h-[40px]  rounded-md bg-grey-600 overflow-hidden">
          <CustomImagePreview
            image={member.profileImage ?? profilePlaceholderImage}
          />
        </div>
        <div className="flex gap-0.5 items-center">
          <p className="text-sm font-light">{member.userName}</p>
          {member.userType === UserType.VERIFIED ? (
            <div className=" text-blue-light scale-[0.5]">
              <VerifiedIcon />
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};
