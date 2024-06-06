import { Typography } from "@mui/material";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";

type Props = {
  loading: boolean;
};

const Loader = ({ loading }: Props) => {
  return (
    <Backdrop className="bg-secondary-main z-50" open={loading}>
      <div className="absolute top-[15%] flex flex-col justify-center items-center">
        <div className="relative w-[60px] h-[60px]">
          <CircularProgress
            variant="determinate"
            className="absolute text-common-white"
            size={60}
            thickness={4}
            value={100}
          />
          <CircularProgress
            variant="indeterminate"
            className="absolute text-primary-main duration-700"
            size={60}
            thickness={4}
            disableShrink
            color="inherit"
          />
        </div>

        {/* <Typography className="mt-12 text-5xl text-common-white">
          Redirecting...
        </Typography> */}
      </div>
    </Backdrop>
  );
};

export default Loader;
