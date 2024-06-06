export type QuestionType = {
  questionId: string;
  userId: string;
  questioner: {
    id: string;
    userName: string;
    userType: string;
    profileImage: string;
  };
  question: string;
  reply: string | null ;
  createdAt: string;
  updatedAt: string;
  counts: {
    like: number;
  };
  isUserLike: boolean;
};
