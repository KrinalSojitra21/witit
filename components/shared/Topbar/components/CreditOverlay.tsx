import RighCrossArrowIcon from "@/utils/icons/shared/RighCrossArrowIcon";
import CustomButton from "../../CustomButton";
import CreditIcon from "@/utils/icons/topbar/CreditIcon";
import { Divider } from "@mui/material";
import Image from "next/image";
import HypeTriangleIcon from "@/utils/icons/shapes/HypeTriangleIcon";
import { theme } from "@/theme";
import { crossLineBg } from "@/utils/images";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { CreditItem } from "@/types/user";
import { useAuthContext } from "@/context/AuthContext";
import DollerIcon from "@/utils/icons/levelUp/DollerIcon";
import { CustomImagePreview } from "../../CustomImagePreview";
import { dollerImage } from "@/utils/images/topbar";
import GradientCrown from "@/utils/icons/levelUp/GradientCrown";
import { setPaymentStatus } from "@/redux/slices/paymentStatusSlice";

type Props = {
  creditList: CreditItem[];
  handleButtonClick: ({ type }: { type: string }) => void;
};

export const CreditOverlay = ({ handleButtonClick, creditList }: Props) => {
  const user = useSelector((state: RootState) => state.user);
  const payment = useSelector((state: RootState) => state.payments);

  const dispatch = useDispatch();

  const { amountPerCredit } = useAuthContext();

  return (
    <div className="absolute top-20 max-w-[430px] right-36 z-[100]  ">
      <div className=" absolute top-[-24px] text-primary-main right-12 rounded-[4px]">
        <div className="scale-[2.5] text-primary-main">
          <HypeTriangleIcon />
        </div>
      </div>
      <div className="flex flex-col bg-grey-800 rounded-2xl overflow-hidden shadow-2xl">
        <div className="relative flex gap-3  bg-primary-main ">
          <div className="absolute w-full h-full">
            <Image fill src={crossLineBg} alt="" className=" object-none" />
          </div>
          <div className="px-7 py-4 flex gap-2 items-center">
            <div className="cursor-pointer scale-90">
              <CreditIcon />
            </div>
            <p className="text-base font-medium ">Credits</p>
          </div>
        </div>
        <div className="p-6 flex flex-col gap-5 ">
          {creditList.map((data, index) => {
            if (
              user?.userType !== "VERIFIED" &&
              data.name !== "Non Transferable Credit"
            )
              return;
            return (
              <div key={index} className="flex flex-col gap-5 ">
                <div className="flex gap-5 items-start">
                  <div className="flex flex-col gap-1">
                    <p className="text-sm"> {data.name}</p>
                    <p className="text-xs font-light text-grey-200">
                      {data.description}
                    </p>
                  </div>
                  <div>
                    <div className="flex gap-1 items-center">
                      <div className="cursor-pointer scale-[0.65]">
                        <CreditIcon />
                      </div>
                      <p className={`text-lg font-semibold ${data.color}`}>
                        {data.credit}
                      </p>
                    </div>
                    <p className="float-right text-grey-200">
                      ${(amountPerCredit.withdraw * data.credit).toFixed(2)}
                    </p>
                  </div>
                </div>
                {index < 2 && user?.userType === "VERIFIED" ? (
                  <Divider
                    sx={{
                      borderColor: theme.palette.grey[500],
                    }}
                  />
                ) : null}
              </div>
            );
          })}
          <div className="flex gap-4">
            <CustomButton
              startIcon={
                <div className="scale-50 rotate-180">
                  <RighCrossArrowIcon />
                </div>
              }
              handleEvent={() => {
                handleButtonClick({ type: "ADD" });
                dispatch(setPaymentStatus(""));
              }}
              name="Deposit"
              className="shadow-none py-2 text-sm"
            />
            {user?.userType === "VERIFIED" && (
              <CustomButton
                startIcon={
                  <div className="scale-50">
                    <RighCrossArrowIcon />
                  </div>
                }
                handleEvent={() => {
                  handleButtonClick({ type: "WITHDRAW" });
                  dispatch(setPaymentStatus(""));
                }}
                name="Withdraw"
                className="bg-grey-700 shadow-none py-2 text-sm"
              />
            )}
          </div>
          {user?.userType !== "VERIFIED" && (
            <div className="relative py-4 px-5 flex gap-3 items-start border-[0.5px] border-[#1E477E] rounded-xl bg-[#172029]">
              <div className="w-[26px] aspect-square relative mt-0.5">
                <CustomImagePreview image={dollerImage} />
              </div>
              <div>
                <h3 className="font-semibold bg-gradient-to-bl from-[#4DF] to-[#197EF4] bg-clip-text text-transparent-main">
                  Start Withdrawing
                </h3>
                <p className="text-blue-dark text-xs">
                  Start withdrawing dollars by{" "}
                  <span className="font-medium text-blue-light">
                    Go Pro Premium
                  </span>{" "}
                  Feature.
                </p>
              </div>
              <div className="absolute -top-8 right-6 w-[20px] aspect-square">
                <GradientCrown />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
