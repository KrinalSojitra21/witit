import congratulations from "../../utils/images/congratulations.png";
import Image from "next/image";
import { Box } from "@mui/system";
import CustomButton from "@/components/shared/CustomButton";
import { useRouter } from "next/router";
import CustomDialog from "../shared/dialog/CustomDialog";
import appConstant from "@/utils/constants/withoutHtml/appConstant";
import { CustomImagePreview } from "../shared/CustomImagePreview";

export default function CongratulationsDialog() {
  const router = useRouter();
  const signUpComplete = () => {
    router.push(appConstant.pageRoute.create);
  };

  return (
    <CustomDialog isOpen={true} className="w-[450px] md:max-w-[500px] h-fit">
      <div className="relative w-full h-[250px]">
        <CustomImagePreview image={congratulations} />
      </div>
      <h1 className="mt-6 sm:mt-10 text-xl sm:text-2xl md:text-3xl text-common-white text-center font-semibold px-5 overflow-hidden md:leading-[2.75rem] tracking-[0.1rem]">
        Congratulations! <br />
        You’re all set!
      </h1>

      <Box className="flex p-8 sm:p-10 md:p-16 md:pt-10">
        <CustomButton
          handleEvent={() => signUpComplete()}
          type="button"
          name="Get Started!"
        />
      </Box>
    </CustomDialog>
  );
}
