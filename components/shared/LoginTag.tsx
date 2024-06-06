import { Box, Button, IconButton, SvgIconTypeMap } from "@mui/material";
import { OverridableComponent } from "@mui/material/OverridableComponent";

type Props = {
  title?: string;
  desc?: string;
  progress?: any;
  desWidth?: any;
  isLineRequired?: boolean;
} & Record<string, any>;

const LoginTag = (props: Props) => {
  const { title, desc, progress, desWidth, isLineRequired, ...restProps } =
    props;
  return (
    <>
      <div className="w-[100%] flex flex-col gap-1 ">
        {isLineRequired && <hr className="w-[40%] pb-5 text-common-white " />}
        <h3 className=" text-3xl font-semibold tracking-wider text-common-white">
          {title}
        </h3>
        <p
          className={`pt-1.5  sm:pb-5  pb-4 text-grey-200 font-light text-sm  w-[${desWidth}%]	`}
        >
          {desc}
        </p>
      </div>
    </>
  );
};

export default LoginTag;
