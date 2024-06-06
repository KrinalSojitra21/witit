import { createContext, useContext, useEffect, useState } from "react";
import { ImageInfo } from "@/types";
import appConstant, {
  defaultImageConstant,
} from "@/utils/constants/withoutHtml/appConstant";
import { GetAiGeneration, Model, PostAiGeneration } from "@/types/ai";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { io } from "socket.io-client";
import { useForm } from "react-hook-form";

type SelectedImage = {
  imagePreview: string;
  file: File;
};

type ContextType = {
  selectedImage: SelectedImage | null;
  setSelectedImage: React.Dispatch<React.SetStateAction<SelectedImage | null>>;
  selectedModel: Model | null;
  setSelectedModel: React.Dispatch<React.SetStateAction<Model | null>>;
  generations: GetAiGeneration[];
  setGenerations: React.Dispatch<React.SetStateAction<GetAiGeneration[]>>;
  prompt: string | null;
  setPrompt: React.Dispatch<React.SetStateAction<string | null>>;
  calculatedCharge: number;
  setCalculatedCharge: React.Dispatch<React.SetStateAction<number>>;
};

const defaultContext: ContextType = {
  selectedImage: null,
  setSelectedImage: () => {},
  selectedModel: null,
  setSelectedModel: () => {},
  generations: [],
  setGenerations: () => {},
  prompt: null,
  setPrompt: () => {},
  calculatedCharge: 0,
  setCalculatedCharge: () => {},
};

const Context = createContext<ContextType>(defaultContext);

function GenerationContext({ children }: { children: React.ReactNode }) {
  const [selectedModel, setSelectedModel] = useState<Model | null>(null);
  const [generations, setGenerations] = useState<GetAiGeneration[]>([]);
  const [prompt, setPrompt] = useState<string | null>(null);
  const [calculatedCharge, setCalculatedCharge] = useState<number>(0);
  const [selectedImage, setSelectedImage] = useState<SelectedImage | null>(
    null
  );

  const user = useSelector((state: RootState) => state.user);

  useEffect(() => {
    if (!user) return;

    const socket = io(appConstant.backendUrl, {
      path: "/socket.io",
      query: {
        userId: user.userId,
      },
      transports: ["websocket"],
    });

    socket.on("ImageGenerationResponse", (response: GetAiGeneration) => {
      setGenerations((generations) => {
        return generations.map((generation) => {
          if (generation.Id === response.Id) {
            return response;
          }
          return generation;
        });
      });
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <Context.Provider
      value={{
        selectedImage,
        setSelectedImage,
        selectedModel,
        setSelectedModel,
        generations,
        setGenerations,
        prompt,
        setPrompt,
        calculatedCharge,
        setCalculatedCharge,
      }}
    >
      {children}
    </Context.Provider>
  );
}

export default GenerationContext;

export const useGenerationContext = () => useContext(Context);
