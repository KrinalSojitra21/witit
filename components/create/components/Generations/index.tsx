import { CircularProgress } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { getGenerations } from "@/api/ai/getGenerations";
import { useAuthContext } from "@/context/AuthContext";
import InfiniteScroll from "react-infinite-scroll-component";
import { GenerationItem } from "./components/GenerationItem";
import { useGenerationContext } from "../../context/GenerationContext";
import { NoDataFound } from "@/components/shared/NoDataFound";
import { CustomImagePreview } from "@/components/shared/CustomImagePreview";
import CreateIcon from "@/utils/icons/navbar/CreateIcon";

type GenerationApiProps = {
  lastDocId?: string;
};

type DayItem = {
  id: string;
  day: string;
};

let docLimit = 10;

export const GenerationList = () => {
  const { sendNotification } = useAuthContext();
  const { generations, setGenerations } = useGenerationContext();

  const user = useSelector((state: RootState) => state.user);

  const [hasMoreGeneration, setHasMoreGeneration] = useState(true);
  const [listOfDays, setListOfDays] = useState<DayItem[]>([]);

  const ref = useRef<HTMLDivElement | null>(null);

  const generationApi = async ({ lastDocId }: GenerationApiProps) => {
    if (!user) return;

    const result = await getGenerations({
      user_id: user.userId,
      limit: docLimit,
      ...(lastDocId && { lastDocId }),
    });

    if (result.status === 200) {
      const currentGenerations = result.data;
      if (currentGenerations.length < docLimit) {
        setHasMoreGeneration(false);
      }
      if (currentGenerations.length > 0) {
        if (lastDocId) {
          setGenerations([...generations, ...currentGenerations]);
          return;
        }
        setGenerations(currentGenerations);
      }
      return;
    }

    sendNotification({ type: "ERROR", message: result.error });
  };

  useEffect(() => {
    generationApi({});

    // return () => {
    //   generationApi({});
    // };
  }, []);

  const fetchMoreGeneration = async () => {
    const lastDocId = generations[generations.length - 1].Id;

    generationApi({
      lastDocId,
    });
  };

  if (generations.length === 0 && !hasMoreGeneration)
    return (
      <div className="  h-full w-full ">
        <NoDataFound
          image={
            <div className="relative h-[90px] w-[90px] flex justify-center items-center ">
              <CreateIcon size="90" />
            </div>
          }
          title="No Creation yet"
          description="Haven't made anything yet. Start making cool AI images!"
        />
      </div>
    );

  return (
    <>
      <div className="relative h-full rounded-xl bg-grey-900 overflow-auto">
        <div
          id="generationScrollableDiv"
          className="p-3 pt-5 overflow-auto h-full flex flex-col-reverse"
          ref={ref}
        >
          <InfiniteScroll
            inverse={true}
            dataLength={generations.length}
            next={fetchMoreGeneration}
            hasMore={hasMoreGeneration}
            loader={
              <div className="mb-4 text-common-black text-center w-full overflow-hidden">
                <CircularProgress size={20} className="text-common-white" />
              </div>
            }
            style={{ display: "flex", flexDirection: "column-reverse" }}
            scrollableTarget="generationScrollableDiv"
          >
            {generations.map((generation, index) => (
              <GenerationItem
                key={index}
                generation={generation}
                listOfDays={listOfDays}
                setListOfDays={setListOfDays}
              />
            ))}
          </InfiniteScroll>
        </div>
      </div>
    </>
  );
};
