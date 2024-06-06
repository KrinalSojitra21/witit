import toast, { Toaster } from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { generate } from "@/redux/slices/messageSlice";
import { theme } from "@/theme";

const style = {
  positiveToast: {
    borderRadius: "10px",
    background: theme.palette.success.main, //"#198754"
    color: theme.palette.common.white,
  },
  negativeToast: {
    borderRadius: "10px",
    background: theme.palette.error.main, //"#ff4444",
    color: theme.palette.common.white,
  },
};

let toastId: string;
const notify = (type: string, message: string) => {
  toast.remove();
  switch (type) {
    case "LOADING":
      toastId = toast.loading(message ?? "Loading...");
      break;
    case "SUCCESS":
      toast.success(message, {
        id: toastId ?? "",
        style: style.positiveToast,
        iconTheme: {
          primary: theme.palette.common.white,
          secondary: theme.palette.success.light,
        },
        duration: 4000,
      });
      break;
    case "ERROR":
      toast.error(message, {
        id: toastId ?? "",
        style: style.negativeToast,
        iconTheme: {
          primary: theme.palette.common.white,
          secondary: theme.palette.error.main,
        },
        duration: 4000,
      });
      break;
    default:
      break;
  }
};

const ToastMessage = () => {
  const dispatch = useDispatch();
  const messageData = useSelector((state: any) => state.message);

  useEffect(() => {
    if (messageData) {
      dispatch(generate(null));
      notify(messageData?.type, messageData?.message);
    }
  }, [messageData]);

  return <Toaster position="top-center" reverseOrder={false} gutter={8} />;
};

export default ToastMessage;
