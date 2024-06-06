import { Image } from "./post";


export type UserInfo = {
  id: string;
  userName: string;
  profileImage: string | null;
  userType: string;
};

export type RecentMessage = {
  messageId: string;
  lastMessage: string;
  messageStatus: string;
  receiver: UserInfo;
  sender: UserInfo;
  createdAt: string;
  updatedAt: string;
};

export type Message = {
  messageId: string;
  senderId: string;
  receiverId: string;
  type: string;
  message: string | null;
  image: Image[];
  credit: number | null;
  createdAt: string;
  updatedAt: string;
};
