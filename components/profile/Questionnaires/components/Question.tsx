import { CustomImagePreview } from "@/components/shared/CustomImagePreview";
import CustomInputTextField from "@/components/shared/CustomInputTextField";
import { RootState } from "@/redux/store";
import { redirectTouserProfile } from "@/service/shared/redirectTouserProfile";
import { theme } from "@/theme";
import { QuestionType } from "@/types/question";
import SendIcon from "@/utils/icons/circle/SendIcon";
import { profilePlaceholderImage } from "@/utils/images";
import { Favorite, FavoriteBorder } from "@mui/icons-material";
import { Checkbox, Divider, IconButton } from "@mui/material";
import dayjs from "dayjs";
import { useRouter } from "next/router";

import { useSelector } from "react-redux";

type Props = {
  questionData: QuestionType;
  replyQuestion: (questionData: QuestionType) => void;
  setCommentReplyText: React.Dispatch<React.SetStateAction<string | null>>;
  handleAnswer: (questionData: QuestionType) => void;
  commentReplyText: string | null;
  setQuestionId: React.Dispatch<React.SetStateAction<string>>;
  handleLikeCount: ({
    questionId,
    isLike,
  }: {
    questionId: string;
    isLike: boolean;
  }) => void;
  handleDeleteQuestion: (questionData: string) => void;
  questionId: string;
};

export const Question = ({
  questionData,
  replyQuestion,
  setCommentReplyText,
  handleAnswer,
  handleLikeCount,
  handleDeleteQuestion,
  commentReplyText,
  questionId,
  setQuestionId,
}: Props) => {
  const router = useRouter();

  const handleClose = (e: React.MouseEvent<HTMLElement>) => {
    if (e.target === e.currentTarget) {
      questionId !== "" && setQuestionId("");
    }
  };
  const user = useSelector((state: RootState) => state.user);
  if (!user) {
    return <></>;
  }

  return (
    <div
      className=" flex gap-4 p-4 bg-grey-900 rounded-lg"
      onClick={handleClose}
    >
      <div className="overflow-hidden min-w-[40px] h-10 rounded-md relative bg-grey-600">
        <CustomImagePreview
          image={
            questionData.questioner.profileImage ?? profilePlaceholderImage
          }
        />
      </div>

      <div className="flex flex-col gap-4 flex-grow">
        <div className="flex justify-between">
          <div className=" flex flex-col gap-0.5">
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

        {questionData.reply &&
          questionData.reply.length !== null &&
          questionData.questionId !== questionId && (
            <>
              <Divider
                sx={{
                  borderColor: theme.palette.grey[700],
                }}
              />
              <p className=" font-light text-grey-100">{questionData.reply}</p>
              <div className="flex  gap-5 items-center">
                <p
                  className="text-primary-main font-medium text-sm cursor-pointer"
                  onClick={() => {
                    replyQuestion(questionData);
                  }}
                >
                  Edit
                </p>
                <p
                  className="text-error-main font-medium text-sm cursor-pointer"
                  onClick={() => {
                    handleDeleteQuestion(questionData.questionId);
                  }}
                >
                  Delete
                </p>
              </div>
            </>
          )}
        {questionData.reply === null &&
          questionData.questionId !== questionId && (
            <>
              <div className="flex  gap-5 items-center">
                <p
                  className="text-primary-main font-medium text-sm cursor-pointer"
                  onClick={() => {
                    replyQuestion(questionData);
                  }}
                >
                  Reply
                </p>
                <p
                  className="text-error-main font-medium text-sm cursor-pointer"
                  onClick={() => {
                    handleDeleteQuestion(questionData.questionId);
                  }}
                >
                  Delete
                </p>
              </div>
            </>
          )}
        {questionData.questionId === questionId && (
          <CustomInputTextField
            multiline
            inputFieldClass=" font-light text-grey-100"
            className="bg-grey-800 border-grey-700 rounded-lg py-1 pl-3 pr-0 "
            maxRows={3}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              setCommentReplyText(event.target.value);
            }}
            value={commentReplyText ?? ""}
            placeholder="What do you want to reply?"
            EndIcon={
              <IconButton
                onClick={() => {
                  if (commentReplyText && commentReplyText.length > 5) {
                    handleAnswer(questionData);
                  }
                }}
                className={
                  commentReplyText && commentReplyText.length > 5
                    ? "text-primary-main cursor-pointer"
                    : "text-grey-300 cursor-default"
                }
              >
                <SendIcon />
              </IconButton>
            }
          />
        )}

        {/* 
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-3 ">
            <div className="relative">
              <Image
                fill
                src={temp1}
                alt=""
                className="relative w-[30px] h-[30px] rounded-full"
              />
            </div>
            <div className="flex gap-0.5 items-center">
              <p className="text-[13px] font-light">Gerdes</p>
              <div className="text-primary-light scale-[0.5]">
                <VerifiedIcon />
              </div>
            </div>
          </div>
          <p className="text-xs font-extralight tracking-wide leading-[18px]">
            My favorite color is every color and none of the colors all at once
            but also it not even a moment. Does that definitely make sense?
          </p>
        </div> */}
      </div>
    </div>
  );
};
