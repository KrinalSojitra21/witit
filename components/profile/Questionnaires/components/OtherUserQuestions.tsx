import { CustomImagePreview } from "@/components/shared/CustomImagePreview";
import CustomInputTextField from "@/components/shared/CustomInputTextField";
import { RootState } from "@/redux/store";
import { redirectTouserProfile } from "@/service/shared/redirectTouserProfile";
import { theme } from "@/theme";
import { QuestionType } from "@/types/question";
import { profilePlaceholderImage } from "@/utils/images";
import { Favorite, FavoriteBorder } from "@mui/icons-material";
import { Checkbox, Divider, IconButton } from "@mui/material";
import dayjs from "dayjs";
import { useRouter } from "next/router";

import { useSelector } from "react-redux";

type Props = {
  questionData: QuestionType;

  handleLikeCount: ({
    questionId,
    isLike,
  }: {
    questionId: string;
    isLike: boolean;
  }) => void;

  questionId: string;
};

const OtherUserQuestions = ({
  questionData,

  handleLikeCount,
}: Props) => {
  const router = useRouter();

  const user = useSelector((state: RootState) => state.user);
  if (!user) {
    return <></>;
  }

  return (
    <div className=" flex gap-4 p-4 bg-grey-900 rounded-lg">
      <div className="overflow-hidden min-w-[40px] h-10 rounded-md relative bg-grey-600">
        <CustomImagePreview
          image={
            questionData.questioner.profileImage ?? profilePlaceholderImage
          }
        />
      </div>

      <div className="flex flex-col gap-4 flex-grow  justify-center">
        <div className="flex justify-between">
          <div className=" flex flex-col justify-center gap-0.5 ">
            <p className="text-sm">{questionData.question}</p>
            <div className="flex items-center gap-1.5">
              <p className="text-xs text-grey-300 ">
                Asked By{" "}
                <span
                  className="underline font-medium cursor-pointer text-grey-200"
                  onClick={(e) => {
                    e.stopPropagation();
                    router.push(
                      redirectTouserProfile(
                        questionData.questioner.id,
                        user?.userId
                      )
                    );
                  }}
                >
                  {questionData.questioner.userName}
                </span>
              </p>
              <div className="w-[3px] h-[3px] rounded-full bg-grey-300" />
              <p className="text-xs text-grey-300 flex flex-col gap-2">
                {" "}
                {Math.abs(
                  dayjs(questionData.createdAt).diff(dayjs(), "day")
                ) === 0
                  ? 1
                  : Math.abs(
                      dayjs(questionData.createdAt).diff(dayjs(), "day")
                    )}{" "}
                Days Ago
              </p>
            </div>
          </div>
          <div className="flex text-grey-300 gap-2 items-start ">
            <div className="  ">
              <div className=" scale-75">
                <Checkbox
                  sx={{ padding: 0 }}
                  onChange={(e) => {
                    handleLikeCount({
                      questionId: questionData.questionId,
                      isLike: e.target.checked,
                    });
                  }}
                  checked={questionData.isUserLike ? true : false}
                  icon={<FavoriteBorder className=" text-grey-300 " />}
                  checkedIcon={<Favorite color={`error`} />}
                />
              </div>
              <p className=" text-[0.6rem] text-center text-grey-300">
                {questionData.counts.like}
              </p>
            </div>
          </div>
        </div>

        {questionData.reply ? (
          <>
            {" "}
            <Divider
              sx={{
                borderColor: theme.palette.grey[700],
              }}
            />
            <p className=" text-grey-100 font-light">hello world</p>
          </>
        ) : null}
      </div>
    </div>
  );
};
export default OtherUserQuestions;
