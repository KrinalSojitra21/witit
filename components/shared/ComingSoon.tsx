import { comingSoon } from "@/utils/images";
import Image from "next/image";
import { CustomImagePreview } from "./CustomImagePreview";

export const ComingSoon = () => {
  return (
    <div className="relative min-w-[260px] w-[30%]  aspect-square">
      <CustomImagePreview image={comingSoon} />
    </div>
  );
};
