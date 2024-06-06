import { Question } from "./components/Question";
import { QuestionType } from "@/types/question";
import { RootState } from "@/redux/store";
import { useSelector } from "react-redux";
import { use, useEffect, useRef, useState } from "react";
import getQuestions from "@/api/question/getQuestions";
import { CircularProgress, IconButton } from "@mui/material";
import InfiniteScroll from "react-infinite-scroll-component";
import { useAuthContext } from "@/context/AuthContext";
import updateReply from "@/api/question/updateReply";
import changeQuestionLikeStatus from "@/api/question/changeQuestionLikeStatus";
import deleteQuestion from "@/api/question/deleteQuestion";
import OtherUserQuestions from "./components/OtherUserQuestions";
import CustomInputTextField from "@/components/shared/CustomInputTextField";
import { CustomImagePreview } from "@/components/shared/CustomImagePreview";
import { questionNotFound } from "@/utils/images/question";
import askQuestion from "@/api/question/askQuestion";
import ProfileContext, {
  useProfileContext,
} from "../Profile/context/ProfileContext";
import { NoDataFound } from "@/components/shared/NoDataFound";
import SendIcon from "@/utils/icons/circle/SendIcon";

type Parems = {
  lastDocId?: string | undefined;
  isLastReplyGiven?: boolean | undefined;
};

export const Questionnaries = () => {
  const [questionList, setQusetionList] = useState<QuestionType[]>([]);
  const [hasMoreQuestion, sethasMoreQuestion] = useState(true);
  const [commentReplyText, setCommentReplyText] = useState<string | null>(null);
  const [questionId, setQuestionId] = useState<string>("");
  const [isOtherUserQuestions, setIsOtherUserQuestions] = useState(false);
  const [askQuestionText, setAskQuestionText] = useState<string>("");

  const user = useSelector((state: RootState) => state.user);
  const { sendNotification } = useAuthContext();
  const { currentUser, setCurrentUser } = useProfileContext();

  useEffect(() => {
    fetchQuestionList();

    if (currentUser?.userId !== user?.userId) {
      setIsOtherUserQuestions(true);
    } else {
      setIsOtherUserQuestions(false);
    }
  }, [currentUser]);

  if (!user) {
    return <></>;
  }

  const fetchQuestionList = async (
    lastDocId?: string | undefined,
    isLastReplyGiven?: boolean | undefined
  ) => {
    const response = await getQuestions({
      user_id: user.userId,
      lastDocId,
      isLastReplyGiven,
      ...(currentUser?.userId !== user.userId && {
        otherUserId: currentUser?.userId,
      }),
    });

    if (response.status === 200 && response.data) {
      if (response.data.length < 10) {
        sethasMoreQuestion(false);
      } else {
        sethasMoreQuestion(true);
      }
      if (response.data.length >= 0) {
        if (lastDocId) {
          setQusetionList([...questionList, ...response.data]);
          return;
        }
      }

      setQusetionList(response.data);
      return;
    }

    sendNotification({ type: "ERROR", message: response.error });
  };
  if (!questionList) {
    return <></>;
  }
  const fetchMoreQuestions = () => {
    const lastDocId = questionList[questionList.length - 1].questionId;
    const lastReplyGiven = questionList[questionList.length - 1].reply;
    if (lastDocId && lastReplyGiven !== null) {
      fetchQuestionList(lastDocId, true);
    } else {
      fetchQuestionList(lastDocId, false);
    }
  };

  const replyQuestion = (questionData: QuestionType) => {
    setCommentReplyText(questionData.reply);

    questionList.map((value) => {
      if (value.questionId === questionData.questionId) {
        setQuestionId(questionData.questionId);
      }
      return value;
    });
  };

  const handleDeleteQuestion = async (questionId: string) => {
    const dropQustionList = questionList.filter((value) => {
      return value.questionId !== questionId;
    });

    setQusetionList(dropQustionList);

    const response = await deleteQuestion({
      user_id: user.userId,
      questionId: questionId,
    });

    if (response.status === 200) {
      sendNotification({
        type: "SUCCESS",
        message: "Question Deleted successfully",
      });
      return;
    }

    sendNotification({ type: "ERROR", message: response.error });
  };

  const handleAnswer = async (questionData: QuestionType) => {
    const updateQuestionList = questionList.map((value) => {
      if (value.questionId === questionData.questionId) {
        value.reply = commentReplyText;
      }
      return value;
    });

    setQusetionList(updateQuestionList);
    setQuestionId("");
    const response = await updateReply({
      questionId: questionData.questionId,
      user_id: user.userId,
      reply: commentReplyText,
    });
    if (response.status === 200) {
      console.log(response);
      return;
    }
    sendNotification({ type: "ERROR", message: response.error });
  };

  const handleLikeCount = async ({
    questionId,
    isLike,
  }: {
    questionId: string;
    isLike: boolean;
  }) => {
    const handleLikeRender = questionList.map((value) => {
      if (value.questionId === questionId) {
        if (isLike) {
          value.counts.like += 1;
          value.isUserLike = true;
        } else {
          value.counts.like -= 1;
          value.isUserLike = false;
        }
      }

      return value;
    });

    setQusetionList(handleLikeRender);

    const response = await changeQuestionLikeStatus({
      user_id: user.userId,
      questionId,
      isLike,
    });
    if (response.status === 200) {
      return;
    }
  };

  const handleAskQuestion = async () => {
    if (currentUser?.userId === user.userId) return;

    const response = await askQuestion({
      user_id: user.userId,
      creatorId: currentUser?.userId,
      question: askQuestionText,
    });
    if (response.status === 200 && response.data) {
      setQusetionList((preQuestions) => {
        if (response.data) {
          return [response.data, ...preQuestions];
        } else {
          return preQuestions;
        }
      });
      setAskQuestionText("");
      return;
    }

    sendNotification({ type: "ERROR", message: response.error });
  };

  return (
    <div className="flex flex-col w-full flex-grow overflow-hidden ">
      <div
        className="flex-grow overflow-auto flex flex-col py-3 gap-3 px-5"
        id="questionScrollableDiv"
      >
        {questionList.length === 0 && !hasMoreQuestion ? (
          <NoDataFound
            title="No Questions Found"
            image={
              <div className="relative w-20 h-20 ">
                <CustomImagePreview image={questionNotFound} />
              </div>
            }
            description=" It looks like nobody has asked a question yet. Lets wait for the first one!"
          />
        ) : (
          <InfiniteScroll
            dataLength={questionList.length}
            next={fetchMoreQuestions}
            hasMore={hasMoreQuestion}
            loader={
              <div className="text-common-black text-center w-full  overflow-hidden">
                <CircularProgress
                  size={20}
                  className="text-common-white mt-2"
                />
              </div>
            }
            className=" gap-3 w-full flex flex-col"
            scrollableTarget="questionScrollableDiv"
          >
            {questionList.map((question, index) => {
              return (
                <>
                  {isOtherUserQuestions ? (
                    <OtherUserQuestions
                      key={index}
                      questionData={question}
                      handleLikeCount={handleLikeCount}
                      questionId={questionId}
                    />
                  ) : (
                    <>
                      <Question
                        key={index}
                        questionData={question}
                        replyQuestion={replyQuestion}
                        setCommentReplyText={setCommentReplyText}
                        handleAnswer={handleAnswer}
                        handleLikeCount={handleLikeCount}
                        handleDeleteQuestion={handleDeleteQuestion}
                        commentReplyText={commentReplyText}
                        questionId={questionId}
                        setQuestionId={setQuestionId}
                      />
                    </>
                  )}
                </>
              );
            })}
          </InfiniteScroll>
        )}
      </div>

      {isOtherUserQuestions && (
        <div className="px-3 py-3">
          <CustomInputTextField
            multiline
            value={askQuestionText}
            className="bg-grey-800 border-grey-700"
            maxRows={3}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              setAskQuestionText(event.target.value);
            }}
            placeholder="What do you want to ask about?"
            EndIcon={
              <IconButton
                onClick={() => {
                  if (askQuestionText.length > 2) handleAskQuestion();
                }}
                className={
                  askQuestionText.length > 2
                    ? "text-primary-main cursor-pointer"
                    : "text-grey-300 cursor-default"
                }
              >
                <SendIcon />
              </IconButton>
            }
          />
        </div>
      )}
    </div>
  );
};
