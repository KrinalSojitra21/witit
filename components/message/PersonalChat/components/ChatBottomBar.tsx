import CustomInputTextField from "@/components/shared/CustomInputTextField";
import { useAuthContext } from "@/context/AuthContext";
import SendIcon from "@/utils/icons/circle/SendIcon";
import CreditIcon from "@/utils/icons/topbar/CreditIcon";
import { CircularProgress, IconButton } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import CloseIcon from "@/utils/icons/shared/CloseIcon";
import { Image, ImageState } from "@/types/post";
import { CustomImagePreview } from "@/components/shared/CustomImagePreview";
import sendMessage from "@/api/message/sendMessage";
import { Message } from "@/types/message";
import { ReduxUser } from "@/types/user";
import { uploadImageToStorage } from "@/service/firebase/uploadImage";
import { createImage } from "@/service/imageCropper/cropImage";
import CustomCreditMessageDrower from "./CustomCreditMessageDrower";
import { useMessageContext } from "../../context/MessageContext";
import { ObjectId } from "bson";
import { useDispatch } from "react-redux";
import SelectMultipleImages from "./SelectMultipleImages";
import { ImageInfo } from "@/types";

type Props = {
  user: ReduxUser | null;
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  messages: Message[];
  otherUserDetails: ReduxUser | null;
};

const ChatBottomBar = ({
  user,
  setMessages,
  messages,
  otherUserDetails,
}: Props) => {
  const [messageImage, setMessageImage] = useState<ImageState | null>(null);
  const [textMessage, setTextMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<Boolean>(false);
  const [createPostImages, setCreatePostImages] = useState<
    {
      image: ImageInfo;
      index: number;
    }[]
  >([]);
  const { selectedUser } = useMessageContext();
  const dispatch = useDispatch();
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const {
    setCustomDialogType,
    croppingImage,
    setCroppingImage,
    firebaseUser,
    customDialogType,
  } = useAuthContext();

  const { sendNotification } = useAuthContext();

  useEffect(() => {
    setCreatePostImages([]);
  }, [selectedUser]);

  useEffect(() => {
    if (createPostImages?.length > 0) {
      inputRef.current?.focus();
    }
  }, [createPostImages]);

  if (!user || !selectedUser) {
    return <></>;
  }

  const sendMessages = async () => {
    let FirebaseImage: Partial<Image>[] = [];
    const id = new ObjectId().toString();
    setIsLoading(true);

    if (createPostImages.length > 0) {
      const getFirebaseImages: Blob[] = [];

      for (const val of createPostImages) {
        const imageInfo = val.image.croppedImageSrc;
        const response = await fetch(imageInfo);
        const file = await response.blob();
        getFirebaseImages.push(file);
      }

      const selectedPhotosList = await Promise.all(
        getFirebaseImages.map((file) => {
          const folderName = "chat_images";
          return file
            ? uploadImageToStorage({
                folderName,
                file,
                metadata: {
                  userId: firebaseUser?.uid,
                },
              })
            : null;
        })
      );

      const iamgesList = await Promise.all(
        selectedPhotosList.map(async (value) => {
          const image = value && (await createImage(value));

          return {
            url: value,
            width: (image as HTMLImageElement).width,
            height: (image as HTMLImageElement).height,
          };
        })
      );

      FirebaseImage = iamgesList as Partial<Image>[];
    }

    const responseMessage = await sendMessage({
      receiverId: selectedUser.id,
      image: FirebaseImage.length > 0 ? FirebaseImage : null,
      user_id: user?.userId,
      messageId: id.toString(),
      message: textMessage,
    });

    if (responseMessage.status === 200 && responseMessage.data) {
      setMessages([responseMessage.data, ...messages]);
      setTextMessage(null);
      setIsLoading(false);
      setMessageImage(null);
      setCreatePostImages([]);

      return;
    }
    sendNotification({ type: "ERROR", message: responseMessage.error });
    setIsLoading(false);
  };

  let messageId = "";
  const id = new ObjectId();
  messageId = id.toString();

  const selectImages = (images: { image: ImageInfo; index: number }[]) => {
    if (createPostImages.length < 0) {
      setCreatePostImages(images);
    } else {
      setCreatePostImages([...createPostImages, ...images]);
    }
  };

  const haldleremoveImages = (index: number) => {
    const removeImages = createPostImages.filter((val, id) => index !== id);
    setCreatePostImages(removeImages);
  };

  return (
    <div className="w-full bg-grey-800  px-3 flex flex-col py-3 ">
      {/* {croppingImage?.image?.src != "" ? (
        <div
          className=" w-[60px] h-[60px]  aspect-square relative rounded-md hover:border border-primary-main border-solid"
          onMouseEnter={() => {
            setisImageHovered(true);
          }}
          onMouseLeave={() => {
            setisImageHovered(false);
          }}
          onClick={() => {
            // setCustomDialogType("CROPSINGLEIMG");
          }}
        >
          {isImageHovered ? (
            <div
              className=" absolute top-0 right-0 text-white z-20"
              onClick={() => {
                setCroppingImage(defaultImageConstant);
              }}
            >
              <CloseIcon />
            </div>
          ) : null}
          <div className="relative rounded-md bg-grey-600">
            <CustomImagePreview
              image={croppingImage.image.src ? croppingImage.image.src : ""}
            />
          </div>
        </div>
      ) : null} */}
      {createPostImages?.length > 0 && (
        <div className="w-full h-[70px] flex  justify-between items-center pb-3">
          <div className="flex gap-2">
            {createPostImages.map((value, index) => {
              return (
                <>
                  <div className="relative rounded-lg bg-grey-600 h-[70px] w-[70px] overflow-hidden aspect-square">
                    <div
                      className="absolute z-10 right-0 cursor-pointer opacity-40 hover:opacity-100 "
                      onClick={() => haldleremoveImages(index)}
                    >
                      <CloseIcon />
                    </div>
                    <CustomImagePreview image={value.image.src} />
                  </div>
                </>
              );
            })}
          </div>
          <div
            className="mr-3 scale-150  cursor-pointer opacity-40 hover:opacity-100"
            onClick={() => {
              setCreatePostImages([]);
            }}
          >
            <CloseIcon />
          </div>
        </div>
      )}
      <div className=" w-full flex gap-3">
        <div className="aspect-square bg-grey-700 rounded-xl h-[60px]">
          {!messageImage && (
            <IconButton className=" w-full h-full  rounded-lg text-grey-100 hover:text-primary-main   p-0 m-0 ">
              <SelectMultipleImages
                isEnabled={true}
                isSmall={false}
                setSelectdImgs={selectImages}
              />
            </IconButton>
          )}
        </div>

        <div className="w-full ">
          <CustomInputTextField
            multiline
            maxRows={3}
            inputRef={inputRef}
            placeholder="Type a message ..."
            value={textMessage ?? ""}
            onKeyDown={(e: React.KeyboardEvent<HTMLDivElement>) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                if (textMessage || createPostImages.length > 0) {
                  sendMessages();
                }
              }
            }}
            EndIcon={
              <IconButton
                type="submit"
                onClick={() => {
                  if (textMessage || createPostImages.length > 0) {
                    sendMessages();
                  }
                }}
                className={
                  textMessage || createPostImages.length > 0
                    ? "text-primary-main cursor-pointer"
                    : "text-grey-300 cursor-default"
                }
              >
                {isLoading ? (
                  <CircularProgress color="inherit" size={24} />
                ) : (
                  <SendIcon />
                )}
              </IconButton>
            }
            className="bg-grey-700 border-none rounded-xl h-fit"
            onChange={(e: any) => {
              setTextMessage(e.target.value);
            }}
          />
        </div>

        <IconButton
          onClick={() => {
            setCustomDialogType("CREDITS-MESSAGE");
          }}
          className=" bg-grey-700 text-grey-100 hover:text-primary-main w-[60px] h-[60px] rounded-xl flex items-center justify-center"
        >
          <CreditIcon />
        </IconButton>
      </div>
      {customDialogType === "CREDITS-MESSAGE" ? (
        <CustomCreditMessageDrower
          creatorId={selectedUser.id}
          messageId={messageId}
          setMessages={setMessages}
          messages={messages}
        />
      ) : null}
    </div>
  );
};

export default ChatBottomBar;
