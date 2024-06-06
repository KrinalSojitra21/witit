import { useAuthContext } from "@/context/AuthContext";
import { useRouter } from "next/router";

interface Props {
  style?: any;
  page?: any;
}
const Loginterms = ({ style, page }: any) => {
  const { setCustomDialogType } = useAuthContext();
  return page === "LOGIN" ? (
    <div
      className={`z-10   flex xl:justify-between lg:justify-center md:justify-between justify-center  py-5  md:px-12  w-[100%] ${style}`}
    >
      <h6 className="text-grey-200 xl:flex lg:hidden md:flex hidden font-light text-sm text-center  items-center ">
        © 2023 Witit Media Inc. All rights reserved.
      </h6>
      <div className="flex flex-row items-center justify-center gap-2  ">
        <h6
          className="text-grey-200 text-xs  font-light cursor-pointer	"
          onClick={() => setCustomDialogType("PRIVACYPOLICY")}
        >
          Privacy Policy
        </h6>
        <h4 className="text-grey-200 font-extralight text-sm">|</h4>
        <h6
          className="text-grey-200 text-xs font-light cursor-pointer	"
          onClick={() => setCustomDialogType("TERMSOFSERVICE")}
        >
          Terms and condition
        </h6>
      </div>
    </div>
  ) : (
    <div
      className={`z-10  flex lg:justify-between  justify-center  py-5  md:px-12  w-[100%] ${style}`}
    >
      <h6 className="text-grey-200 lg:flex  hidden font-light text-sm text-center  items-center ">
        © 2023 Witit Media Inc. All rights reserved.
      </h6>
      <div className="flex flex-row items-center justify-center gap-2  ">
        <h6
          className="text-grey-200 text-xs  font-light cursor-pointer	"
          onClick={() => setCustomDialogType("PRIVACYPOLICY")}
        >
          Privacy Policy
        </h6>
        <h4 className="text-grey-200 font-extralight text-sm">|</h4>
        <h6
          className="text-grey-200 text-xs font-light cursor-pointer"
          onClick={() => setCustomDialogType("TERMSOFSERVICE")}
        >
          Terms and condition
        </h6>
      </div>
    </div>
  );
};

export default Loginterms;
