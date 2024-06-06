import { CustomImagePreview } from "@/components/shared/CustomImagePreview";
import { CustomTooltip } from "@/components/shared/CustomTooltip";
import { Image } from "@/types/post";
import { GenerationActionList } from "@/utils/constants/withHtml/ai";
import { Box, Dialog, IconButton } from "@mui/material";

type Props = {
  handleClose: () => void;
  aspectRatio: string;
  imageView: Image;
  handleImageAction: ({ type }: { type: string }) => void;
};

export const ImagePreview = ({
  handleClose,
  aspectRatio,
  imageView,
  handleImageAction,
}: Props) => {
  return (
    <Dialog
      open={true}
      onClose={handleClose}
      className="[&_.MuiPaper-root]:bg-transparent-main [&_.MuiPaper-root]:shadow-none backdrop-contrast-75"
    >
      <div className=" flex  gap-3 flex-row ">
        <Box
          sx={{ aspectRatio }}
          className="w-[400px] relative rounded-lg border border-grey-500 shadow-2xl bg-grey-600 overflow-hidden"
        >
          <CustomImagePreview image={imageView.url} blurhash={imageView.blurhash} />
        </Box>
        <div className="flex h-fit flex-col gap-2 py-2 m-0">
          {GenerationActionList.map((item, index) => {
            return (
              <CustomTooltip key={index} title={item.title} placement="right">
                <IconButton
                  className="w-[30px] h-[30px] rounded-md bg-grey-600 bg-opacity-80 hover:bg-primary-main p-2 m-0"
                  onClick={() =>
                    handleImageAction({
                      type: item.actionType ? item.actionType : "",
                    })
                  }
                >
                  {item.startIcon}
                </IconButton>
              </CustomTooltip>
            );
          })}
        </div>
      </div>
    </Dialog>
  );
};
