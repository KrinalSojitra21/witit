import React, { useEffect, useState } from "react";
import ManVector from "@/utils/images/aiModelTraining/ManVector.svg";
import WomanVector from "@/utils/images/aiModelTraining/WomanVector.svg";
import Image from "next/image";
import { Control, UseFormGetValues } from "react-hook-form/dist/types";
import { UseFormSetValue, Controller } from "react-hook-form";
import { Aimodel } from "@/types/user";
import CustomButton from "@/components/shared/CustomButton";
import { RootState } from "@/redux/store";
import { useSelector } from "react-redux";
import ArrowDownIcon from "@/utils/icons/shared/ArrowDownIcon";

type Props = {
  getValues: UseFormGetValues<Aimodel>;
  setCurrentState: React.Dispatch<React.SetStateAction<number>>;
  currentState: number;
  setErrorMessage: React.Dispatch<React.SetStateAction<string | null>>;
  control: Control<Aimodel>;
};

const ChooseClass = ({ setCurrentState, control, getValues }: Props) => {
  const [hoveredClass, setHoveredClass] = useState<number | null>(null);
  const [seletType, setSelectType] = useState<string | null>("Man");
  const user = useSelector((state: RootState) => state.user);

  useEffect(() => {
    setSelectType(getValues("classType"));
  }, []);
  return (
    <div className=" w-full flex flex-col items-start text-center flex-grow justify-between overflow-auto">
      <div className="flex max-h-[485px]   flex-col items-center overflow-auto">
        <p className="text-sm font-light text-grey-100 mb-2 ">
          Choose the gender you most biologically resemble this is
          <br /> used for AI training purposes.
        </p>
        <div className="flex gap-5 justify-center mt-4">
          <Controller
            name="classType"
            control={control}
            render={({ field }) => (
              <div
                className={`relative flex flex-col w-[150px] h-[170px] items-center justify-center cursor-pointer ${
                  hoveredClass === 1
                    ? "bg-primary-main bg-opacity-10 border border-primary-main"
                    : "bg-grey-700 "
                } rounded-xl overflow-hidden  border border-transparent-main`}
                onMouseEnter={() => setHoveredClass(1)}
                onMouseLeave={() => setHoveredClass(null)}
                onClick={() => {
                  field.onChange((field.value = "Man"));
                  setSelectType("Man");
                }}
              >
                <div
                  className={`relative flex-grow  bg-grey-800
                }  w-40  h-40 flex justify-center items-center`}
                >
                  <Image
                    fill
                    src={ManVector}
                    alt=""
                    className="relative w-16 h-16 rounded-md"
                  />
                </div>
                <p
                  className={`w-full p-4 ${
                    hoveredClass === 1 || seletType === "Man"
                      ? "bg-primary-main text-common-white"
                      : "text-grey-200"
                  }`}
                >
                  Man
                </p>
                {hoveredClass === 1 || seletType === "Man" ? (
                  <div className="bg-primary-main bg-opacity-10 border border-primary-main rounded-xl absolute top-0 right-0 w-full h-full"></div>
                ) : null}
              </div>
            )}
          />
          <Controller
            name="classType"
            control={control}
            render={({ field }) => (
              <div
                className={`relative flex flex-col w-[150px] justify-between items-center cursor-pointer ${
                  hoveredClass === 2 || seletType === "Woman"
                    ? "bg-primary-main bg-opacity-10 border border-primary-main"
                    : "bg-grey-700 "
                }  rounded-xl overflow-hidden border border-transparent-main`}
                onMouseEnter={() => setHoveredClass(2)}
                onMouseLeave={() => setHoveredClass(null)}
                onClick={() => {
                  field.onChange((field.value = "Woman"));
                  setSelectType("Woman");
                }}
              >
                <div className=" relative flex-grow gap-2 bg-grey-800   w-40  h-20 flex justify-center items-center">
                  <Image
                    fill
                    src={WomanVector}
                    alt=""
                    className="relative w-16 h-16  rounded-md"
                  />
                </div>
                <p
                  className={`w-full p-4 ${
                    hoveredClass === 2 || seletType === "Woman"
                      ? "bg-primary-main text-common-white"
                      : " text-grey-200"
                  } `}
                >
                  Woman
                </p>
                {hoveredClass === 2 ? (
                  <div className="bg-primary-main bg-opacity-10 border border-primary-main rounded-xl absolute top-0 right-0 w-full h-full"></div>
                ) : null}{" "}
              </div>
            )}
          />
        </div>

        <div className="text-start w-4/5 mt-3">
          <p className="text-lg mt-2 font-light text-grey-400 pt-1 w-[80%] underline text-start">
            Why are there only two gender options?
          </p>
          <p className="mt-1 text-grey-400 font-light text-[12px]">
            At Witit, we value diversity and inclusiveness and acknowledge that
            gender is a personal and complex aspect of ones identity. If you
            choose to participate in one of Witit’s offerings for using AI to
            generate likeness, In order to accurately generate your likeness, we
            ask for your biological gender or for the gender that best
            represents you out of these options. However, we recognize that
            gender can encompass a range of identities and expressions, and our
            current technology is limited in its ability to capture these
            nuances.
          </p>
          <p className="mt-2 text-grey-400 font-light text-[12px]">
            We use the gender information you provide to help our AI understand
            the basic physical characteristics of your appearance, but we
            understand that it may not fully represent your gender identity. We
            do not showcase your gender anywhere else so you will never be
            misrepresented to the public. We are committed to working towards a
            future where our technology can better reflect the diversity of
            gender identities and expressions, and we appreciate your
            understanding in the meantime.
          </p>
        </div>
      </div>
      <div
        className={`w-full flex flex-col items-center h-[108px] bg-grey-800 pt-3 `}
      >
        <p
          className={` text-xs text-grey-400 ${
            user?.isModelTrained ? "visible" : "invisible"
          } `}
        >
          AI Yourself Will Cost you{" "}
          {<span className={` text-common-white  `}>450 Credits.</span>}
        </p>
        <CustomButton
          endIcon={
            <div
              className={`p-0 rotate-[270deg]
           scale-75 `}
            >
              <ArrowDownIcon />
            </div>
          }
          type="submit"
          name="Next"
          className={`w-[60%] py-2 max-w-[370px] mt-2`}
          handleEvent={() => setCurrentState((preState) => preState + 1)}
        />
        <p className="text-center text-error-main h-[13px]"></p>
      </div>
    </div>
  );
};

export default ChooseClass;
