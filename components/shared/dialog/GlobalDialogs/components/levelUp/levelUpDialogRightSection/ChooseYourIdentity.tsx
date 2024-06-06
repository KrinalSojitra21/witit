import CustomCheckbox from "@/components/shared/CustomCheckbox";
import React, { useEffect, useState } from "react";
import { UseFormGetValues, UseFormSetValue } from "react-hook-form";
import { Store } from "@/types/user";
import CustomButton from "@/components/shared/CustomButton";
import Crown from "@/utils/icons/levelUp/Crown";
import NormalLeftArrowIcon from "@/utils/icons/shared/NormalLeftArrowIcon";
import CloseIcon from "@/utils/icons/shared/CloseIcon";
type document = {
  name: string;
  value: boolean;
};

type Props = {
  setValue: UseFormSetValue<Store>;
  setcurrentStep: React.Dispatch<React.SetStateAction<number>>;
  setCustomDialogType: React.Dispatch<React.SetStateAction<string | null>>;
  currentStep: number;
  getValues: UseFormGetValues<Store>;
};

const ChooseYourIdentity = ({
  setValue,
  setcurrentStep,
  getValues,
  currentStep,
  setCustomDialogType,
}: Props) => {
  const [DocumentList, setDocumentList] = useState<document[]>([
    { name: "Driver’s License", value: false },
    { name: "Passport", value: false },
    { name: "National Id Card", value: false },
    { name: "State ID", value: false },
  ]);
  const [isDisabled, setisDisabled] = useState<Boolean>(false);
  const [getId, setgetId] = useState<string | null>(null);
  const handleCheked = (index: number) => {
    const DocumentDeatailsList = DocumentList.map((val, id) => {
      if (id === index) {
        val.value = true;
        setValue("documentName", val.name);
        setgetId(val.name);
      } else if (id !== index) {
        val.value = false;
      }
      return val;
    });
    setDocumentList(DocumentDeatailsList);
  };

  useEffect(() => {
    let selectedName = getValues("documentName");
    if (!getId) {
      const DocumentDeatailsList = DocumentList.map((val, id) => {
        if (val.name === selectedName) {
          val.value = true;
          setValue("documentName", val.name);
          setgetId(val.name);
        } else if (val.name !== selectedName) {
          val.value = false;
        }
        return val;
      });
      setDocumentList(DocumentDeatailsList);
    }

    getId ? setisDisabled(false) : setisDisabled(true);
  }, [getId]);

  return (
    <>
      <div className="flex w-full items-start gap-5">
        <div
          className={` flex items-center text-common-white pt-1`}
          onClick={() => {
            if (currentStep > 0) {
              setcurrentStep(currentStep - 1);
              setisDisabled(false);
            }
          }}
        >
          <NormalLeftArrowIcon />
        </div>
        <div className="flex flex-grow flex-col gap-3 ">
          {" "}
          <div className="w-full flex justify-between items-center">
            <p className="text-base flex gap-2 w-full">
              <span className="flex justify-center bg-primary-main items-center  w-6 h-6 rounded-full text-[14px]">
                1
              </span>{" "}
              Confirm Your Identity
            </p>
            <span className=" bg-grey-500 text-grey-200  flex justify-center items-center w-7 h-6 rounded-full text-[14px] mr-2">
              2
            </span>
            <div
              className="w-fit text-grey-100  z-10 flex gap-2 cursor-pointer"
              onClick={() => {
                setCustomDialogType(null);
              }}
            >
              <CloseIcon isBorderRounded={true} />
            </div>
          </div>
          <div className=" w-full h-[0.2rem] bg-gradient-to-r from-primary-main " />
        </div>
      </div>
      <div className="flex flex-col gap-5 pb-[52px] px-3 h-full mt-3 justify-between">
        <div className="flex flex-col gap-2 h-full ">
          <p>Select Your ID</p>
          <p className=" text-xs font-light text-grey-100">
            The ID you choose must include your name, photo & birthdate. It
            won’t be shared on your profile.
          </p>

          <div className="flex flex-col gap-1">
            {DocumentList.map((val, id) => {
              return (
                <>
                  {" "}
                  <span className="flex justify-between items-center border-b  border-b-grey-700">
                    {val.name}
                    <CustomCheckbox
                      key={id}
                      onClick={() => {
                        handleCheked(id);
                      }}
                      checked={val.value}
                    />
                  </span>
                </>
              );
            })}
          </div>
          <p className=" text-xs font-light text-grey-100 pt-1">
            *Your ID will be stored securely and deleted within 30 days after we
            finish confirming your identity. We might use trusted service
            providers to help review your information.
          </p>
        </div>
        <CustomButton
          disabled={isDisabled}
          type="submit"
          name={"Next"}
          className={`${
            isDisabled ? "bg-grey-700 text-common-white text-opacity-50" : ""
          }  py-3`}
          handleEvent={() => {
            setcurrentStep((prev) => prev + 1);
          }}
        />
      </div>
    </>
  );
};

export default ChooseYourIdentity;
