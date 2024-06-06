import Image from "next/image";
import companyLogo from "@/utils/images/witit.svg";
import { CustomImagePreview } from "./CustomImagePreview";
import { wititImage } from "@/utils/images";

interface Props {
  withBottomText?: boolean;
  style?: any;
  onClick: () => void;
}

const MainLogo = ({ withBottomText, style, onClick }: Props) => {
  return (
    <div onClick={onClick} className={`relative cursor-pointer ${style}`}>
      <div className="h-8 aspect-[3] relative bg-transparent ">
        <CustomImagePreview image={wititImage} />
      </div>
      {withBottomText && (
        <h2 className="mt-[-8px] text-center text-base font-bold leading-9 tracking-tight text-common-white">
          go get it
        </h2>
      )}
    </div>
  );
};

export default MainLogo;
