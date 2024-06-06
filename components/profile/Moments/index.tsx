import React, { useState } from "react";
import { Checkbox, Divider, Grid } from "@mui/material";
import Image from "next/image";
import temp1 from "@/utils/images/temp4.jpg";
import CreateMomentIcon from "@/utils/icons/profile/CreateMomentIcon";
import CloseIcon from "@/utils/icons/shared/CloseIcon";
import LikeIcon from "@/utils/icons/shared/LikeIcon";
import CasualCategoryIcon from "@/utils/icons/createPost/selectCategoryIcons/CasualCategoryIcon";
import { theme } from "@/theme";
import VerifiedIcon from "@/utils/icons/circle/VerifiedIcon";
import { useAuthContext } from "@/context/AuthContext";
import { Favorite, FavoriteBorder } from "@mui/icons-material";
import { ComingSoon } from "@/components/shared/ComingSoon";

const MomentList = ["1", "2", "3", "4", "5", "6"];

const styles = {
  responsiveGrid: {
    xxl: 2,
    xl: 3,
    lg: 6,
    md: 6,
    sm: 6,
    xs: 6,
  },
};
const Moments = () => {
  const [isMomentHoverd, setisMomentHoverd] = useState({
    isHover: false,
    index: 0,
  });
  const { setCustomDialogType } = useAuthContext();

  return (
    <div className="w-full h-full flex items-center justify-center">
      <ComingSoon />
    </div>
  );

  return (
    <div className="h-full overflow-auto px-5">
      <Grid container spacing={2} columns={6}>
        <Grid item {...styles.responsiveGrid}>
          <div
            className=" w-full h-full bg-grey-800 border-dashed border-grey-500 border-2 rounded-xl  gap-3 flex flex-col justify-center items-center cursor-pointer"
            onClick={() => {
              // setCustomDialogType("CREATEMOMENT");
            }}
          >
            <div className=" scale-125">
              <CreateMomentIcon />
            </div>
            <p className=" text-grey-100 tracking-wider">Create New Moment</p>
          </div>
        </Grid>
        {MomentList.map((Moment, index) => {
          return (
            <Grid key={index} item {...styles.responsiveGrid}>
              <div
                className=" w-full  bg-grey-800 rounded-xl overflow-hidden"
                onMouseEnter={() =>
                  setisMomentHoverd({ isHover: true, index: index })
                }
                onMouseLeave={() =>
                  setisMomentHoverd({ isHover: false, index: index })
                }
              >
                <div className="  flex flex-col gap-3 relative 2xl:p-5 p-2">
                  {isMomentHoverd.isHover && isMomentHoverd.index === index ? (
                    <div
                      onClick={() => {}}
                      className={`bg-gradient-to-b from-[#121315] via-[#17181b00] to-[#17181b00] w-full h-full
                        flex absolute z-20 top-0 right-0 justify-end  p-3 rounded-md `}
                    >
                      <div className="flex gap-2.5 items-center h-fit ">
                        <div className="flex gap-1.5 items-center">
                          <Checkbox
                            onClick={(e) => {
                              e.stopPropagation();
                            }}
                            icon={
                              <FavoriteBorder className=" text-common-white" />
                            }
                            checkedIcon={<Favorite color="error" />}
                          />
                          <p>123</p>
                        </div>
                        <div className="flex gap-1.5 items-center">
                          <div className=" scale-[0.65]">
                            <CasualCategoryIcon />
                          </div>
                          <p>123</p>
                        </div>
                      </div>
                    </div>
                  ) : null}
                  <div className="flex w-full rounded-md">
                    {MomentList.map((image, index) => {
                      return (
                        <div key={index} className=" min-w-[25%] p-1 relative">
                          {index < 4 ? (
                            <Image
                              fill
                              src={temp1}
                              alt=""
                              className="relative rounded-md  "
                            />
                          ) : (
                            <></>
                          )}
                          {MomentList.length > 4 && index === 3 ? (
                            <div className="  p-1 absolute z-20 w-full h-full top-0 left-0 ">
                              <div className=" w-full h-full flex justify-center items-center text-4xl bg-secondary-light rounded-md">
                                +{MomentList.length - 4}
                              </div>
                            </div>
                          ) : null}
                        </div>
                      );
                    })}
                  </div>
                </div>{" "}
                <Divider
                  sx={{
                    borderColor: theme.palette.grey[500],
                  }}
                />
                <div className="p-5 bg-grey-700">
                  <div className=" flex items-center gap-3 ">
                    <Image
                      fill
                      src={temp1}
                      alt=""
                      className="relative w-[54px] h-[54px] rounded-full  border-2 border-grey-500"
                    />
                    <div className="w-full ">
                      <div className=" flex justify-between w-full">
                        <div className="flex gap-1 items-center">
                          <p className="text-base font-light">Gerdes</p>
                          <div className=" text-primary-light scale-[0.65]">
                            <VerifiedIcon />
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          <div className="bg-grey-100 rounded-full w-1 h-1"></div>
                          <p className="text-grey-100 text-xs font-light">
                            1 min ago
                          </p>
                        </div>
                      </div>
                      <p className="text-grey-100 text-xs font-light tracking-wide">
                        Currently out doing things and stuff. May want to do
                        more stuff, idk.{" "}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </Grid>
          );
        })}
      </Grid>
    </div>
  );
};

export default Moments;
