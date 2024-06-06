import React from "react";
import { Message } from "@/types/message";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import dayjs from "dayjs";
import { CustomImagePreview } from "@/components/shared/CustomImagePreview";

type Props = {
  msg: Message;
};

const ImageItem = ({ msg }: Props) => {
  let bgColor: string = "bg-primary-main";
  let position: string = "justify-end";
  let isMsg: boolean = false;
  let borderStyle = "rounded-br-lg rounded-t-lg";

  const user = useSelector((state: RootState) => state.user);

  if (msg.receiverId !== user?.userId) {
    bgColor = "bg-primary-main";
    position = "items-end";
    borderStyle = "rounded-bl-lg rounded-t-lg";
  } else {
    bgColor = "bg-grey-700";
    position = "items-start";
    borderStyle = "rounded-br-lg rounded-t-lg";
  }

  if (msg.type === "MWITHI") {
    isMsg = true;
  } else {
    isMsg = false;
  }
  return (
    <div className={`flex flex-col gap-2 mt-4  ${position}`}>
      <div
        className={`lg:w-[350px]  min-w-[350px]   flex flex-col bg-grey-700 overflow-hidden  ${borderStyle} ${position} bg-grey-700`}
      >
        {/* {msg.image.map((val) => {
          return (
            <>
              <div
                className={`min-w-[296px] min-h-[300px] m-[2px] bg-grey-600 relative overflow-hidden rounded-md`}
              >
                <CustomImagePreview image={val?.url} />
              </div>
            </>
          );
        })} */}
        <div
          className={`grid grid-cols-6 w-[350px] h-[300px] grid-rows-5 gap-1 relative cursor-pointer aspect-square overflow-hidden`}
        >
          {msg.image.map((postImage, index) => {
            if (index < 5) {
              return (
                <div
                  key={index}
                  className={`${
                    msg.image.length === 1
                      ? "col-span-6 row-span-4 aspect-square"
                      : msg.image.length === 2
                      ? "col-span-3 row-span-6"
                      : msg.image.length === 3
                      ? index === 0
                        ? "col-span-3 row-span-6"
                        : "col-span-3 row-span-3"
                      : msg.image.length === 4
                      ? "col-span-3 row-span-3"
                      : msg.image.length === 5
                      ? index === 0 || index === 1
                        ? "col-span-3 row-span-2"
                        : "col-span-2 row-span-2"
                      : index === 0 || index === 1
                      ? "col-span-3 row-span-3"
                      : "col-span-2 row-span-2"
                  } `}
                >
                  <div className="w-full h-full relative overflow-hidden">
                    {msg.image.length > 5 && index === 4 ? (
                      <div className="absolute z-20 w-full h-full flex justify-center items-center text-4xl">
                        +{msg.image.length - 5}
                      </div>
                    ) : null}

                    <div
                      className={`relative object-cover rounded-md overflow-hidden w-full h-full  ${
                        index === 4 && msg.image.length > 5
                          ? "opacity-30"
                          : "opacity-100"
                      }`}
                    >
                      <CustomImagePreview
                        image={postImage.url}
                        className="object-cover object-center"
                      />
                    </div>
                  </div>
                </div>
              );
            }
          })}
        </div>
        {isMsg && (
          <div
            className={`text-sm min-h-6 font-light px-3 py-1  rounded-bl-lg w-full break-words ${bgColor}`}
          >
            {msg.message}
          </div>
        )}
      </div>
      <p className="text-grey-400 text-xs">
        {dayjs(msg?.createdAt).format("hh:mm A")}
      </p>
    </div>
  );
};

export default ImageItem;
