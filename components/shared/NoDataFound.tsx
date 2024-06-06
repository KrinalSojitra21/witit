import CustomButton from "./CustomButton";
import { CustomImagePreview } from "./CustomImagePreview";

type Props = {
  title?: string;
  description?: string;
  image?: React.ReactElement;
  children?: React.ReactNode;
  buttonStyle?: string;
  buttonName?: string;
  handleEvent?: () => void;
  titleStyle?: string;
  descriptionStyle?: string;
};

export const NoDataFound = ({
  title,
  description,
  image,
  children,
  buttonName,
  titleStyle,
  buttonStyle,
  handleEvent,
  descriptionStyle,
}: Props) => {
  return (
    <div className="w-full h-full flex justify-center">
      <div className="w-[350px] h-full flex flex-col items-center text-grey-100  justify-center gap-2">
        {image ? <div className="text-grey-A100">{image}</div> : null}
        <div className=" flex flex-col items-center gap-1 w-full ">
          {title ? (
            <div className="text-grey-100">
              <p
                className={`text-2xl  font-semibold tracking-wide ${titleStyle}`}
              >
                {title}
              </p>
            </div>
          ) : null}
          {description ? (
            <div
              className={`text-sm text-grey-300 tracking-wider max-w-[300px] text-center ${descriptionStyle} `}
            >
              {description}
            </div>
          ) : null}
        </div>
        {buttonName ? (
          <CustomButton
            className={`w-full px-6 py-2.5 text-base rounded-lg font-normal ${buttonStyle}`}
            name={buttonName}
            onClick={handleEvent}
          />
        ) : null}
        {children}
      </div>
    </div>
  );
};
