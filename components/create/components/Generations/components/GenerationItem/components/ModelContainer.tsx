import CustomButton from "@/components/shared/CustomButton";
import { CustomImagePreview } from "@/components/shared/CustomImagePreview";
import { useAuthContext } from "@/context/AuthContext";
import { RootState } from "@/redux/store";
import { GetAiGeneration } from "@/types/ai";
import CopyIcon from "@/utils/icons/shared/CopyIcon";
import RocketIcon from "@/utils/icons/shared/RocketIcon";
import { IconButton } from "@mui/material";
import dayjs from "dayjs";
import { useSelector } from "react-redux";

const sliderSettings = {
  dots: false,
  infinite: true,
  speed: 500,
  slidesToShow: 5,
  slidesToScroll: 1,
  rtl: true,
  variableWidth: true,
  prevArrow: (
    <svg
      width="7"
      height="12"
      viewBox="0 0 7 12"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M5.5 1L2.20414 4.66207C1.51959 5.42268 1.51959 6.57732 2.20414 7.33793L5.5 11"
        stroke="#808080"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  ),
  nextArrow: (
    <svg
      width="6"
      height="12"
      viewBox="0 0 6 12"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M1 11L4.29586 7.33793C4.98041 6.57732 4.98041 5.42268 4.29586 4.66207L1 1"
        stroke="#808080"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  ),
};

type Props = {
  generation: GetAiGeneration;
};

export const ModelContainer = ({ generation }: Props) => {
  const user = useSelector((state: RootState) => state.user);

  const { sendNotification } = useAuthContext();

  const handleCopyProps = () => {
    // Copy profile link
    navigator.clipboard.writeText(generation.prompt);

    sendNotification({ type: "SUCCESS", message: "Prompt Coppied!!" });
  };

  return (
    <div className="w-full  flex flex-col items-end relative gap-2">
      <div className="flex gap-2 ">
        <div className="w-fit px-3 py-2 bg-primary-dark  border-[0.5px] border-solid cursor-auto border-primary-main text-xs tracking-widest font-light rounded-lg">
          {generation.modelDetails.name}
        </div>
        {generation.generatedFrom?.image ? (
          <div className="relative w-[35px] h-[35px] bg-grey-600 rounded-md overflow-hidden">
            <CustomImagePreview image={generation.generatedFrom?.image} />
          </div>
        ) : null}
      </div>
      <div className="w-fit flex flex-col items-end gap-2  relative ">
        <div className="w-full flex items-center justify-end gap-2">
          <IconButton
            className=" bg-grey-700 text-grey-200 hover:text-primary-main p-2.5 rounded-xl scale-[0.9]"
            onClick={() => handleCopyProps()}
          >
            <CopyIcon />
          </IconButton>
          <div className="bg-grey-700 flex flex-col rounded-lg rounded-br-none overflow-clip max-w-[900px] min-w-[600px] w-[60%]">
            <div
              className={`py-4 bg-grey-A400 ${
                generation.negativePrompt.length > 0
                  ? "border-b border-b-grey-400"
                  : ""
              }`}
            >
              <p className="w-full  text-common-white px-6 text-sm font-light tracking-wider transition-all leading-[22px]">
                {generation.prompt}
              </p>
            </div>
            {generation.negativePrompt.length > 0 ? (
              //   <div className="border-grey-500 border-t py-3 w-full overflow-clip">
              //     <Slider
              //       {...sliderSettings}
              //       className="w-full flex flex-row justify-start items-center"
              //     >
              //       {generation.negativePrompt.map((name, index) => {
              //         return (
              //           <div key={index} className="flex justify-center px-1">
              //             <CustomButton
              //               name={name}
              //               className=" bg-error-dark border border-solid cursor-auto border-error-light text-xs font-normal"
              //             />
              //           </div>
              //         );
              //       })}
              //     </Slider>
              //   </div>
              <div className="flex gap-1.5 p-3 overflow-auto">
                {generation.negativePrompt.map((name, index) => {
                  return (
                    <div key={index} className="flex justify-center">
                      <div className="bg-error-light border border-solid border-error-main text-xs font-normal rounded-md hover:bg-error-main px-3 py-1.5 cursor-default">
                        {name}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : null}
          </div>
        </div>
        <div className="flex gap-2 items-center">
          {generation.superShoot ? (
            <div className=" scale-[0.6] text-primary-main">
              <RocketIcon />
            </div>
          ) : null}
          <p className="text-grey-400 text-sm">
            {dayjs(generation.createdAt).format("hh:mm A")}
          </p>
        </div>
      </div>
    </div>
  );
};
